const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Check if the user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // Try extracting token from cookies
  let token = req.cookies.token;

  // If no token in cookies, try extracting from Authorization header
  if (!token) {
    token = req.headers["authorization"]?.split(" ")[1];  // Bearer token from header
  }

  // If no token is found
  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  try {
    // Decode token and verify
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user to the request object
    req.user = await User.findById(decodedData.id);

    // Proceed to the next middleware
    next();
  } catch (error) {
    // If the token is invalid or expired
    return next(new ErrorHandler("Token is invalid or expired", 401));
  }
});

// Authorize roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    // Check if the user's role matches any of the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    // Proceed to the next middleware
    next();
  };
};
