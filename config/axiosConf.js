import axios from 'axios';
import { logger } from '../utils/logger.js';

const maxRetries = 4; // Maximum number of retries
const baseRetryDelay = 2000; // Base delay in milliseconds between retries
const retryableStatusCodes = [
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
  408, // Request Timeout
  429, // too Many Requests
];

const convertAxiosErrorToJsError = (axiosError) => {
  // Convert the Axios error into a JSON object
  const errorJson = {
    message: axiosError.message,
    response: {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      headers: axiosError.response?.headers,
    },
    request: {
      method: axiosError.config.method,
      url: axiosError.config.url,
      headers: axiosError.config.headers,
      data: axiosError.config.data,
    },
  };

  // Create a new Error object with the JSON representation of the Axios error
  let jsonError;
  if (
    axiosError &&
    axiosError.response &&
    axiosError.response.data &&
    axiosError.response.data.error &&
    axiosError.response.data.error.msg
  ) {
    jsonError = new Error(
      `Axios Error, ${axiosError.message}, ${axiosError.response.data.error.msg}`
    );
  } else {
    jsonError = new Error(`AxiosError, ${axiosError.message}`);
  }
  jsonError.axios = errorJson;
  return jsonError;
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // Check if the error is due to a network issue or a timeout
    if (
      error.code === 'ECONNABORTED' || // Timeout
      (!response && error.code === 'ECONNREFUSED') // Network-related error
    ) {
      const currentRetry = config.retryCount || 1;

      // Retry the request if the maximum number of retries has not been reached
      if (currentRetry <= maxRetries) {
        logger.warn(`Request failed, retrying.`, {
          retryCount: currentRetry,
        });

        // Increase the retry count
        config.retryCount = currentRetry + 1;

        // Calculate the exponential delay
        const exponentialDelay = baseRetryDelay * Math.pow(2, currentRetry - 1);

        // Add a delay before retrying
        await new Promise((resolve) => setTimeout(resolve, exponentialDelay));

        // Retry the request
        return axios(config);
      } else {
        logger.warn(`Request failed, after max retries.`, {});
      }
    }

    // Check if the response status is in the retryableStatusCodes array
    if (response && retryableStatusCodes.includes(response.status)) {
      const currentRetry = config.retryCount || 1;

      // Calculate the exponential delay
      const exponentialDelay = baseRetryDelay * Math.pow(2, currentRetry - 1);

      // Retry the request if the maximum number of retries has not been reached
      if (currentRetry <= maxRetries) {
        logger.warn(`Request failed, retrying..`, {
          statusCode: response.status,
          retryCount: currentRetry,
          nextRetryDelay: exponentialDelay,
        });

        // Increase the retry count
        config.retryCount = currentRetry + 1;

        // Add a delay before retrying
        await new Promise((resolve) => setTimeout(resolve, exponentialDelay));

        // Retry the request
        return axios(config);
      } else {
        logger.warn(`Request failed, after max retries.`, {
          statusCode: response.status,
        });
      }
    }

    const jsError = convertAxiosErrorToJsError(error);
    logger.error(jsError);

    // If no retry is needed or the maximum retries are reached, reject the promise
    throw error;
  }
);
