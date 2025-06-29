/**
 * Success response handler
 * @param {Object} res - Express response object
 * @param {*} data - Data to send in the response
 * @param {string} [message='Success'] - Success message
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {Object} - JSON response
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error response handler
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {Array} [errors=[]] - Array of validation errors or additional error details
 * @returns {Object} - JSON response
 */
const errorResponse = (res, message, statusCode = 500, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length ? errors : undefined,
  });
};

/**
 * Validation error response handler
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation errors
 * @param {string} [message='Validation failed'] - Error message
 * @returns {Object} - JSON response with 400 status code
 */
const validationError = (res, errors, message = 'Validation failed') => {
  return errorResponse(res, message, 400, errors);
};

/**
 * Not found response handler
 * @param {Object} res - Express response object
 * @param {string} [message='Resource not found'] - Error message
 * @returns {Object} - JSON response with 404 status code
 */
const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, message, 404);
};

/**
 * Unauthorized response handler
 * @param {Object} res - Express response object
 * @param {string} [message='Unauthorized'] - Error message
 * @returns {Object} - JSON response with 401 status code
 */
const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, message, 401);
};

/**
 * Forbidden response handler
 * @param {Object} res - Express response object
 * @param {string} [message='Forbidden'] - Error message
 * @returns {Object} - JSON response with 403 status code
 */
const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, message, 403);
};

/**
 * Bad request response handler
 * @param {Object} res - Express response object
 * @param {string} [message='Bad request'] - Error message
 * @param {Array} [errors=[]] - Array of validation errors or additional error details
 * @returns {Object} - JSON response with 400 status code
 */
const badRequestResponse = (res, message = 'Bad request', errors = []) => {
  return errorResponse(res, message, 400, errors);
};

/**
 * Internal server error response handler
 * @param {Object} res - Express response object
 * @param {string} [message='Internal server error'] - Error message
 * @param {Error} [error] - Error object for logging
 * @returns {Object} - JSON response with 500 status code
 */
const serverErrorResponse = (res, message = 'Internal server error', error = null) => {
  if (error) {
    console.error('Server Error:', error);
  }
  return errorResponse(res, message, 500);
};

/**
 * Pagination response handler
 * @param {Object} res - Express response object
 * @param {Array} data - Array of paginated data
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @param {number} total - Total number of items
 * @param {string} [message='Success'] - Success message
 * @returns {Object} - JSON response with pagination metadata
 */
const paginatedResponse = (
  res,
  data,
  page,
  limit,
  total,
  message = 'Success'
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return successResponse(
    res,
    {
      items: data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage,
        nextPage: hasNextPage ? page + 1 : null,
        previousPage: hasPreviousPage ? page - 1 : null,
      },
    },
    message
  );
};

const responseHandler = {
  success: successResponse,
  error: errorResponse,
  validation: validationError,
  notFound: notFoundResponse,
  unauthorized: unauthorizedResponse,
  forbidden: forbiddenResponse,
  badRequest: badRequestResponse,
  serverError: serverErrorResponse,
  paginated: paginatedResponse,
};

export {
  responseHandler,
  successResponse,
  errorResponse,
  validationError,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  serverErrorResponse,
  paginatedResponse,
};
