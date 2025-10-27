exports.requestLogger = (req, res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.originalUrl}`);
  next();
};

exports.errorLogger = (err, req, res, next) => {
  console.error('Error:', err && err.message ? err.message : err);
  next(err);
};
