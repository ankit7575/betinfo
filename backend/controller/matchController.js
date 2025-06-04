
// ✅ Complete and Corrected matchController.js
// All required imports
const axios = require('axios');
const moment = require('moment');
const User = require("../models/userModel");
const Match = require("../models/matchModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { calculateUserOdds } = require('../models/calculateUserOdds');

// ⚙️ In-Memory Match & Runner Cache Store
const tempStore = {};       // Stores match data by eventId
const runnerCache = {};     // Stores individual runner data with TTL
const intervalTimers = {};  // Stores setInterval references for cleanup

// Store full match object
const setMatchInTempStore = (eventId, matchData) => {
  if (!eventId || !matchData) return;
  tempStore[eventId] = matchData;
};

// Retrieve full match object
const getMatchFromTempStore = (eventId) => {
  if (!eventId) return null;
  return tempStore[eventId];
};

const getAmount = async ({side, odd, investmentLimit = 0}) => {
  if (!side || !odd) {
    return 0
  }
  try { 
    const apiUrl = `${process.env.PLAYMATE_URL}getAmount`;
    const response = await axios.post(
      apiUrl, 
      {
        investmentLimit: investmentLimit,
        side: side,
        odd: odd,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PLAYMATE_TOKEN}`,
        }
      }
    );
    return response?.data?.amount || 0;
  } catch (e) {
    return 0;
  }
}

// Store individual runner data with timestamp
const setRunnerInTempStore = (eventId, selectionId, runnerData) => {
  if (!eventId || !selectionId || !runnerData) return;
  const key = `${eventId}-${selectionId}`;
  runnerCache[key] = {
    data: runnerData,
    timestamp: Date.now()
  };
};

// Retrieve runner data if within 1 second freshness window
const getRunnerFromTempStore = (eventId, selectionId) => {
  const key = `${eventId}-${selectionId}`;
  const entry = runnerCache[key];
  if (!entry) return null;

  const isFresh = (Date.now() - entry.timestamp) < 1000; // 1 second TTL
  return isFresh ? entry.data : null;
};

// Optional: Clear interval or cache per eventId if needed
const clearMatchCache = (eventId) => {
  delete tempStore[eventId];
  Object.keys(runnerCache).forEach(key => {
    if (key.startsWith(`${eventId}-`)) delete runnerCache[key];
  });

  if (intervalTimers[eventId]) {
    clearInterval(intervalTimers[eventId]);
    delete intervalTimers[eventId];
  }
};



const getMatchStatus = (openDate) => {
  const now = moment();
  const matchTime = moment(openDate);
  if (now.isBefore(matchTime)) return 'Upcoming';
  if (now.isSameOrAfter(matchTime) && now.isBefore(matchTime.clone().add(3, 'hours'))) return 'In Progress';
  return 'Ended';
};
// Sample getSomething function
const getSomething = catchAsyncErrors(async (req, res, next) => {
    const io = req.app.get("io");
    io.emit("event_name", { message: "Socket is working!" });
    res.status(200).json({ success: true });
});
// Admin: Update only the 'selected' status
const updateMatchSelectedStatus = async (req, res) => {
    try {
        const { eventId, selected } = req.body;
        if (typeof selected !== "boolean") {
            return res.status(400).json({ success: false, message: "'selected' must be boolean" });
        }
        const match = await Match.findOneAndUpdate(
            { eventId },
            { $set: { selected } },
            { new: true }
        );
        if (!match) {
            return res.status(404).json({ success: false, message: "Match not found" });
        }
        return res.json({ success: true, data: match });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Admin: Update only the 'adminStatus' field
const updateMatchAdminStatus = async (req, res) => {
    try {
        const { eventId, adminStatus } = req.body;
        if (typeof adminStatus !== "string") {
            return res.status(400).json({ success: false, message: "'adminStatus' must be string" });
        }
        const match = await Match.findOneAndUpdate(
            { eventId },
            { $set: { adminStatus } },
            { new: true }
        );
        if (!match) {
            return res.status(404).json({ success: false, message: "Match not found" });
        }
        return res.json({ success: true, data: match });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getMatches = catchAsyncErrors(async (req, res, next) => {
    const { sportId } = req.params;

    const apiUrl = `https://api.trovetown.co/v1/apiCalls?apiType=matchListManish&sportId=${sportId}`;
    const { data: matches } = await axios.get(apiUrl);

    if (!Array.isArray(matches)) {
        return res.status(500).json({ success: false, message: 'Unexpected API response.', data: matches });
    }

    // Accept at least 2 runners for all sports
    const filteredMatches = matches.filter(match =>
        Array.isArray(match.matchRunners) &&
        match.matchRunners.length >= 2 &&
        Array.isArray(match.markets) &&
        match.markets.length > 0
    );

    const allMatches = [];
    let newMatchCount = 0;

    for (const match of filteredMatches) {
        let matchDoc = await Match.findOne({ eventId: match.eventId });
        if (!matchDoc) {
            matchDoc = new Match({
                eventId: match.eventId,
                eventName: match.eventName || null,
                competitionName: match.competitionName,
                sportName: match.sportName || "Unknown",
                matchRunners: match.matchRunners.map(runner => ({
                    runnerId: runner.selectionId,
                    runnerName: runner.runnerName,
                })),
                markets: match.markets.map(market => ({
                    marketId: market.marketId,
                    marketName: market.marketName,
                })),
                openDate: match.openDate,
                selected: true,      // Admin can mark true later
                adminStatus: "",      // Admin can set custom status later
            });

            await matchDoc.save();
            newMatchCount++;
        }
        allMatches.push(matchDoc);
    }

    // Return all matches (with selected/adminStatus fields), for admin listing/updating
    return res.status(200).json({
        success: true,
        message: `${newMatchCount} new matches saved. ${allMatches.length} total matches returned.`,
        data: allMatches,
    });
});

const getTennisMatches = catchAsyncErrors(async (req, res, next) => {
  // For tennis, sportId is 2.
  const sportId = 2;

  const apiUrl = `https://api.trovetown.co/v1/apiCalls?apiType=matchListManish&sportId=${sportId}`;
  const { data: matches } = await axios.get(apiUrl);

  if (!Array.isArray(matches)) {
    return res.status(500).json({ success: false, message: 'Unexpected API response.', data: matches });
  }

  // Allow at least 2 runners for tennis (singles or doubles)
  const filteredMatches = matches.filter(match =>
    Array.isArray(match.matchRunners) &&
    match.matchRunners.length >= 2 &&
    Array.isArray(match.markets) &&
    match.markets.length > 0
  );

  const allMatches = [];
  let newMatchCount = 0;

  for (const match of filteredMatches) {
    let matchDoc = await Match.findOne({ eventId: match.eventId });
    if (!matchDoc) {
      matchDoc = new Match({
        eventId: match.eventId,
        eventName: match.eventName || null,
        competitionName: match.competitionName,
        sportName: match.sportName || "Tennis",
        matchRunners: match.matchRunners.map(runner => ({
          runnerId: runner.selectionId,
          runnerName: runner.runnerName,
        })),
        markets: match.markets.map(market => ({
          marketId: market.marketId,
          marketName: market.marketName,
        })),
        openDate: match.openDate,
        selected: true,      // Admin can mark true later
        adminStatus: "",      // Admin can set custom status later
      });
      await matchDoc.save();
      newMatchCount++;
    }
    allMatches.push(matchDoc);
  }

  return res.status(200).json({
    success: true,
    message: `${newMatchCount} new matches saved. ${allMatches.length} total matches returned.`,
    data: allMatches,
  });
});


const getSoccerMatches = catchAsyncErrors(async (req, res, next) => {
  const sportId = 1; // Soccer/Football

  const apiUrl = `https://api.trovetown.co/v1/apiCalls?apiType=matchListManish&sportId=${sportId}`;
  const { data: matches } = await axios.get(apiUrl);

  if (!Array.isArray(matches)) {
    return res.status(500).json({ success: false, message: 'Unexpected API response.', data: matches });
  }

  // Filter: At least 2 runners in Match Odds market, and at least one market available
  const filteredMatches = matches.filter(match =>
    Array.isArray(match.matchRunners) &&
    match.matchRunners.length >= 2 && // Soccer often has 3: Team1, Team2, Draw
    Array.isArray(match.markets) &&
    match.markets.length > 0
  );

  const allMatches = [];
  let newMatchCount = 0;

  for (const match of filteredMatches) {
    let matchDoc = await Match.findOne({ eventId: match.eventId });
    if (!matchDoc) {
      matchDoc = new Match({
        eventId: match.eventId,
        eventName: match.eventName || null,
        competitionName: match.competitionName,
        sportId: match.sportId,
        sportName: match.sportName || "Soccer",
        matchRunners: match.matchRunners.map(runner => ({
          runnerId: runner.selectionId,
          runnerName: runner.runnerName,
        })),
        markets: match.markets.map(market => ({
          marketId: market.marketId,
          marketName: market.marketName,
        })),
        openDate: match.openDate,
        selected: true,   // Admin can mark true later
        adminStatus: "",   // Admin can set custom status later
      });
      await matchDoc.save();
      newMatchCount++;
    }
    allMatches.push(matchDoc);
  }

  return res.status(200).json({
    success: true,
    message: `${newMatchCount} new soccer matches saved. ${allMatches.length} total matches returned.`,
    data: allMatches,
  });
});


// ✅ Get Match By ID from MongoDB and store in tempStore
const getMatchById = catchAsyncErrors(async (req, res, next) => {
    const { eventId } = req.params;

    try {
        const match = await Match.findOne({ eventId });

        if (!match) {
            return res.status(404).json({ success: false, message: 'Match not found in database.' });
        }

        const selection_ids = [];
        const history = [];
        match.matchRunners.map(runner => {
          selection_ids.push(parseInt(runner.runnerId));
        });
        match.adminBetfairOdds?.map((runnerOdd) =>
          runnerOdd.layingHistory?.map((tipHistory) => {
            history.push({
              selection_id : parseInt(runnerOdd.selectionId),
              side : tipHistory.odds?.back ? "Back" : tipHistory.odds?.lay ? "Lay" : "",
              odd : parseFloat(tipHistory.odds?.back ?? tipHistory.odds?.lay ?? 0),
              amount : parseInt(tipHistory.Amount?.back ?? tipHistory.Amount?.lay ?? 0),
            });
          })
        );
        const apiUrl = `${process.env.PLAYMATE_URL}netProfit`;
        const { data } = await axios.post(
          apiUrl, 
          {
            selection_ids: selection_ids,
            history: history,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.PLAYMATE_TOKEN}`,
            },
          }
        );

        // Optional: You can filter or transform the data as needed
        const processedMatch = {
            eventId: match.eventId,
            eventName: match.eventName,
            competitionName: match.competitionName,
            competitionId: match.tournamentId, // adjusted from schema
            sportName: match.sportName,
            marketId: match.markets?.[0]?.marketId || null, // fallback if markets empty
            openDate: match.openDate,
            status: getMatchStatus(match.openDate),
            matchRunners: match.matchRunners.map(runner => ({
                selectionId: runner.runnerId, // from your schema
                runnerName: runner.runnerName,
                sortPriority: null // optional: set if you store it
            })),
            markets: match.markets,
            adminBetfairOdds: match.adminBetfairOdds,
            betfairOdds: match.betfairOdds,
            scoreData: match.scoreData,
            netProfit: data ?? [],
        };

        // ✅ Store match in temp memory
        setMatchInTempStore(eventId, processedMatch);

        return res.status(200).json({
            success: true,
            message: 'Match fetched from database and stored in memory.',
            data: processedMatch
        });

    } catch (error) {
        console.error('Error fetching match from MongoDB:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to fetch match from database.' });
    }
});


// Get Betfair Odds for Runner using tempStore match
const getBetfairOddsForRunner = catchAsyncErrors(async (req, res, next) => {
  const { eventId } = req.params;
  const io = req.app.get("io");

  if (!eventId) return next(new ErrorHandler("Event ID is required", 400));
  console.log("📊 Initial Betfair odds request received for eventId:", eventId);

  // Clear any previous interval to avoid duplicates
  if (intervalTimers[eventId]?.oddsInterval) {
    clearInterval(intervalTimers[eventId].oddsInterval);
  }

  // 🔁 Fetch & emit loop
  const fetchAndEmitOdds = async () => {
    let match = getMatchFromTempStore(eventId);
    let isFromCache = true;

    if (!match) {
      match = await Match.findOne({ eventId });
      if (!match) return;
      isFromCache = false;
    }

    const matchOddsMarket = match.markets?.find(m => m.marketName === "Match Odds");
    if (!matchOddsMarket?.marketId) {
      console.warn(`⚠️ No marketId found for eventId: ${eventId}`);
      return;
    }

    const marketId = matchOddsMarket.marketId;
    const apiUrl = `https://api.trovetown.co/v1/apiCalls/betfairData?marketIds=${marketId}`;

     let data;
    try {
      const response = await axios.get(apiUrl, { timeout: 10000 });
      data = response.data;
    } catch (err) {
      console.error(`❌ Betfair API fetch failed:`, err.response?.data || err.message);
      return;
    }

    if (!Array.isArray(data) || data.length === 0) return;

    const marketData = data.find(m => m.marketId === marketId);
    if (!marketData?.runners) return;

    const runnerNameMap = {};
    if (Array.isArray(match.matchRunners)) {
      match.matchRunners.forEach(runner => {
        if (runner.selectionId) {
          runnerNameMap[runner.selectionId.toString()] = runner.runnerName;
        }
      });
    }

    const runnerData = await Promise.all(marketData.runners.map(async (runner) => ({
      selectionId: runner.selectionId,
      runnerName: runnerNameMap[runner.selectionId?.toString()] || `Runner ${runner.selectionId}`,
      lastPriceTraded: runner.lastPriceTraded || 0,
      availableToBack: runner.ex?.availableToBack?.map(async (back, index) => ({
        price: back.price,
        size: back.size,
        amount: index === 0 ? await getAmount({side: "Back", odd: back.price}) : 0,
      })) || [],
      availableToLay: runner.ex?.availableToLay?.map(async (lay, index) => ({
        price: lay.price,
        size: lay.size,
        amount: index === 0 ? await getAmount({side: "Lay", odd: lay.price}) : 0,
      })) || [],
      oddsHistory: [{
        availableToBack: runner.ex?.availableToBack || [],
        availableToLay: runner.ex?.availableToLay || [],
        timestamp: new Date()
      }]
    })));

     match.betfairOdds = runnerData;
    if (!isFromCache && typeof match.save === "function") {
      await match.save();
    }
    setMatchInTempStore(eventId, match);

    if (io) {
      io.emit("betfair_odds_update", {
        eventId,
        odds: {
          marketId,
          marketName: "Match Odds",
          matchName: match.eventName,
          runners: runnerData,
        },
      });
      console.log(`📡 Emitted odds for ${eventId}`);
    }

    return marketData; // return for immediate response
  };

  // Start 0.5s interval
  intervalTimers[eventId] = intervalTimers[eventId] || {};
  intervalTimers[eventId].oddsInterval = setInterval(fetchAndEmitOdds, 500);

  // Also fetch immediately and send result
  const initialMarketData = await fetchAndEmitOdds();

  res.status(200).json({
    success: true,
    message: `Started 0.5s live Betfair odds streaming for eventId: ${eventId}`,
    marketId: initialMarketData?.marketId,
    marketData: initialMarketData || [],
  });
});

const getScoreboardByEventId = catchAsyncErrors(async (req, res, next) => {
    const { eventId } = req.params;
    const io = req.app.get("io");

    if (intervalTimers[eventId]?.scoreInterval) {
      clearInterval(intervalTimers[eventId].scoreInterval);
    }

    const fetchAndEmitScore = async () => {
      let match = getMatchFromTempStore(eventId);
      let isFromCache = true;

      if (!match) {
        match = await Match.findOne({ eventId });
        if (!match) return;
        isFromCache = false;
      }

      const apiUrl = `https://api.trovetown.co/v1/apiCalls/scoreData?scoreId=${eventId}`;
      const { data } = await axios.get(apiUrl, { timeout: 10000 });

      if (!data?.data?.length || data.data.length < 3) return;

      const [d0 = {}, d1 = {}, d2 = {}] = data.data;
      const scoreboard = {
        team1: d2.t1 || d2.team1 || '',
        team2: d2.t2 || d2.team2 || '',
        score1: d2.score?.trim() || '',
        score2: d2.score2?.trim() || '',
        wicket1: d2.wicket || '',
        wicket2: d2.wicket2 || '',
        ballsDone1: d2.ballsdone || 0,
        ballsDone2: d2.ballsdone2 || 0,
        target: d2.target || 0,
        required: d0.cb || '',
        recentBalls: Array.isArray(d0.recentBalls) ? d0.recentBalls : [],
        currentBatters: {
          player1: d1.p1 || '',
          player2: d1.p2 || ''
        },
        lb: d0.lb || '',
        status: d1.st || '',
      };

      match.scoreData = scoreboard;
      if (!isFromCache && typeof match.save === "function") await match.save();
      setMatchInTempStore(eventId, match);

      io.emit("scoreboard_update", { eventId, scoreboard });
    };

    intervalTimers[eventId] = intervalTimers[eventId] || {};
    intervalTimers[eventId].scoreInterval = setInterval(fetchAndEmitScore, 500);

    await fetchAndEmitScore(); // initial fetch
    res.status(200).json({ success: true, message: "Started real-time scoreboard for eventId: " + eventId });
  });
 

// Helper: Remove backend-only fields like expiresAt
function sanitizeOdds(oddsArr) {
  return oddsArr.map(odds => {
    const { expiresAt, ...rest } = odds;
    let cleanHistory = [];
    if (Array.isArray(rest.history)) {
      cleanHistory = rest.history.map(h => {
        const { expiresAt, ...hRest } = h;
        return hRest;
      });
    }
    return { ...rest, history: cleanHistory };
  });
}


// Add or update admin Betfair odds
const addAdminBetfairOdds = catchAsyncErrors(async (req, res, next) => {
  const io = req.app.get("io");
  const { eventId, selectionId } = req.params;
  const { odds, Ammount, Profit } = req.body;

  const match = await Match.findOne({ eventId });
  if (!match) return res.status(404).json({ message: "Match not found" });

  const adminOpeningBalance = match.openingbalance || 200000;

  // Find runner for odds update
  const matchRunner = match.matchRunners.find(r => r.runnerId === String(selectionId));
  const runnerName = matchRunner ? matchRunner.runnerName : "Unknown Runner";

  let existingOdds = match.adminBetfairOdds.find(o => o.selectionId === Number(selectionId));
  const layingEntry = {
    odds,
    Ammount,
    Profit,
    timestamp: new Date(),
  };

  if (!existingOdds) {
    match.adminBetfairOdds.push({
      selectionId: Number(selectionId),
      runnerName,
      odds,
      Ammount,
      Profit,
      createdAt: new Date(),
      layingHistory: [layingEntry],
    });
  } else {
    existingOdds.odds = odds;
    existingOdds.Ammount = Ammount;
    existingOdds.Profit = Profit;
    existingOdds.createdAt = new Date();
    existingOdds.layingHistory.push(layingEntry);
  }

  // Clear old user odds for this match
  match.userBetfairOdds = [];

  // --- Loop for EACH USER: generate odds + emit real time ---
  for (const userEntry of match.userOpeningbalanceHistory) {
    const userId = userEntry.userId.toString();
    const userOpeningBalance = userEntry.amount;

    const updatedUserOdds = match.adminBetfairOdds.map((adminOdds) => {
      const calculated = calculateUserOdds(
        {
          selectionId: adminOdds.selectionId,
          runnerName: adminOdds.runnerName,
          odds: adminOdds.odds,
          Ammount: adminOdds.Ammount,
          Profit: adminOdds.Profit,
        },
        adminOpeningBalance,
        userOpeningBalance,
        userId
      );
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 60 * 1000);
      const historyEntry = {
        odds: { ...calculated.odds },
        Ammount: { ...calculated.Ammount },
        Profit: { ...calculated.Profit },
        timestamp: now,
        expiresAt, // not sent to frontend
      };
      return {
        ...calculated,
        userId,
        runnerName: adminOdds.runnerName,
        selectionId: adminOdds.selectionId,
        referenceAdminOpeningBalance: adminOpeningBalance,
        userOpeningBalance,
        createdAt: now,
        timestamp: now,
        expiresAt,
        history: [historyEntry],
      };
    });

    match.userBetfairOdds.push(...updatedUserOdds);

    // REAL-TIME SOCKET EMIT (sanitize before sending)
    io.to(userId).emit("userOddsUpdated", {
      success: true,
      eventId,
      userId,
      oddsHistory: sanitizeOdds(updatedUserOdds),
    });
  }

  await match.save();

  // Optional: Emit admin tip update to everyone
  io.emit("admin_tip_update", {
    eventId,
    adminBetfairOdds: match.adminBetfairOdds,
  });

  res.status(200).json({
    success: true,
    message: "Admin odds added/updated and user odds generated successfully.",
    updatedSelectionId: selectionId,
  });
});


// Controller: Get odds + investment
// const getUserMatchOddsAndInvestment = catchAsyncErrors(async (req, res) => {
//   const io = req.app.get("io");
//   const { eventId } = req.params;
//   const userId = req.user?._id?.toString();

//   const user = await User.findById(userId);
//   if (!user) return res.status(401).json({ success: false, message: "Unauthorized: User not found." });

//   const now = new Date();

//   const hasValidCoin = user.keys.some((key) =>
//     key.coin.some((coin) => coin.usedAt && new Date(coin.expiresAt) > now)
//   );

//   if (!hasValidCoin)
//     return res.status(403).json({ success: false, message: "Access denied: Please redeem a valid coin to view match odds." });

//   const match = await Match.findOne({ eventId });
//   if (!match) return res.status(404).json({ success: false, message: "Match not found." });

//   // Get user's last investment time
//   const investmentEntry = match.userOpeningbalanceHistory
//     .filter(entry => entry.userId.toString() === userId)
//     .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

//   if (!investmentEntry)
//     return res.status(404).json({ success: false, message: "User investment not found." });

//   const userOpeningBalance = investmentEntry.amount;
//   const adminOpeningBalance = match.openingbalance || 200000;
//   const investmentTime = new Date(investmentEntry.date);

//   // Find all odds generated for this user
//   const allUserOdds = (match.userBetfairOdds || []).filter(
//     o => o.userId === userId
//   );

//   // Only show "current" odds that were created AT OR AFTER their investment time
//   const currentSessionOdds = allUserOdds.filter(
//     o => new Date(o.createdAt) >= investmentTime
//   );

//   // Optionally, filter history in each odds object to only post-investment entries
//   const sanitizedOdds = sanitizeOdds(currentSessionOdds);

//   // You can also add allUserOdds (sanitized) as a "fullHistory" field if needed

//   const responsePayload = {
//     success: true,
//     userId,
//     eventId,
//     openingbalance: userOpeningBalance,
//     oddsHistory: sanitizedOdds,
//     // fullOddsHistory: sanitizeOdds(allUserOdds) // optional
//   };

//   io.to(userId).emit("userOddsUpdated", responsePayload);

//   res.status(200).json(responsePayload);
// });
// Controller: Get odds + investment (user must have valid coin for this match event)
const getUserMatchOddsAndInvestment = catchAsyncErrors(async (req, res) => {
  const io = req.app.get("io");
  const { eventId } = req.params;
  const userId = req.user?._id?.toString();

  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ success: false, message: "Unauthorized: User not found." });

  const now = new Date();

  // Must have a coin for THIS eventId
  const hasValidCoin = user.keys.some(key =>
    key.coin.some(coin =>
      coin.usedForEventId === eventId &&
      coin.usedAt &&
      new Date(coin.expiresAt) > now
    )
  );

  if (!hasValidCoin)
    return res.status(403).json({ success: false, message: "Access denied: Please redeem a valid coin for this match event." });

  const match = await Match.findOne({ eventId });
  if (!match) return res.status(404).json({ success: false, message: "Match not found." });

  // Get user's last investment time
  const investmentEntry = match.userOpeningbalanceHistory
    .filter(entry => entry.userId.toString() === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  if (!investmentEntry)
    return res.status(404).json({ success: false, message: "User investment not found." });

  const userOpeningBalance = investmentEntry.amount;
  const adminOpeningBalance = match.openingbalance || 200000;
  const investmentTime = new Date(investmentEntry.date);

  // Find all odds generated for this user
  const allUserOdds = (match.userBetfairOdds || []).filter(
    o => o.userId === userId
  );

  // Only show "current" odds that were created AT OR AFTER their investment time
  const currentSessionOdds = allUserOdds.filter(
    o => new Date(o.createdAt) >= investmentTime
  );

  // Optionally, filter history in each odds object to only post-investment entries
  const sanitizedOdds = sanitizeOdds(currentSessionOdds);

  const responsePayload = {
    success: true,
    userId,
    eventId,
    openingbalance: userOpeningBalance,
    oddsHistory: sanitizedOdds,
    // fullOddsHistory: sanitizeOdds(allUserOdds) // optional
  };

  io.to(userId).emit("userOddsUpdated", responsePayload);

  res.status(200).json(responsePayload);
});

// Add user investment
const userAddInvestment = catchAsyncErrors(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user?._id?.toString();
  const { amount } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ success: false, message: "A valid amount is required." });
  }

  const match = await Match.findOne({ eventId });
  if (!match) {
    return res.status(404).json({ success: false, message: "Match not found." });
  }

  const existingUserOdds = match.userBetfairOdds.filter(o => o.userId.toString() === userId);
  existingUserOdds.forEach(o => {
    o.history = o.history || [];
    o.history.push({
      odds: { ...o.odds },
      Ammount: { ...o.Ammount },
      Profit: { ...o.Profit },
      timestamp: new Date(),
    });
  });

  match.userBetfairOdds = match.userBetfairOdds.filter(o => o.userId.toString() !== userId);
  match.userOpeningbalanceHistory = match.userOpeningbalanceHistory.filter(entry => entry.userId.toString() !== userId);

  match.userOpeningbalanceHistory.push({
    userId,
    amount,
    date: new Date(),
  });

  const adminOpeningBalance = match.openingbalance || 200000;

  const updatedUserOdds = match.adminBetfairOdds.map(adminOdds => {
    const newOdds = calculateUserOdds(adminOdds, adminOpeningBalance, amount, userId);
    const existingHistory = existingUserOdds.find(o => o.selectionId === adminOdds.selectionId)?.history || [];

    return {
      ...newOdds,
      userId,
      runnerName: adminOdds.runnerName,
      selectionId: adminOdds.selectionId,
      referenceAdminOpeningBalance: adminOpeningBalance,
      userOpeningBalance: amount,
      createdAt: new Date(),
      history: existingHistory,
    };
  });

  match.userBetfairOdds.push(...updatedUserOdds);
  await match.save();

  res.status(200).json({
    success: true,
    message: "User investment added and odds recalculated.",
    userId,
    eventId,
    openingbalance: amount,
    userOdds: updatedUserOdds,
  });
});


