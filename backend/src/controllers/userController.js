'use strict';

const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const config = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const { ok, noContent } = require('../utils/respond');
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
} = require('../utils/errors');

const PUBLIC_USER_COLS =
  'id, name, email, role, created_at, updated_at';

/**
 * GET /api/users   (admin / manager)
 *
 * Query:
 *   role       filter by role
 *   q          search name/email
 *   limit, offset
 */
const list = asyncHandler(async (req, res) => {
  const { role, q } = req.query;
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 50));
  const offset = Math.max(0, Number(req.query.offset) || 0);

  const where = [];
  const params = [];
  if (role) {
    where.push('role = ?');
    params.push(role);
  }
  if (q) {
    where.push('(name LIKE ? OR email LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await pool.execute(
    `SELECT ${PUBLIC_USER_COLS} FROM users ${whereSql}
     ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`,
    params
  );
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM users ${whereSql}`,
    params
  );

  return ok(res, rows, { total: countRows[0].total, limit, offset });
});

/**
 * GET /api/users/:id   (admin / manager, or self)
 */
const getById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (id !== req.user.id && !['admin', 'manager'].includes(req.user.role)) {
    throw new ForbiddenError('You can only view your own profile');
  }

  const [rows] = await pool.execute(
    `SELECT ${PUBLIC_USER_COLS} FROM users WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) throw new NotFoundError('User not found');
  return ok(res, rows[0]);
});

/**
 * PATCH /api/users/:id   (admin)
 * Allows updating: name, role, password.
 *
 * Safety rails:
 *  - Admins cannot demote themselves out of the 'admin' role
 *    (so the system always has at least one admin path).
 */
const update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { name, role, password } = req.body;

  const [existing] = await pool.execute(
    'SELECT id, role FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  if (existing.length === 0) throw new NotFoundError('User not found');

  if (id === req.user.id && role && role !== 'admin') {
    throw new BadRequestError('Admins cannot demote themselves');
  }

  const fields = [];
  const params = [];
  if (name) {
    fields.push('name = ?');
    params.push(name);
  }
  if (role) {
    fields.push('role = ?');
    params.push(role);
  }
  if (password) {
    const hash = await bcrypt.hash(password, config.bcrypt.saltRounds);
    fields.push('password_hash = ?');
    params.push(hash);
  }
  if (fields.length === 0) throw new BadRequestError('No fields to update');

  params.push(id);
  await pool.execute(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    params
  );

  const [rows] = await pool.execute(
    `SELECT ${PUBLIC_USER_COLS} FROM users WHERE id = ?`,
    [id]
  );
  return ok(res, rows[0]);
});

/**
 * DELETE /api/users/:id  (admin)
 *
 * orders.user_id is ON DELETE RESTRICT, so if a user has any orders
 * MySQL will refuse the delete. We surface that as a 409 in the
 * error handler instead of crashing.
 */
const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (id === req.user.id) {
    throw new BadRequestError('You cannot delete your own account');
  }

  const [existing] = await pool.execute(
    'SELECT id FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  if (existing.length === 0) throw new NotFoundError('User not found');

  await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  return noContent(res);
});

module.exports = { list, getById, update, remove };

// Re-export helper to avoid duplicates elsewhere
module.exports._duplicateCheck = async (email, ignoreId = null) => {
  const sql = ignoreId
    ? 'SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1'
    : 'SELECT id FROM users WHERE email = ? LIMIT 1';
  const params = ignoreId ? [email, ignoreId] : [email];
  const [rows] = await pool.execute(sql, params);
  if (rows.length > 0) throw new ConflictError('Email is already registered');
};
