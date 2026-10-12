/**
 * Centralized error handler middleware.
 * Ensures internal details and stack traces are not leaked to clients.
 */
function errorHandler(err, req, res, next) {
  // Log error on server side for debugging
  console.error(`[Error] ${req.method} ${req.url}:`, err.message || err);

  const statusCode = err.status || err.statusCode || 500;
  const message = statusCode === 500 
    ? 'An unexpected internal server error occurred. Please try again later.' 
    : err.message || 'An error occurred';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'test' ? { details: err.message } : {})
  });
}

/**
 * 404 handler for undefined API routes
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
