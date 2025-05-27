const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Match = require("../models/matchModel");
const crypto = require('crypto');
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { sendEmail } = require("../utils/sendEmail");
const sendToken = require("../utils/jwttoken");


// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, phoneNumber } = req.body;

  // Validate the phone number (optional, can add more checks here if needed)
  if (!/^\d{10}$/.test(phoneNumber)) {
    return next(new ErrorHandler("Invalid phone number format", 400));
  }

  // Check if the user already exists by email
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorHandler("User already exists", 400));
  }

  // Determine the role based on email (hardcoded admin check)
  const role = email === "ankitvashist765@gmail.com" ? "admin" : "user";

  // Create a new user
  const user = new User({
    name,
    email,
    password,  // Save the hashed password
    phoneNumber,
    role,
  });

  // Save the user to the database
  await user.save();

  // Send JWT token in the response (assuming sendToken is a utility function to handle JWT)
  sendToken(user, 201, res);
});


// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if user has provided both email and password
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});
// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("User not authenticated", 401));
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false, // optional for secure cookie
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // optional
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Creating token hash from the URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Find user with the valid token and an unexpired reset token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
  }

  // Check if passwords match
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // Update user's password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // Send back the token after successful reset
  sendToken(user, 200, res);
});

// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  // Find user by ID (req.user.id comes from the JWT middleware)
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  // Find user by ID and include password field
  const user = await User.findById(req.user.id).select("+password");

  // Compare old password with the one in the database
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // Check if new password and confirm password match
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Set new password
  user.password = req.body.newPassword;

  // Save the updated password
  await user.save();

  // Send new JWT token to the user after updating the password
  sendToken(user, 200, res);
});

// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Update user profile data (excluding avatar)
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get Single User (Admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  // Find user by ID using the ID passed in the request params
  const user = await User.findById(req.params.id);

  // If user not found, throw error
  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
  }

  // If user found, return user data
  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role - Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role, // Update role (user/admin)
  };

  // Find user by ID and update with new data
  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
  });
});

// Delete User - Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  // Find user by ID and delete
  const user = await User.findByIdAndDelete(req.params.id);

  // If user not found, return an error
  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400));
  }

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});


// User Activity Logs
exports.createUserActivityLog = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
  
    const activity = new ActivityLog({
      userId: user._id,
      action: req.body.action,  // Example: "Password Changed", "Profile Updated"
      date: new Date(),
    });
  
    await activity.save();
  
    res.status(200).json({
      success: true,
      message: "Activity logged successfully",
    });
  });

  // Search Users (Admin)
exports.searchUsers = catchAsyncErrors(async (req, res, next) => {
    const { query } = req.query; // Search query parameter (e.g., name, email, etc.)
  
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive search
        { email: { $regex: query, $options: "i" } }
      ]
    });
  
    res.status(200).json({
      success: true,
      users,
    });
  });

  
  // Get User Statistics (Admin)
exports.getUserStatistics = catchAsyncErrors(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ active: true });  // Example: track active users
  
    res.status(200).json({
      success: true,
      statistics: {
        totalUsers,
        activeUsers,
      },
    });
  });

  

  // Get User Notifications
exports.getUserNotifications = catchAsyncErrors(async (req, res, next) => {
    const notifications = await Notification.find({ userId: req.user.id });
  
    res.status(200).json({
      success: true,
      notifications,
    });
  });


  // Mark Notification as Read
exports.markNotificationAsRead = catchAsyncErrors(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);
  
    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    }
  
    notification.isRead = true;
    await notification.save();
  
    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  });
  