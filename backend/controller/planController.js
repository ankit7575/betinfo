const mongoose = require("mongoose");
const validator = require("validator");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Plan = require("../models/planModel");
const Match = require("../models/matchModel");
const Transaction = require("../models/userModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

// Add a new plan
exports.addPlan = catchAsyncErrors(async (req, res, next) => {
    const { name, description, price, totalCoins } = req.body;
  
    // Ensure all required fields are provided
    if (!name || !description || !price || !totalCoins) {
      return next(new ErrorHandler('Please provide all required fields', 400));
    }
  
    // Ensure `totalCoins` is a valid number
    if (typeof totalCoins !== 'number' || totalCoins <= 0) {
      return next(new ErrorHandler('Total coins must be a positive number', 400));
    }
  
    // Create a new Plan instance
    const plan = new Plan({
      name,
      description,
      price,
      totalCoins,
    });
  
    // Save the new plan to the database
    await plan.save();
  
    res.status(201).json({
      success: true,
      plan, // Return the newly created plan
    });
  });

// Get all plans
exports.getAllPlans = catchAsyncErrors(async (req, res, next) => {
  const plans = await Plan.find();

  res.status(200).json({
    success: true,
    plans,
  });
});

// Get a single plan by ID
exports.getPlanById = catchAsyncErrors(async (req, res, next) => {
  const planId = req.params.id;

  const plan = await Plan.findById(planId);

  if (!plan) {
    return next(new ErrorHandler("Plan not found", 404));
  }

  res.status(200).json({
    success: true,
    plan,
  });
});

// Edit a plan by ID
exports.editPlan = catchAsyncErrors(async (req, res, next) => {
  const planId = req.params.id;
  const { name, description, price, totalCoins } = req.body;

  const plan = await Plan.findById(planId);

  if (!plan) {
    return next(new ErrorHandler("Plan not found", 404));
  }

  plan.name = name || plan.name;
  plan.description = description || plan.description;
  plan.price = price || plan.price;
  plan.totalCoins = totalCoins || plan.totalCoins;

  await plan.save();

  res.status(200).json({
    success: true,
    plan,
  });
});

// Delete a plan by ID
exports.deletePlan = catchAsyncErrors(async (req, res, next) => {
  const planId = req.params.id;

  const plan = await Plan.findById(planId);

  if (!plan) {
    return next(new ErrorHandler("Plan not found", 404));
  }

  await Plan.findByIdAndDelete(planId);

  res.status(200).json({
    success: true,
    message: "Plan deleted successfully",
  });
});



// Check the expiration of the selected plan in Redis temp storage
exports.checkSelectedPlanExpiration = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(new ErrorHandler("User not authenticated", 401));
  }

  // Try to get the plan from Redis
  const tempPlanStr = await redis.get(`tempuser:plan:${userId}`);
  if (!tempPlanStr) {
    return next(new ErrorHandler("No plan selected or plan has expired", 404));
  }

  // Parse and return the planId (or the plan object you stored)
  const { planId } = JSON.parse(tempPlanStr);

  res.status(200).json({
    success: true,
    message: "Plan is still valid for transaction",
    selectedPlan: planId,
  });
});


// Clear user's temp plan (mostly for manual clean-up or debugging)
exports.clearExpiredPlans = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(new ErrorHandler("User not authenticated", 401));
  }

  const redisKey = `tempuser:plan:${userId}`;
  const tempPlanStr = await redis.get(redisKey);

  if (!tempPlanStr) {
    // Key doesn't exist, either already expired or never set
    return res.status(200).json({
      success: true,
      message: "No plan in temp store",
    });
  }

  // If plan exists, delete it
  await redis.del(redisKey);

  return res.status(200).json({
    success: true,
    message: "Plan (if any) removed from temp store",
  });
});



