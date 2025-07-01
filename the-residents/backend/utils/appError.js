/**
 * Custom error class for operational errors (errors we can predict and handle)
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture the stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
