export const errorHandler = (err, req, res, next) => {
  // Set default values
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log the error for debugging
  console.error(`${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'Internal Server Error';
  }

  // Send error response
  res.status(status).json({
    success: false,
    error: {
      message,
      status,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};