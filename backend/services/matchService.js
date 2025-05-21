const axios = require('axios');  // Use `require` instead of `import`
const Match = require('../models/matchModel'); // Import the Match model

const API_BASE_URL = 'https://api.trovetown.co/v1/apiCalls';

const matchService = {
  // Fetch Match List from external API and save to DB
  async fetchMatches(sportId) {
    try {
      const response = await axios.get(`${API_BASE_URL}?apiType=matchListManish&sportId=${sportId}`);
      if (response?.data) {
        const matches = response.data;
        // Loop through the matches and save them in the DB
        const savedMatches = await Promise.all(
          matches.map(async (matchData) => {
            const match = new Match({
              tournamentId: matchData.tournamentId,
              competitionName: matchData.competitionName,
              teams: matchData.teams,
              startTime: new Date(matchData.startTime),
              status: matchData.status,
              score: matchData.score,
            });
            return await match.save(); // Save each match to DB
          })
        );
        return savedMatches;
      } else {
        throw new Error('No match data received');
      }
    } catch (error) {
      console.error('Error fetching matches:', error.message || error);
      throw error;
    }
  },

  // Get matches by tournament ID
  async getMatchesByTournament(tournamentId) {
    try {
      const tournamentMatches = await Match.find({ tournamentId }).sort({ startTime: 1 });
      if (tournamentMatches.length === 0) {
        throw new Error('No matches found for this tournament');
      }
      return tournamentMatches;
    } catch (error) {
      console.error('Error fetching matches by tournament:', error.message || error);
      throw error;
    }
  },

  // Get only upcoming matches (based on startTime)
  async fetchUpcomingMatches() {
    try {
      const now = new Date();
      const upcomingMatches = await Match.find({ startTime: { $gt: now } }).sort({ startTime: 1 });
      return upcomingMatches;
    } catch (error) {
      console.error('Error fetching upcoming matches:', error.message || error);
      throw error;
    }
  }
};

// Route to fetch Betfair data for a specific marketId
router.get('/betfairData/:marketId', async (req, res) => {
    const { marketId } = req.params; // Extract marketId from route parameters
    
    try {
        const betfairData = await getBetfairData(marketId);

        if (!betfairData) {
            return res.status(404).json({
                success: false,
                message: `No Betfair data found for marketId: ${marketId}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Betfair data fetched successfully.',
            data: betfairData,
        });
    } catch (error) {
        console.error('Error fetching Betfair data:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch Betfair data.',
            error: error.message, // Include error details for debugging
        });
    }
});

module.exports = matchService;  // Use `module.exports` for export
