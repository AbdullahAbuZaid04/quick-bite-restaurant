'use strict';

require('dotenv').config();

/**
 * Centralised, validated configuration object.
 * Throw early on missing critical values so we never start with
 * a half-broken server.
 */
function required(name) {
  const v = process.env[name];
  if (v === undefined || v === null || v === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

function intEnv(name, defaultValue) {
  const v = process.env[name];
  if (v === undefined || v === '') return defaultValue;
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) {
    throw new Error(`Env var ${name} must be an integer, got: ${v}`);
  }
  return n;
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: intEnv('PORT', 5000),

  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: intEnv('DB_PORT', 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'food_ordering',
    connectionLimit: intEnv('DB_CONNECTION_LIMIT', 10),
  },

  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  bcrypt: {
    saltRounds: intEnv('BCRYPT_SALT_ROUNDS', 10),
  },

  admin: {
    name: process.env.ADMIN_NAME || 'Administrator',
    email: process.env.ADMIN_EMAIL || 'admin@quickbite.local',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
  },
};

module.exports = config;
