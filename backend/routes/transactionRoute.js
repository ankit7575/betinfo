const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
    addTransaction,
  updateTransactionStatus,
  getUserTransactions,
  getAllUserTransactions,

} = require("../controller/planController");

// Route to create a new transaction
router.post("/create", isAuthenticatedUser, addTransaction);

// Route to update the transaction status (e.g., after payment confirmation)
router.post("/update-status", isAuthenticatedUser, authorizeRoles("admin"), updateTransactionStatus);

// Route to get all transactions for the logged-in user
router.get("/user-transactions", isAuthenticatedUser,  getUserTransactions);

// Route to get all transactions for the admin
router.get("/all-transactions", isAuthenticatedUser, authorizeRoles("admin"),  getAllUserTransactions);



module.exports = router;
