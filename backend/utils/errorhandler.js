// utils/errorHandler.js
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // This ensures that the stack trace is included in development
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;
