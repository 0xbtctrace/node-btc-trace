import HTTP_ERR_CODES from './httpErrorCodes.js';
import { logger } from '../utils/logger.js';

const errorResponseHandler = (err, req, res, next) => {
  const status = err.status || 500;

  const errorResponse = {
    success: false,
    error: {
      status,
      code: err.code || HTTP_ERR_CODES[500],
      message: err.message || 'Internal Server Error',
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

export default errorResponseHandler;