// Manage User Investment
const manageUserInvestment = catchAsyncErrors(async (req, res, next) => {
  const { amount } = req.body;

  // Access the logged-in user from req.user.id
  const user = await User.findById(req.user.id); // This uses the ID from the JWT token

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Example logic for investment adjustment
  user.investment += amount; // Add or subtract investment based on the amount
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Investment updated successfully.",
    data: user
  });
});





// Fetch Betfair Data and Score Data for a Specific Match
const getMatchDetailsWithTip = catchAsyncErrors(async (req, res, next) => {
  const { eventId } = req.params;

  // Try getting from memory first, then DB
  const match = getMatchFromTempStore(eventId) || await Match.findOne({ eventId });
  if (!match) {
    return next(new ErrorHandler("Match not found", 404));
  }

  // Fetch Betfair Odds
  const marketId = match.markets?.[0]?.marketId;
  if (!marketId) {
    return next(new ErrorHandler("Market ID missing", 400));
  }

  let runners = [];
  try {
    const betfairApiUrl = `https://api.trovetown.co/v1/apiCalls/betfairData?marketIds=${marketId}`;
    const { data: betfairData } = await axios.get(betfairApiUrl);

    const marketData = betfairData.find(m => m.marketId === marketId);
    if (!marketData || !marketData.runners) {
      throw new Error("Runner data not found");
    }

    runners = marketData.runners.map(runner => ({
      selectionId: runner.selectionId,
      runnerName: match.matchRunners?.find(r => r.runnerId == runner.selectionId)?.runnerName || runner.runnerName || "Unknown",
      lastPriceTraded: runner.lastPriceTraded,
      availableToBack: runner.ex?.availableToBack || [],
      availableToLay: runner.ex?.availableToLay || [],
    }));
  } catch (error) {
    console.error("Error fetching Betfair odds:", error.message);
    return next(new ErrorHandler("Failed to fetch Betfair odds", 500));
  }

  // Fetch Scoreboard Data
  let scoreboard = {};
  try {
    const scoreId = eventId;
    const scoreboardApiUrl = `https://api.trovetown.co/v1/apiCalls/scoreData?scoreId=${scoreId}`;
    const { data: scoreData } = await axios.get(scoreboardApiUrl);

    const score = scoreData?.data?.[2] || {};
    scoreboard = {
      score1: score?.score?.trim() || null,
      score2: score?.score2?.trim() || null,
      wicket1: score?.wicket || null,
      wicket2: score?.wicket2 || null,
      ballsDone1: score?.ballsdone || null,
      ballsDone2: score?.ballsdone2 || null,
      team1: score?.team1 || null,
      team2: score?.team2 || null,
      recentBalls: scoreData?.data?.[0]?.recentBalls?.[0] || []
    };
  } catch (error) {
    console.error("Error fetching scoreboard data:", error.message);
    return next(new ErrorHandler("Failed to fetch scoreboard data", 500));
  }

  return res.status(200).json({
    success: true,
    message: 'Match details fetched successfully.',
    data: {
      match,
      betfairData: runners,
      scoreData: scoreboard
    }
  });
});

