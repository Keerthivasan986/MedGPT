import env from '../config/env.js';
import logger from '../utils/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) logger.error(err);

  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(err.details ? { errors: err.details } : {}),
    ...(env.nodeEnv === 'development' && status >= 500 ? { stack: err.stack } : {})
  });
}
