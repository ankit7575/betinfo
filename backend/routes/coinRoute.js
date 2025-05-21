const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
    getUserKeys,
    getUserCoins,
    getAllUsersKeysAndCoins,
    redeemCoinForAllMatches,
    redeemSharedCoin,
    checkCoinExpiry,
    getMatchDetailsForUser,
} = require("../controller/planController");

// Route to get keys and coins for a user
router.get('/coins', isAuthenticatedUser, getUserCoins);
router.get('/keys', isAuthenticatedUser,getUserKeys );
router.get('/keys-coins', isAuthenticatedUser, authorizeRoles("admin"),getAllUsersKeysAndCoins );


// Route to redeem a coin for a match
router.post('/redeem/all-matches', isAuthenticatedUser, redeemCoinForAllMatches);


// Route to use a coin (activate match pass)
router.post('/redeem/shared', isAuthenticatedUser, redeemSharedCoin);

// Route to check if a coin has expired
router.post('/check/expiry', isAuthenticatedUser, checkCoinExpiry);
router.get('/matches/user', isAuthenticatedUser, getMatchDetailsForUser);


module.exports = router;