// Select an Activation Plan temporarily for the user
exports.selectPlan = async (req, res) => {
    try {
        const { planId } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        if (!mongoose.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({ success: false, message: 'Invalid plan ID' });
        }

        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Store temp plan in Redis, TTL is in seconds!
        await redis.setex(
            `tempuser:plan:${userId}`,
            90, // 90 seconds
            JSON.stringify({ planId })
        );

        res.status(200).json({
            success: true,
            message: 'Plan selected and stored temporarily',
            plan,
            user,
        });
    } catch (error) {
        console.error('Error selecting plan:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add a new transaction (payment) for the selected plan
exports.addTransaction = catchAsyncErrors(async (req, res, next) => {
    const { transactionId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Read temp plan from Redis
    const tempPlanStr = await redis.get(`tempuser:plan:${userId}`);
    if (!tempPlanStr) {
        return next(new ErrorHandler("No plan selected or plan has expired", 404));
    }
    const { planId } = JSON.parse(tempPlanStr);

    if (!transactionId) {
        return next(new ErrorHandler("Transaction ID is required", 400));
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
        return next(new ErrorHandler("Plan not found", 404));
    }

    await user.addTransaction(transactionId, plan);

    // Delete temp plan from Redis
    await redis.del(`tempuser:plan:${userId}`);

    res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        user,
    });
});

// Update transaction status (Admin can change status of any user's transaction)
exports.updateTransactionStatus = catchAsyncErrors(async (req, res, next) => {
  const { transactionId, status } = req.body;

  // Check if the user is an admin
  if (req.user.role !== 'admin') {
      return next(new ErrorHandler('You are not authorized to update this transaction', 403));
  }

  // Validate if the status is correct
  if (!["completed", "failed", "pending"].includes(status)) {
      return next(new ErrorHandler('Invalid status', 400));
  }

  // Find the user who has the transaction
  const user = await User.findOne({ 'transactions.transactionId': transactionId });

  if (!user) {
      return next(new ErrorHandler('Transaction not found', 404));
  }

  // Find the transaction by transactionId within the user's transactions array
  const transaction = user.transactions.find(txn => txn.transactionId === transactionId);

  if (!transaction) {
      return next(new ErrorHandler('Transaction not found', 404));
  }

  // Update the status of the transaction
  transaction.status = status;

  // If the transaction status is "completed", approve the transaction and add coins
  if (status === 'completed') {
      // Find the plan associated with the transaction
      const plan = await Plan.findById(transaction.plan);

      if (!plan) {
          return next(new ErrorHandler('Plan not found', 404));
      }

      // Generate coins based on the totalCoins in the plan
      const coinsToAdd = plan.totalCoins;

      // Add coins to the user
      const userToUpdate = await User.findOne({ email: transaction.userId });
      if (!userToUpdate) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Call the method to approve the transaction and add coins to the user's account
    await userToUpdate.approveTransaction(transactionId, coinsToAdd, plan._id);
}

// Save the updated user document with the modified transaction
await User.updateOne(
    { _id: user._id, 'transactions.transactionId': transactionId },
    { $set: { 'transactions.$.status': status } }
);

res.status(200).json({
    success: true,
    message: 'Transaction status updated successfully and coins added if completed',
    transaction,  // Return the updated transaction
});
});

// Get All User Transactions (Admin)
exports.getAllUserTransactions = catchAsyncErrors(async (req, res, next) => {
  // Check if the user is an admin
  if (req.user.role !== 'admin') {
    return next(new ErrorHandler('You are not authorized to view this resource', 403));
  }

  // Fetch all users and their transactions
  const users = await User.find().populate('transactions.plan'); // Populate the plan for each transaction

  if (!users || users.length === 0) {
    return next(new ErrorHandler('No users found', 404));
  }

  // Extract only the required data: user email, transaction ID, status, and transaction date
  const userTransactions = users.map(user => ({
    userId: user.email,
    transactions: user.transactions.map(txn => ({
      transactionId: txn.transactionId,
      plan: txn.plan,
      status: txn.status,
      transactionDate: txn.transactionDate
    }))
  }));

  res.status(200).json({
    success: true,
    userTransactions
  });
});


// Get a user's all transactions
exports.getUserTransactions = catchAsyncErrors(async (req, res, next) => {
  // Find the user by ID and populate the transactions.plan
  const user = await User.findById(req.user.id).populate("transactions.plan");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if the user has any transactions
  if (user.transactions.length === 0) {
    return next(new ErrorHandler("No transactions found", 404));
  }

  // Log the populated user transactions for debugging
  console.log(user.transactions);

  res.status(200).json({
    success: true,
    transactions: user.transactions,
  });
});


// Get the transaction status (specific transaction by transactionId)
exports.getTransactionStatus = catchAsyncErrors(async (req, res, next) => {
  const { transactionId } = req.params;

  // Log the transactionId for debugging
  console.log("Getting Status for Transaction ID:", transactionId);

  // Find the transaction by transactionId
  const transaction = await Transaction.findOne({ transactionId });

  if (!transaction) {
    return next(new ErrorHandler("Transaction not found", 404));
  }

  // Return the status of the transaction
  res.status(200).json({
    success: true,
    status: transaction.status,
    transaction,
  });
});


// Controller to get keys for the authenticated user
exports.getUserKeys = catchAsyncErrors(async (req, res, next) => {
  // Fetch user from the database based on the authenticated user's email
  const user = await User.findOne({ email: req.user.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404)); // Error if user not found
  }

  // Return the user's keys with the specified fields
  const keys = user.keys.map(key => ({
    id: key.id,
    shareableCode: key.shareableCode,
    plan: key.plan,
    status: key.status,
    createdAt: key.createdAt,
  }));

  res.status(200).json({
    success: true,
    keys, // Returning the keys as an array with the required fields
  });
});

exports.getUserCoins = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  let allCoins = [];

  user.keys.forEach(key => {
    if (Array.isArray(key.coin)) {
      allCoins = allCoins.concat(key.coin);
    }
  });

  const now = new Date();

  const activeCoins = allCoins.filter(coin => {
    const expiresAt = coin.expiresAt?.$date || coin.expiresAt;
    return !coin.usedAt && new Date(expiresAt) > now;
  });
  const coinDetails = allCoins.map(coin => ({
    id: coin.id,
    shareableCode: coin.shareableCode,
    activeAt: coin.activeAt?.$date || coin.activeAt || null,
    expiresAt: coin.expiresAt?.$date || coin.expiresAt || null,
    usedAt: coin.usedAt || null,
  }));

  res.status(200).json({
    success: true,
    totalCoins: allCoins.length,
    activeCoinsCount: activeCoins.length,
    coins: coinDetails,
  });
});


