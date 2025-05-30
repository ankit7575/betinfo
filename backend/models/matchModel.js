// models/matchModel.js

const mongoose = require('mongoose');

// Odds (for Betfair API odds array)
const oddsSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  size: { type: Number, required: true }
}, { _id: false });

// Admin odds/amount/profit history per runner (for lay/back tracking)
const adminOddsHistorySchema = new mongoose.Schema({
  odds: {
    back: { type: Number, default: 0 },
    lay: { type: Number, default: 0 }
  },
  Ammount: {
    back: { type: Number, default: 0 },
    lay: { type: Number, default: 0 }
  },
  Profit: {
    back: { type: Number, default: 0 },
    lay: { type: Number, default: 0 }
  },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

// Admin-set odds for each runner
const adminBetfairOddsSchema = new mongoose.Schema({
  selectionId: { type: Number, required: true },
  runnerName: { type: String, required: true },
  odds: {
    back: { type: Number, default: 0 },
    lay: { type: Number, default: 0 }
  },
  Ammount: {
    back: { type: Number, default: 0 },
    lay: { type: Number, default: 0 }
  },
  Profit: {
    back: { type: Number, default: 0 },
    lay: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  layingHistory: [adminOddsHistorySchema]
}, { _id: false });

// User-specific odds snapshot history (per update)
const userBetfairOddsHistorySchema = new mongoose.Schema({
  odds: {
    back: { type: Number, default: 0 },
    lay: { type: Number, default: 0 }
  },
  Ammount: {
    back: { type: Number, default: 0 },
    lay: { type: Number, default: 0 }
  },
  Profit: {
    back: { type: Number, default: 0 },
    lay: { type: Number, default: 0 }
  },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

// User-calculated odds for a runner (per user, per runner)
const userBetfairOddsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  selectionId: { type: Number, required: true },
  runnerName: { type: String, required: true },
  odds: {
    back: { type: Number, default: 0 },
    lay: { type: Number, default: 0 }
  },
  Ammount: {
    back: { type: Number, default: 0 },
    lay: { type: Number, default: 0 }
  },
  Profit: {
    back: { type: Number, default: 0 },
    lay: { type: Number, default: 0 }
  },
  referenceAdminOpeningBalance: { type: Number, default: 200000 },
  userOpeningBalance: { type: Number },
  createdAt: { type: Date, default: Date.now },
  history: [userBetfairOddsHistorySchema]
}, { _id: false });

// Real-time runner odds from Betfair API (for market display)
const runnerOddsSchema = new mongoose.Schema({
  selectionId: { type: Number, required: true },
  runnerName: { type: String, required: true },
  lastPriceTraded: { type: Number },
  availableToBack: [oddsSchema],
  availableToLay: [oddsSchema],
  oddsHistory: [{
    availableToBack: [oddsSchema],
    availableToLay: [oddsSchema],
    timestamp: { type: Date, default: Date.now }
  }]
}, { _id: false });

// --- Main Match Schema ---
const matchSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  eventName: { type: String },
  tournamentId: { type: String },
  competitionName: { type: String, required: true },
  sportName: { type: String },

  // --- Admin controls ---
  selected: { type: Boolean, default: true },
  adminStatus: { type: String, default: "" }, // e.g., Rainy, Postponed

  // Runners/Players info
  matchRunners: [
    {
      runnerName: { type: String, required: true },
      runnerId: { type: String }
    }
  ],

  // Market info
  markets: [
    {
      marketId: { type: String, required: true },
      marketName: { type: String }
    }
  ],

  openDate: { type: Date, required: true },
  expiresAt: { type: Date }, // <-- For TTL auto-delete after 48 hours

  status: { type: String }, // Fetched/derived

  // Scoreboard/Stats (example for cricket)
  scoreData: {
    score: { type: String },
    score2: { type: String },
    wicket: { type: String },
    wicket2: { type: String },
    ballsdone: { type: Number },
    ballsdone2: { type: Number },
    team1: { type: String },
    team2: { type: String }
  },

  openingbalance: { type: Number, default: 200000 },

  // Investment history for this match
  userOpeningbalanceHistory: [{
    userId: { type: String },
    amount: { type: Number },
    date: { type: Date, default: Date.now }
  }],

  // --- Odds Data ---
  adminBetfairOdds: [adminBetfairOddsSchema], // Admin-defined
  betfairOdds: [runnerOddsSchema],            // Live odds feed
  userBetfairOdds: [userBetfairOddsSchema],   // User-calculated

}, { timestamps: true });

// --- Indexes for faster query ---
matchSchema.index({ eventId: 1, sportName: 1 }, { unique: true });
// --- TTL index for auto-delete after 48 hours
matchSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save: Validate & set expiresAt
matchSchema.pre('save', function (next) {
  // Validate required runner fields
  for (const adminOdds of this.adminBetfairOdds) {
    if (!adminOdds.runnerName || !adminOdds.selectionId) {
      return next(new Error('runnerName and selectionId must be set in adminBetfairOdds.'));
    }
  }
  // Set expiresAt to 48 hours after openDate if not already set
  if (!this.expiresAt && this.openDate) {
    this.expiresAt = new Date(this.openDate.getTime() + 48 * 60 * 60 * 1000);
  }
  next();
});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
