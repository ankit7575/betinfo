// src/services/betfairService.js

const axios = require('axios');

const API_BASE_URL = 'https://api.trovetown.co/v1/apiCalls';

// Fetch the list of matches
const fetchMatchList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}?apiType=matchListManish&sportId=4`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Match List:', error.message || error);
    throw error; // Rethrow for further handling
  }
};

// Fetch Betfair data for specific market IDs
const fetchBetfairData = async (marketIds) => {
  try {
    if (!marketIds || marketIds.length === 0) {
      return [];
    }

    const marketIdsParam = marketIds.join(',');
    const response = await axios.get(`${API_BASE_URL}/betfairData?marketIds=${marketIdsParam}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Betfair Data:', error.message || error);
    throw error;
  }
};

// Merge the match data with Betfair odds data
const getMergedMatchData = async () => {
  try {
    // Step 1: Get all matches
    const matches = await fetchMatchList();

    if (!matches || matches.length === 0) {
      return []; // No matches found
    }

    // Step 2: Get all marketIds from the matches
    const marketIds = matches.map((match) => match.marketId).filter(Boolean);

    if (marketIds.length === 0) {
      // No marketIds found, return matches with empty oddsData
      return matches.map((match) => ({ ...match, oddsData: [] }));
    }

    // Step 3: Fetch Betfair odds for the marketIds
    const betfairMarkets = await fetchBetfairData(marketIds);

    // Step 4: Map Betfair odds by marketId for quick lookup
    const betfairMarketMap = {};
    betfairMarkets.forEach((market) => {
      betfairMarketMap[market.marketId] = market.runners || [];
    });

    // Step 5: Merge match data with Betfair odds
    const mergedMatches = matches.map((match) => {
      const runners = match.matchRunners || [];
      const oddsRunners = betfairMarketMap[match.marketId] || [];

      // Map Betfair runners for quick lookup by selectionId
      const oddsRunnerMap = oddsRunners.reduce((map, runner) => {
        map[runner.selectionId] = runner;
        return map;
      }, {});

      // Merge runner information with Betfair odds
      const mergedRunners = runners.map((runner) => {
        const odds = oddsRunnerMap[runner.selectionId] || {};

        return {
          selectionId: runner.selectionId,
          runnerName: runner.runnerName,
          lastPriceTraded: odds.lastPriceTraded || null,
          availableToBack: odds.ex?.availableToBack || [],
          availableToLay: odds.ex?.availableToLay || [],
          totalMatched: odds.totalMatched || 0,
          status: odds.status || 'INACTIVE',
        };
      });

      // Return merged match data
      return {
        ...match,
        oddsData: mergedRunners,
      };
    });

    return mergedMatches; // Return the final merged list
  } catch (error) {
    console.error('Error merging Match and Betfair Data:', error.message || error);
    throw error; // Rethrow for further handling
  }
};

module.exports = {
  fetchMatchList,
  fetchBetfairData,
  getMergedMatchData,
};