// Controller to get all users' keys and coins for the admin
exports.getAllUsersKeysAndCoins = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new ErrorHandler("Access denied. Admins only.", 403));
  }

  const users = await User.find({});

  if (!users || users.length === 0) {
    return next(new ErrorHandler("No users found", 404));
  }

  const allUsersData = users.map(user => {
    let allCoins = [];
    user.keys.forEach(key => {
      if (Array.isArray(key.coin)) {
        allCoins = allCoins.concat(key.coin);
      }
    });

    const now = new Date();

    const coinDetails = allCoins.map(coin => {
      const activeAt = coin.activeAt instanceof Date ? coin.activeAt : new Date(coin.activeAt || null);
      const expiresAt = coin.expiresAt instanceof Date ? coin.expiresAt : new Date(coin.expiresAt || null);
      const usedAt = coin.usedAt instanceof Date ? coin.usedAt : (coin.usedAt ? new Date(coin.usedAt) : null);

      return {
        id: coin.id,
        shareableCode: coin.shareableCode,
        activeAt,
        expiresAt,
        usedAt,
      };
    });

    const activeCoins = coinDetails.filter(coin =>
      !coin.usedAt && coin.expiresAt && coin.expiresAt > now
    );

    const keyDetails = user.keys.map(key => ({
      id: key.id,
      shareableCode: key.shareableCode,
      status: key.status,
      createdAt: key.createdAt instanceof Date ? key.createdAt : new Date(key.createdAt || null),
      plan: key.plan ? key.plan.toString() : null,
    }));

    return {
      userEmail: user.email,
      totalCoins: coinDetails.length,
      activeCoinsCount: activeCoins.length,
      coins: coinDetails,
      keys: keyDetails,
    };
  });

  res.status(200).json({
    success: true,
    usersData: allUsersData,
  });
});

