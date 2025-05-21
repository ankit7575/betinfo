const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
  createUserActivityLog,
  searchUsers,
  getUserStatistics,
  getUserNotifications,
  markNotificationAsRead,
} = require("../controller/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Register a User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Logout User
router.get("/logout", logout);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.put("/password/reset/:token", resetPassword);

// Get User Details
router.get("/me", isAuthenticatedUser, getUserDetails);

// Update User Password
router.put("/password/update", isAuthenticatedUser, updatePassword);

// Update User Profile
router.put("/profile/update", isAuthenticatedUser, updateProfile);

// Get All Users (Admin)
router.get("/admin/users", isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

// Get Single User (Admin)
router.get("/admin/user/:id", isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);

// Update User Role (Admin)
router.put("/admin/user/:id/role", isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);

// Delete User (Admin)
router.delete("/admin/user/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

// User Activity Logs
router.post("/activity-log", isAuthenticatedUser, createUserActivityLog);

// Search Users (Admin)
router.get("/admin/users/search", isAuthenticatedUser, authorizeRoles("admin"), searchUsers);

// Get User Statistics (Admin)
router.get("/admin/statistics", isAuthenticatedUser, authorizeRoles("admin"), getUserStatistics);

// Get User Notifications
router.get("/notifications", isAuthenticatedUser, getUserNotifications);

// Mark Notification as Read
router.put("/notifications/:id/read", isAuthenticatedUser, markNotificationAsRead);

module.exports = router;