// Automatically Adjust Admin Betfair Odds for Runner Based on Investment
const autoCalculateAdminBetfairOddsForRunner = catchAsyncErrors(async (req, res, next) => {
  const { eventId, selectionId } = req.params;

  const match = await Match.findOne({ eventId });
  if (!match) return next(new ErrorHandler("Match not found", 404));

  const runner = match.betfairOdds.find(r => r.selectionId === selectionId);
  if (!runner) return next(new ErrorHandler("Runner not found", 404));

  const userInvestment = match.investment; // Using match's investment value
  const totalMatched = runner.lastPriceTraded * 100; // Example formula

  const adjustedOdds = generateAutoOdds(runner.lastPriceTraded, totalMatched, userInvestment);

  // Update runner odds
  runner.adminBetfairOdds = adjustedOdds;
  await match.save();

  return res.status(200).json({
    success: true,
    message: "Admin Betfair odds auto-calculated successfully.",
    data: adjustedOdds
  });
});

// View the latest admin laying data for a runner
const viewAdminLayingDataForRunnerLatest = catchAsyncErrors(async (req, res, next) => {
  const { eventId, selectionId } = req.params;

  const match = await Match.findOne({ eventId });
  if (!match) return next(new ErrorHandler("Match not found", 404));

  const adminOdds = match.adminBetfairOdds.find(r => r.selectionId === Number(selectionId));
  if (!adminOdds) return next(new ErrorHandler("Runner not found", 404));

  res.status(200).json({
    success: true,
    message: "Admin laying data retrieved successfully.",
    updatedRunner: adminOdds
  });
});
// View admin laying history for a runner
const viewAdminLayingDataForRunnerHistory = catchAsyncErrors(async (req, res, next) => {
  const { eventId, selectionId } = req.params;

  const match = await Match.findOne({ eventId });
  if (!match) return next(new ErrorHandler("Match not found", 404));

  const adminOdds = match.adminBetfairOdds.find(r => r.selectionId === Number(selectionId));
  if (!adminOdds) return next(new ErrorHandler("Runner not found", 404));

  res.status(200).json({
    success: true,
    message: "Admin laying history retrieved successfully.",
    layingHistory: adminOdds.layingHistory || []
  });
});

