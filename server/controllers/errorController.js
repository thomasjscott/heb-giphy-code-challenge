/**
 * Provides abuility to catch errors and send them back to client
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: 'error',
    message: err.message
  });
};
