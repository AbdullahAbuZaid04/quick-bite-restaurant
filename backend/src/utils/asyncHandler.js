'use strict';

/**
 * Wraps an async route handler so any thrown / rejected error is
 * passed to Express's error middleware instead of crashing the
 * process. Saves a try/catch in every controller.
 *
 *   router.get('/foo', asyncHandler(async (req, res) => { ... }));
 */
module.exports = function asyncHandler(fn) {
  return function wrappedAsyncHandler(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
