const jwt = require("jsonwebtoken");

/**
 * Function to send the JWT token in the response
 * @param {Object} user - User object containing user details
 * @param {Number} statusCode - HTTP status code for the response
 * @param {Object} res - Express response object
 * @param {String} message - Optional message to include in the response
 */
const sendToken = (user, statusCode, res, message = "Success") => {
  // Generate a new access token
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d", // Default expiration of 1 day
  });

  // Calculate cookie expiration time
  const expireTime = parseInt(process.env.COOKIE_EXPIRE, 10) || 1; // Default to 1 day
  const expires = new Date(Date.now() + expireTime * 24 * 60 * 60 * 1000);

  // Configure cookie options
  const options = {
    expires,
    httpOnly: true, // Prevent access to cookie via JavaScript
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict", // Helps mitigate CSRF attacks
  };

  // Send the token as a cookie and in the JSON response
  res.status(statusCode)
    .cookie("token", accessToken, options)
    .json({
      success: true,
      message,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user", // Default role to 'user' if not provided
      },
      accessToken, // Include the generated token for frontend storage
    });
};

module.exports = sendToken;
