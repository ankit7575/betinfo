// routes/betfairRoutes.js

const express = require('express');
const router = express.Router();
const betfairController = require('../controller/betfairController');

// Route to fetch odds for a specific market ID
router.get('/odds/:marketId', betfairController.fetchMarketOdds);

// Route to fetch odds for a specific match using matchId
router.get('/match-odds/:matchId', betfairController.fetchMatchOdds);

// Optional route to fetch odds for upcoming matches
router.get('/upcoming-match-odds', betfairController.fetchUpcomingMatchOdds);

// Add more routes here if needed for other Betfair operations

// Export the router to be used in app.js or server.js
module.exports = router;
