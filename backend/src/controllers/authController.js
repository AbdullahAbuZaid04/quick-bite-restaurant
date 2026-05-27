'use strict';

const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const config = require('../config/env');
const { signToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/respond');
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../utils/errors');

/**
 * Strip sensitive fields before returning a user row to the client.
 */
function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * POST /api/auth/register
 * Self-registration. Always creates a 'customer' account.
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check email uniqueness up-front to give a clean message.
  // (The DB also enforces uq_users_email, which the error handler
  //  would translate to a 409 - this is just for a nicer payload.)
  const [existing] = await pool.execute(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  if (existing.length > 0) {
    throw new ConflictError('Email is already registered');
  }

  const passwordHash = await bcrypt.hash(password, config.bcrypt.saltRounds);

  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, 'customer')`,
    [name, email, passwordHash]
  );

  const [rows] = await pool.execute(
    `SELECT id, name, email, role, created_at, updated_at
     FROM users WHERE id = ?`,
    [result.insertId]
  );
  const user = publicUser(rows[0]);
  const token = signToken(user);

  return created(res, { user, token });
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.execute(
    `SELECT id, name, email, role, password_hash, created_at, updated_at
     FROM users WHERE email = ? LIMIT 1`,
    [email]
  );

  if (rows.length === 0) {
    // Generic message - don't leak which half (email vs password) failed.
    throw new UnauthorizedError('Invalid email or password');
  }

  const row = rows[0];
  const matches = await bcrypt.compare(password, row.password_hash);
  if (!matches) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const user = publicUser(row);
  const token = signToken(user);

  return ok(res, { user, token });
});

/**
 * GET /api/auth/me
 * Requires authentication. Returns the current user's profile.
 */
const me = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT id, name, email, role, created_at, updated_at
     FROM users WHERE id = ?`,
    [req.user.id]
  );
  if (rows.length === 0) {
    throw new NotFoundError('User not found');
  }
  return ok(res, { user: publicUser(rows[0]) });
});

/**
 * PATCH /api/auth/me
 * Update own name / password.
 */
const updateMe = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name && !password) {
    throw new BadRequestError('No fields to update');
  }

  const fields = [];
  const params = [];
  if (name) {
    fields.push('name = ?');
    params.push(name);
  }
  if (password) {
    const hash = await bcrypt.hash(password, config.bcrypt.saltRounds);
    fields.push('password_hash = ?');
    params.push(hash);
  }
  params.push(req.user.id);

  await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);

  const [rows] = await pool.execute(
    `SELECT id, name, email, role, created_at, updated_at
     FROM users WHERE id = ?`,
    [req.user.id]
  );
  return ok(res, { user: publicUser(rows[0]) });
});

module.exports = { register, login, me, updateMe };