// Edit admin laying data for a runner
const editAdminLayingDataForRunner = catchAsyncErrors(async (req, res, next) => {
  const { eventId, selectionId } = req.params;
  const { stakesLaying, gainsLaying, timestamp } = req.body;

  if (!stakesLaying || !gainsLaying || !timestamp) {
    return next(new ErrorHandler("Missing required fields: 'stakesLaying', 'gainsLaying', or 'timestamp'", 400));
  }

  const match = await Match.findOne({ eventId });
  if (!match) return next(new ErrorHandler("Match not found", 404));

  const adminOdds = match.adminBetfairOdds.find(r => r.selectionId === Number(selectionId));
  if (!adminOdds) return next(new ErrorHandler("Runner not found", 404));

  const historyIndex = adminOdds.layingHistory.findIndex(entry =>
    new Date(entry.timestamp).toISOString() === timestamp
  );
  if (historyIndex === -1) return next(new ErrorHandler("Laying history entry not found for the given timestamp.", 404));

  adminOdds.layingHistory[historyIndex].stakesLaying = { ...stakesLaying };
  adminOdds.layingHistory[historyIndex].gainsLaying = { ...gainsLaying };
  adminOdds.layingHistory[historyIndex].timestamp = new Date(); // optional update

  adminOdds.stakesLaying = { ...stakesLaying };
  adminOdds.gainsLaying = { ...gainsLaying };

  await match.save();

  res.status(200).json({
    success: true,
    message: "Admin laying data updated successfully with history updated.",
    updatedRunner: adminOdds,
    layingHistoryCount: adminOdds.layingHistory.length
  });
});

