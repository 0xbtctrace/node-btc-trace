import ApiError from './ApiError.js';
import HTTP_ERR_CODES from './httpErrorCodes.js';

export const parseAxiosError = (error, fallbackStatus = 502) => {
  if (error.response) {
    return new ApiError(
      error.response.status || fallbackStatus,
      `REMOTE_${error.response.status}`,
      error.response.data?.error || error.message,
      error.response.data || null
    );
  }

  if (error.code === 'ECONNABORTED') {
    return new ApiError(
      504,
      HTTP_ERR_CODES[504],
      'Request timed out',
      error.message
    );
  }

  if (error.request) {
    return new ApiError(
      503,
      HTTP_ERR_CODES[503],
      'No response from remote server'
    );
  }

  return new ApiError(fallbackStatus, HTTP_ERR_CODES[502], error.message);
};
