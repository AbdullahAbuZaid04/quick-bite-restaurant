'use strict';

const config = require('../config/env');
const { AppError } = require('../utils/errors');
const { fail } = require('../utils/respond');

/**
 * 404 handler - mounted *after* all routes.
 */
function notFound(req, _res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

/**
 * Centralised error handler.
 *
 * Translates known MySQL error codes into clean 4xx responses and
 * lets everything else surface as a 500 (with the stack only in dev).
 */
function errorHandler(err, req, res, _next) {
  // Operational AppErrors -> send straight through.
  if (err instanceof AppError) {
    return fail(res, err.statusCode, err.message, err.details);
  }

  // MySQL duplicate-key (e.g. unique email/category name)
  if (err && err.code === 'ER_DUP_ENTRY') {
    return fail(res, 409, 'Duplicate entry: a record with this value already exists');
  }

  // MySQL FK constraint failures
  if (err && (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW')) {
    return fail(res, 400, 'Referenced record does not exist');
  }
  if (err && err.code === 'ER_ROW_IS_REFERENCED_2') {
    return fail(res, 409, 'Cannot delete: this record is referenced by other records');
  }

  // JSON parse errors from body-parser
  if (err && err.type === 'entity.parse.failed') {
    return fail(res, 400, 'Invalid JSON payload');
  }

  // Unknown / unexpected -> log and respond 500.
  // eslint-disable-next-line no-console
  console.error('[unhandled error]', err);

  const message =
    config.env === 'production'
      ? 'Internal server error'
      : (err && err.message) || 'Internal server error';

  const details = config.env === 'production' ? undefined : { stack: err && err.stack };

  return fail(res, 500, message, details);
}

module.exports = { notFound, errorHandler };
