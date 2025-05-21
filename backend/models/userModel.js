const mongoose = require("mongoose");
const { Schema } = mongoose;
const Plan = require("./planModel");
const Match = require("./matchModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Coin Schema
const coinSchema = new Schema({
  id: { type: String, required: true },
  shareableCode: { type: String, required: true },
  activeAt: { type: Date },
  expiresAt: { type: Date }, // Will be set when used
  usedAt: { type: String, default: null }, // Used by email
});

// Key Schema
const keySchema = new Schema({
  id: { type: String, required: true },
  shareableCode: { type: String, required: true },
  plan: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  coin: [coinSchema],
});

// Format createdAt
keySchema.virtual('formattedCreatedAt').get(function () {
  return this.createdAt.toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: true,
  });
});

// Transaction Schema
const transactionSchema = new Schema({
  transactionId: { type: String, required: true },
  userId: { type: String, required: true },
  plan: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionDate: { type: Date, default: Date.now },
});

// User Schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10,15}$/, "Please enter a valid phone number"],
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

// Middleware: hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Methods
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

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

userSchema.methods.approveTransaction = async function (transactionId, coinsToAdd, planId) {
  const txn = this.transactions.find(t => t.transactionId === transactionId);
  if (!txn) throw new Error('Transaction not found');
  const plan = await Plan.findById(planId);
  if (!plan) throw new Error('Plan not found');

  txn.status = 'completed';

  const coins = Array.from({ length: coinsToAdd }, (_, i) => ({
    id: `coin-${Date.now()}-${i}`,
    shareableCode: `COIN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    activeAt: null,
    expiresAt: null,
    usedAt: null,
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

userSchema.methods.rejectTransaction = function (transactionId) {
  const txn = this.transactions.find(t => t.transactionId === transactionId);
  if (!txn) throw new Error('Transaction not found');
  txn.status = 'rejected';
  return this.save();
};

userSchema.methods.useCoin = function (shareableCode, usedByEmail) {
  for (const key of this.keys) {
    for (const coin of key.coin) {
      if (coin.shareableCode === shareableCode && !coin.usedAt) {
        const now = new Date();
        coin.usedAt = usedByEmail;
        coin.activeAt = now;
        coin.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // expires in 24h
        this.coinAvailable -= 1;
        return this.save();
      }
    }
  }
  throw new Error('Coin not found or already used.');
};

userSchema.methods.isCoinExpired = function (shareableCode) {
  for (const key of this.keys) {
    for (const coin of key.coin) {
      if (coin.shareableCode === shareableCode) {
        if (!coin.usedAt || !coin.expiresAt) return false;
        return new Date() > new Date(coin.expiresAt);
      }
    }
  }
  throw new Error('Coin not found.');
};

userSchema.methods.redeemCoin = async function (shareableCode, matchId) {
  for (const key of this.keys) {
    for (const coin of key.coin) {
      if (coin.shareableCode === shareableCode && !coin.usedAt) {
        const now = new Date();
        coin.usedAt = this.email;
        coin.activeAt = now;
        coin.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const match = await Match.findById(matchId);
        if (!match) throw new Error('Match not found');
        match.usedWithCoin = true;
        await match.save();

        this.coinAvailable -= 1;
        await this.save();

        return {
          success: true,
          message: "Coin successfully redeemed for the match.",
          redeemedCoin: coin,
          match: {
            matchId: match._id,
            matchName: match.name,
          },
        };
      }
    }
  }
  throw new Error('Coin not found or already used.');
};

userSchema.methods.countActiveCoins = function () {
  let count = 0;
  for (const key of this.keys) {
    for (const coin of key.coin) {
      if (!coin.usedAt) count++;
    }
  }
  return count;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
