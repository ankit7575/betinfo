const mongoose = require('mongoose');
const Match = require('./matchModel'); // Import Match model from matchModel.js

// Function to generate auto odds based on user investment
const generateAutoOdds = (lastPriceTraded, totalMatched, userInvestment) => {
  const adjustmentFactor = 1 + (userInvestment * 0.0001); // Example formula to adjust odds based on investment
  
  const availableToBack = [
    { price: lastPriceTraded + (totalMatched * 0.1) * adjustmentFactor, size: totalMatched * 0.5 },
    { price: lastPriceTraded + (totalMatched * 0.2) * adjustmentFactor, size: totalMatched * 0.3 },
    { price: lastPriceTraded + (totalMatched * 0.3) * adjustmentFactor, size: totalMatched * 0.2 },
  ];
  
  const availableToLay = [
    { price: lastPriceTraded - (totalMatched * 0.1) * adjustmentFactor, size: totalMatched * 0.5 },
    { price: lastPriceTraded - (totalMatched * 0.2) * adjustmentFactor, size: totalMatched * 0.3 },
    { price: lastPriceTraded - (totalMatched * 0.3) * adjustmentFactor, size: totalMatched * 0.2 },
  ];

  return { availableToBack, availableToLay };
};

// Exported utility functions
module.exports = {
  generateAutoOdds,

  getMatches: async () => {
    try {
      return await Match.find();
    } catch (err) {
      console.error('Error fetching matches:', err);
      throw new Error(`Error fetching matches: ${err.message}`);
    }
  },

  getMatchById: async (eventId) => {
    try {
      return await Match.findOne({ eventId });
    } catch (err) {
      console.error('Error fetching match by ID:', err);
      throw new Error('Error fetching match');
    }
  },

  getMatchDetailsWithTip: async (eventId) => {
    try {
      const match = await Match.findOne({ eventId });
      if (!match) throw new Error('Match not found');
      return { matchDetails: match, tips: "Example Tip: Team A to win" };
    } catch (err) {
      console.error('Error fetching match details with tips:', err);
      throw new Error('Error fetching match details');
    }
  },

  getBetfairOddsForRunner: async (eventId, selectionId) => {
    try {
      const match = await Match.findOne({ eventId });
      if (!match) throw new Error('Match not found');
      const runner = match.betfairOdds.find(r => r.selectionId === selectionId);
      if (!runner) throw new Error('Runner not found');
      return runner.availableToBack.concat(runner.availableToLay);
    } catch (err) {
      console.error('Error fetching Betfair odds:', err);
      throw new Error('Error fetching Betfair odds');
    }
  },

  getAdminBetfairOddsForRunner: async (eventId, selectionId) => {
    try {
      const match = await Match.findOne({ eventId });
      if (!match) throw new Error('Match not found');
      const runner = match.betfairOdds.find(r => r.selectionId === selectionId);
      if (!runner) throw new Error('Runner not found');
      return runner.adminBetfairOdds;
    } catch (err) {
      console.error('Error fetching admin Betfair odds:', err);
      throw new Error('Error fetching admin Betfair odds');
    }
  },

  editAdminBetfairOddsForRunner: async (eventId, selectionId, updatedOdds) => {
    try {
      const match = await Match.findOne({ eventId });
      if (!match) throw new Error('Match not found');
      const runner = match.betfairOdds.find(r => r.selectionId === selectionId);
      if (!runner) throw new Error('Runner not found');
      
      // Save current odds to history before updating
      runner.adminBetfairOdds.oddsHistory.push({
        availableToBack: runner.adminBetfairOdds.availableToBack,
        availableToLay: runner.adminBetfairOdds.availableToLay,
        timestamp: Date.now()
      });

      // Update the admin odds with new data
      runner.adminBetfairOdds = updatedOdds;
      await match.save();
      return match;
    } catch (err) {
      console.error('Error editing admin Betfair odds:', err);
      throw new Error('Error editing admin Betfair odds');
    }
  },

  deleteAdminBetfairOddsForRunner: async (eventId, selectionId) => {
    try {
      const match = await Match.findOne({ eventId });
      if (!match) throw new Error('Match not found');
      const runner = match.betfairOdds.find(r => r.selectionId === selectionId);
      if (!runner) throw new Error('Runner not found');
      runner.adminBetfairOdds = null;
      await match.save();
      return match;
    } catch (err) {
      console.error('Error deleting admin Betfair odds:', err);
      throw new Error('Error deleting admin Betfair odds');
    }
  },

  makeHistoryAdminBetfairOddsForRunner: async (eventId, selectionId) => {
    try {
      const match = await Match.findOne({ eventId });
      if (!match) throw new Error('Match not found');
      const runner = match.betfairOdds.find(r => r.selectionId === selectionId);
      if (!runner) throw new Error('Runner not found');

      runner.adminBetfairOdds.oddsHistory.push({
        availableToBack: runner.adminBetfairOdds.availableToBack,
        availableToLay: runner.adminBetfairOdds.availableToLay,
        timestamp: Date.now()
      });
      await match.save();
      return match;
    } catch (err) {
      console.error('Error making history of admin Betfair odds:', err);
      throw new Error('Error making history of admin Betfair odds');
    }
  },

  getScoreboardByEventId: async (eventId) => {
    try {
      const match = await Match.findOne({ eventId });
      if (!match) throw new Error('Match not found');
      return match.scoreData;
    } catch (err) {
      console.error('Error fetching scoreboard:', err);
      throw new Error('Error fetching scoreboard');
    }
  },

  getHistoryAdminBetfairOddsForRunner: async (eventId, selectionId) => {
    try {
      const match = await Match.findOne({ eventId });
      if (!match) throw new Error('Match not found');
      const runner = match.betfairOdds.find(r => r.selectionId === selectionId);
      if (!runner) throw new Error('Runner not found');
      return runner.adminBetfairOdds.oddsHistory;
    } catch (err) {
      console.error('Error fetching history of admin Betfair odds:', err);
      throw new Error('Error fetching history of admin Betfair odds');
    }
  },

  manageUserInvestment: async (userId, investmentAmount) => {
    try {
      const match = await Match.findOne({ eventId: userId });
      if (!match) throw new Error('Match not found');
      const existingInvestment = match.userInvestmentHistory.find(inv => inv.userId === userId);
      if (existingInvestment) {
        existingInvestment.amount = investmentAmount;
        existingInvestment.date = Date.now();
      } else {
        match.userInvestmentHistory.push({ userId, amount: investmentAmount });
      }
      await match.save();
      return match;
    } catch (err) {
      console.error('Error managing user investment:', err);
      throw new Error('Error managing user investment');
    }
  }
};
