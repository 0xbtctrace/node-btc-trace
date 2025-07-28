import { logger } from '../utils/logger.js';

export const errorResponseHandler = (err, req, res, next) => {
  const status = err.status || 500;

  const errorResponse = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Internal Server Error',
      status,
      details: err.details || null,
    },
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  logger.error(errorResponse);

  res.status(status).json(errorResponse);
};
