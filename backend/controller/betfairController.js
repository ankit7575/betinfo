// controllers/betfairController.js
const betfairService = require('../services/betfairService');

module.exports = {
  // Fetch odds for a specific market ID
  async fetchMarketOdds(req, res) {
    const { marketId } = req.params; // marketId from request params
    try {
      const odds = await betfairService.fetchMarketOdds(marketId);
      return res.status(200).json({ success: true, odds });
    } catch (error) {
      console.error('Error fetching market odds:', error.message || error);
      return res.status(500).json({ success: false, message: error.message || 'Error fetching market odds' });
    }
  },

  // Fetch all market odds for a match (from the match ID)
  async fetchMatchOdds(req, res) {
    const { matchId } = req.params; // matchId from request params
    try {
      const odds = await betfairService.fetchOddsByMatchId(matchId);
      return res.status(200).json({ success: true, odds });
    } catch (error) {
      console.error('Error fetching match odds:', error.message || error);
      return res.status(500).json({ success: false, message: error.message || 'Error fetching match odds' });
    }
  },

  // Optional: Get odds for upcoming matches for betting purposes
  async fetchUpcomingMatchOdds(req, res) {
    try {
      const upcomingMatches = await betfairService.fetchUpcomingMatches();
      return res.status(200).json({ success: true, upcomingMatches });
    } catch (error) {
      console.error('Error fetching upcoming match odds:', error.message || error);
      return res.status(500).json({ success: false, message: error.message || 'Error fetching upcoming match odds' });
    }
  }
};
