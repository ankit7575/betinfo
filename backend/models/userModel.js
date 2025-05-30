// models/userModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Plan = require("./planModel");

// --- Coin Schema (One coin = one match event only) ---
const coinSchema = new Schema({
  id: { type: String, required: true }, // Unique coin ID
  shareableCode: { type: String, required: true },
  activeAt: { type: Date },
  expiresAt: { type: Date }, // Set when redeemed
  usedAt: { type: Date, default: null }, // When redeemed
  usedForEventId: { type: String, default: null }, // Which match/event
});

// --- Key Schema ---
const keySchema = new Schema({
  id: { type: String, required: true },
  shareableCode: { type: String, required: true },
  plan: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  coin: [coinSchema],
});

keySchema.virtual('formattedCreatedAt').get(function () {
  return this.createdAt.toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: true,
  });
});

// --- Transaction Schema ---
const transactionSchema = new Schema({
  transactionId: { type: String, required: true },
  userId: { type: String, required: true }, // User email
  plan: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionDate: { type: Date, default: Date.now },
});

// --- User Schema ---
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    // ALLOW: must start with +, then 7-18 digits
    match: [/^\+\d{7,18}$/, "Please enter a valid phone number with country code (e.g., +911234567890)"],
  },
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  keys: [keySchema],
  transactions: [transactionSchema],
  keysAvailable: { type: Number, default: 0 },
  coinAvailable: { type: Number, default: 0 },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// --- Middleware: Hash password before save if modified ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// --- User Methods ---

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Get JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Get Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

// Add a transaction
userSchema.methods.addTransaction = function (transactionId, plan) {
  this.transactions.push({
    transactionId,
    userId: this.email,
    plan,
    status: 'pending',
    transactionDate: new Date(),
  });
  return this.save();
};

// Approve a transaction and assign coins
userSchema.methods.approveTransaction = async function (transactionId, coinsToAdd, planId) {
  const txn = this.transactions.find(t => t.transactionId === transactionId);
  if (!txn) throw new Error('Transaction not found');
  const plan = await Plan.findById(planId);
  if (!plan) throw new Error('Plan not found');

  txn.status = 'completed';

  // Generate coins for the plan
  const coins = Array.from({ length: coinsToAdd }, (_, i) => ({
    id: `coin-${Date.now()}-${i}`,
    shareableCode: `COIN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    activeAt: null,
    expiresAt: null,
    usedAt: null,
    usedForEventId: null,
  }));

  const key = {
    id: `key-${Date.now()}`,
    shareableCode: `KEY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    plan: plan._id,
    status: 'active',
    createdAt: new Date(),
    coin: coins,
  };

  this.keys.push(key);
  this.keysAvailable += 1;
  this.coinAvailable += coinsToAdd;
  await this.save();
  return this;
};

// Reject a transaction
userSchema.methods.rejectTransaction = function (transactionId) {
  const txn = this.transactions.find(t => t.transactionId === transactionId);
  if (!txn) throw new Error('Transaction not found');
  txn.status = 'rejected';
  return this.save();
};

// --- Redeem Coin: One coin = One match event only ---
userSchema.methods.redeemCoinForEvent = function (coinId, eventId) {
  for (const key of this.keys) {
    for (const coin of key.coin) {
      if (
        coin.id === coinId &&
        !coin.usedAt &&
        !coin.usedForEventId
      ) {
        const now = new Date();
        coin.usedAt = now;
        coin.usedForEventId = eventId;
        coin.activeAt = now;
        coin.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

        this.coinAvailable = Math.max(0, (this.coinAvailable || 0) - 1);
        return this.save().then(() => ({
          success: true,
          message: "Coin successfully redeemed for this match event.",
          redeemedCoin: coin
        }));
      }
    }
  }
  throw new Error('Coin not found or already used/redeemed.');
};

// Check if user has a valid coin for an event
userSchema.methods.hasValidCoinForEvent = function (eventId) {
  const now = new Date();
  for (const key of this.keys) {
    for (const coin of key.coin) {
      if (
        coin.usedForEventId === eventId &&
        coin.usedAt &&
        coin.expiresAt &&
        new Date(coin.expiresAt) > now
      ) {
        return true;
      }
    }
  }
  return false;
};

// Count all coins available for use (unused for any event)
userSchema.methods.countActiveCoins = function () {
  let count = 0;
  for (const key of this.keys) {
    for (const coin of key.coin) {
      if (!coin.usedAt && !coin.usedForEventId) count++;
    }
  }
  return count;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
