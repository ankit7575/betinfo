const mongoose = require("mongoose");
const { Schema } = mongoose;

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  totalCoins: { type: Number, required: true }, // Total number of coins associated with the plan
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // Added updatedAt for better tracking of plan modifications
});

// Trigger that updates the `updatedAt` field when the plan is updated
planSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
