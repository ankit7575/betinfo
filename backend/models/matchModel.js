const mongoose = require('mongoose');

// Odds schema
const oddsSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  size: { type: Number, required: true }
}, { _id: false });

// Admin odds/amount/profit history schema
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

// Admin Betfair Odds schema (for team1, team2 etc.)
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

// User-specific odds history (per snapshot)
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
  // No expiresAt in history for frontend!
}, { _id: false });

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
  history: [userBetfairOddsHistorySchema] // per update
  // expiresAt is NOT included in the schema that is sent to frontend!
}, { _id: false });

// Runner odds from Betfair API (unchanged)
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

// Match Schema
const matchSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  eventName: { type: String },
  tournamentId: { type: String },
  competitionName: { type: String, required: true },
  sportName: { type: String },

  // === Admin Selection and Status fields ===
  selected: { type: Boolean, default: false },             // Admin can select this match for frontend display
  adminStatus: { type: String, default: "" },              // Admin can write any custom status (Rainy, Postponed, etc.)

  matchRunners: [
    {
      runnerName: { type: String, required: true },
      runnerId: { type: String }
    }
  ],

  markets: [
    {
      marketId: { type: String, required: true },
      marketName: { type: String }
    }
  ],

  openDate: { type: Date, required: true },
  status: { type: String }, // System/live/fetched status

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

  userOpeningbalanceHistory: [{
    userId: { type: String },
    amount: { type: Number },
    date: { type: Date, default: Date.now }
  }],

  adminBetfairOdds: [adminBetfairOddsSchema],

  betfairOdds: [runnerOddsSchema],

  userBetfairOdds: [userBetfairOddsSchema]

}, { timestamps: true });

matchSchema.index({ eventId: 1, sportName: 1 }, { unique: true });

matchSchema.pre('save', function (next) {
  this.adminBetfairOdds.forEach(adminOdds => {
    if (!adminOdds.runnerName || !adminOdds.selectionId) {
      return next(new Error('runnerName and selectionId must be set in adminBetfairOdds.'));
    }
  });
  next();
});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