exports.redeemCoinForAllMatches = catchAsyncErrors(async (req, res, next) => {
  const { coinId } = req.body;

  if (!coinId) {
    return next(new ErrorHandler("Coin ID is required", 400));
  }

  const user = await User.findOne({ email: req.user.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const now = new Date();

  // Prevent double redemption within 24 hours
  const hasRecentRedemption = user.keys.some(key =>
    key.coin?.some(coin =>
      coin.usedAt && new Date(coin.usedAt) > new Date(now.getTime() - 24 * 60 * 60 * 1000)
    )
  );

  if (hasRecentRedemption) {
    return next(new ErrorHandler("You can only redeem one coin every 24 hours.", 400));
  }

  let coin = null;

  user.keys.forEach(key => {
    key.coin?.forEach(c => {
      if (c.id === coinId) {
        coin = c;
      }
    });
  });

  
  if (!coin) {
    return next(new ErrorHandler("Coin not found", 404));
  }

  if (coin.usedAt) {
    return next(new ErrorHandler("Coin has already been used", 400));
  }

  const expiresAt = coin.expiresAt?.$date || coin.expiresAt;
  if (expiresAt && new Date(expiresAt) < now) {
    return next(new ErrorHandler("Coin has expired", 400));
  }

  // Redeem coin
  const currentTime = new Date();
  coin.usedAt = currentTime;
  coin.expiresAt = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
  user.accessGrantedUntil = coin.expiresAt;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Coin successfully redeemed for access to all matches for 24 hours.",
    redeemedCoin: {
      id: coin.id,
      shareableCode: coin.shareableCode,
      activeAt: coin.activeAt?.$date || coin.activeAt || null,
      expiresAt: coin.expiresAt,
      usedAt: coin.usedAt,
    },
    accessGrantedUntil: user.accessGrantedUntil,
  });
});


 // Controller to share and redeem a coin with a shareableCode
 exports.redeemSharedCoin = catchAsyncErrors(async (req, res, next) => {
  const { shareableCode } = req.body; // Shareable code for the coin

  // Ensure that the shareableCode is provided
  if (!shareableCode) {
      return next(new ErrorHandler("Shareable code is required", 400));
  }

  // Find the user who is redeeming the coin (recipient user)
  const user = await User.findOne({ email: req.user.email });

  if (!user) {
      return next(new ErrorHandler("User not found", 404)); // If user is not found
  }

  // Find the original user who shared the coin using the shareableCode
  let originalUser = null;
  let sharedCoin = null;

  // Search for the coin in the original user's keys
  const users = await User.find(); // Retrieve all users to search for the coin
  for (let originalUserIter of users) {
      originalUserIter.keys.forEach(key => {
          if (Array.isArray(key.coin)) {
              key.coin.forEach(c => {
                  if (c.shareableCode === shareableCode) {
                      originalUser = originalUserIter;
                      sharedCoin = c;
                  }
              });
          }
      });
  }

  // If the coin is not found
  if (!sharedCoin || !originalUser) {
      return next(new ErrorHandler("Coin with the provided shareable code not found", 404));
  }

  // Check if the coin is already used
  if (sharedCoin.usedAt !== null) {
      return next(new ErrorHandler("Coin has already been used", 400));
  }

   // Check if the coin has expired for the original user
   if (new Date(sharedCoin.expiresAt.$date) < new Date()) {
    return next(new ErrorHandler("Coin has expired", 400));
}

// Redeem the coin for the recipient user (updating the `usedAt` field with the recipient's email)
const currentTime = new Date();
sharedCoin.usedAt = req.user.email; // Mark the coin as used by setting the `usedAt` field to the email of the recipient user
sharedCoin.expiresAt = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // Coin expires 24 hours from redemption

// Save the updated coin for the original user
await originalUser.save();

// Add the redeemed coin to the recipient user's account
user.keys.push({ coin: [sharedCoin] });
await user.save();

// Respond back with the success message
res.status(200).json({
    success: true,
    message: "Coin successfully redeemed from shareable code.",
    redeemedCoin: {
        id: sharedCoin.id,
        shareableCode: sharedCoin.shareableCode,
        activeAt: sharedCoin.activeAt.$date,
        expiresAt: sharedCoin.expiresAt.$date,
        usedAt: sharedCoin.usedAt
    },
    user: {
        email: user.email,
        coins: user.keys.map(key => key.coin)
    }
});
});

