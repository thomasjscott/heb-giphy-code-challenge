class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Removes this file from the stacktrace.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