// Delete a laying history entry for a runner
const deleteAdminLayingDataForRunner = catchAsyncErrors(async (req, res, next) => {
  const { eventId, selectionId } = req.params;
  const { timestamp } = req.body;

  if (!timestamp) {
    return next(new ErrorHandler("Timestamp is required to delete the laying history entry.", 400));
  }

  const match = await Match.findOne({ eventId });
  if (!match) return next(new ErrorHandler("Match not found", 404));

  const adminOdds = match.adminBetfairOdds.find(r => r.selectionId === Number(selectionId));
  if (!adminOdds) return next(new ErrorHandler("Runner not found", 404));

  const historyIndex = adminOdds.layingHistory.findIndex(entry =>
    new Date(entry.timestamp).toISOString() === timestamp
  );
  if (historyIndex === -1) return next(new ErrorHandler("Laying history entry not found for the given timestamp.", 404));

  adminOdds.layingHistory.splice(historyIndex, 1);
  await match.save();

  res.status(200).json({
    success: true,
    message: "Admin laying history entry deleted successfully."
  });
});








const updateUserOddsWithHistory = (eventId, selectionId, newLayValue, newLayAmount, newLayProfit) => async (dispatch) => {
  try {
    dispatch({ type: "USER_UPDATE_ODDS_REQUEST" });

    const { data } = await axios.post(
      `${API_URL}/match/${eventId}/my-odds`,
      {
        selectionId,
        newLayValue,
        newLayAmount,
        newLayProfit,
      },
      getAuthConfig()
    );

    dispatch({
      type: "USER_UPDATE_ODDS_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "USER_UPDATE_ODDS_FAIL",
      payload: getErrorMessage(error),
    });
  }
};




// Export
module.exports = {
  updateUserOddsWithHistory,
  userAddInvestment,
  getSomething,
  viewAdminLayingDataForRunnerLatest,
  viewAdminLayingDataForRunnerHistory,
  editAdminLayingDataForRunner,
  deleteAdminLayingDataForRunner,
  getMatches,
  getMatchById,
  getBetfairOddsForRunner,
  getScoreboardByEventId,
  getMatchDetailsWithTip,
  manageUserInvestment,
  autoCalculateAdminBetfairOddsForRunner,
getSoccerMatches,
  addAdminBetfairOdds,
  getUserMatchOddsAndInvestment,
  userAddInvestment,
getTennisMatches,
updateMatchSelectedStatus,
updateMatchAdminStatus,
};