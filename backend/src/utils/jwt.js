'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Sign a JWT for an authenticated user.
 * Keep the payload small: only what we need on every request.
 */
function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

/**
 * Verify and decode a JWT. Throws on invalid / expired tokens.
 */
function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

module.exports = { signToken, verifyToken };
