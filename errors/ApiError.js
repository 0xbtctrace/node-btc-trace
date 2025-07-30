/**
 * @class ApiError
 * @extends Error
 *
 * Represents a standardized error object for API responses.
 * This class is useful for sending structured and consistent error responses,
 * including HTTP status codes, custom error codes, messages, and optional details.
 *
 * @example
 * throw new ApiError(400, 'BAD_REQUEST', 'Request validation failed', {
 *   field: 'blockhash',
 *   reason: 'Length must be 64 characters long',
 * });
 */
class ApiError extends Error {
  /**
   * Create a new ApiError instance.
   *
   * @param {number} status - HTTP status code (e.g., 400, 404, 500).
   * @param {string} code - Application-specific error code (e.g., 'BAD_REQUEST', 'NOT_FOUND').
   * @param {string} message - Human-readable error message (e.g., 'Request validation failed').
   * @param {object|string|null} [details=null] - Additional error context (e.g., validation errors, debug info).
   */
  constructor(status, code, message, details = null) {
    super(message);

    /**
     * @property {string} name - Error class name (e.g., 'ApiError').
     */
    this.name = this.constructor.name;

    /**
     * @property {number} status - HTTP status code to be sent in response.
     */
    this.status = status;

    /**
     * @property {string} code - Custom application error code.
     */
    this.code = code;

    /**
     * @property {string} message - Error message passed to Error superclass.
     */
    this.message = message;

    /**
     * @property {object|string|null} details - Optional additional information.
     */
    this.details = details;

    // Capture stack trace for debugging (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