// Controller to check the expiry time of the redeemed coin
exports.checkCoinExpiry = catchAsyncErrors(async (req, res, next) => {
  // Find the user who is making the request (assuming the user is authenticated)
  const user = await User.findOne({ email: req.user.email });

  if (!user) {
      return next(new ErrorHandler("User not found", 404)); // If user is not found
  }

  // Directly get the redeemed coin from the user's keys (assumes the redeemed coin was stored in the keys array)
  let coin = null;

  // Search through each key to find the redeemed coin
  user.keys.forEach(key => {
      if (Array.isArray(key.coin)) {
          key.coin.forEach(c => {
              if (c.usedAt !== null && c.usedAt !== undefined) { // Find coin with a non-null 'usedAt'
                  coin = c; // Store the coin if found
              }
          });
      }
  });

  // If the coin is not found
  if (!coin) {
      return next(new ErrorHandler("No redeemed coin found for this user", 400));
  }

  // Ensure expiresAt is a Date object
  const expiryTime = new Date(coin.expiresAt.$date || coin.expiresAt); // Handle both possible formats

  // Check if the coin has already expired
  const currentTime = new Date();

  if (expiryTime < currentTime) {
      return next(new ErrorHandler("Coin has expired", 400));
  }

   // Calculate remaining time (in milliseconds)
   const remainingTime = expiryTime - currentTime;

   if (remainingTime <= 0) {
       return next(new ErrorHandler("Coin has already expired", 400));
   }

   // Convert milliseconds into hours, minutes, and seconds
   const hoursRemaining = Math.floor(remainingTime / (1000 * 60 * 60)); // Convert to hours
   const minutesRemaining = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)); // Convert to minutes
   const secondsRemaining = Math.floor((remainingTime % (1000 * 60)) / 1000); // Convert to seconds

   // Return the remaining time for the coin
   res.status(200).json({
       success: true,
       coinId: coin.id,
       shareableCode: coin.shareableCode,
       expiresAt: coin.expiresAt.$date,
       remainingTime: {
           hours: hoursRemaining,
           minutes: minutesRemaining,
           seconds: secondsRemaining,
       },
   });
});

// Controller to fetch match details by userId (for frontend use)
exports.getMatchDetailsForUser = catchAsyncErrors(async (req, res, next) => {
  // Find the user by their email (assuming user is authenticated)
  const user = await User.findOne({ email: req.user.email }).populate('matches'); // Populate 'matches'

  if (!user) {
      return next(new ErrorHandler("User not found", 404));
  }

  // Check if the user has a match
  const match = user.matches; // The match will be populated here

  if (!match) {
      return next(new ErrorHandler("No match found for this user", 404));
  }

  // Respond with match id and name
  res.status(200).json({
      success: true,
      matchId: match._id,  // match id
      matchName: match.name // match name, defaulted to "viewmatch"
  });
});
