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

  errorResponse.error.stack = err.stack;

  // include req, res object if it's an production for easy debugging..
  if (process.env.NODE_ENV === 'production') {
    errorResponse.req = req;
  }

  logger.error(errorResponse);

  // Exclude stack in production env
  if (process.env.NODE_ENV === 'production') {
    delete errorResponse.error.stack;
    delete errorResponse.req;
  }

  res.status(status).json(errorResponse);
};

export default errorResponseHandler;
