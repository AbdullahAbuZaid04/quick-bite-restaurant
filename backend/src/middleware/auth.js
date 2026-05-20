'use strict';

const { verifyToken } = require('../utils/jwt');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

/**
 * Extract the bearer token from the Authorization header.
 *   Authorization: Bearer <token>
 */
function getBearerToken(req) {
  const header = req.headers.authorization;
  if (!header || typeof header !== 'string') return null;
  const [scheme, token] = header.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) return null;
  return token.trim();
}

/**
 * Require a valid JWT. On success, attaches `req.user`:
 *   { id, role, email }
 */
function authenticate(req, _res, next) {
  const token = getBearerToken(req);
  if (!token) return next(new UnauthorizedError('Authentication token required'));

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
    };
    return next();
  } catch (err) {
    if (err && err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token expired'));
    }
    return next(new UnauthorizedError('Invalid authentication token'));
  }
}

/**
 * Role-gate factory.
 *   router.post('/admin', authenticate, authorize('admin'), handler)
 *   router.get ('/foo',   authenticate, authorize('admin', 'manager'), handler)
 */
function authorize(...allowedRoles) {
  return function authorizeMiddleware(req, _res, next) {
    if (!req.user) return next(new UnauthorizedError());
    if (allowedRoles.length === 0) return next();
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions for this resource'));
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
