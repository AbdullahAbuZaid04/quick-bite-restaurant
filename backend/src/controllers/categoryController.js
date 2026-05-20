'use strict';

const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created, noContent } = require('../utils/respond');
const { NotFoundError, ConflictError } = require('../utils/errors');

/**
 * GET /api/categories
 * Public. List all categories, alphabetically.
 */
const list = asyncHandler(async (_req, res) => {
  const [rows] = await pool.execute(
    `SELECT id, name, created_at, updated_at
     FROM categories
     ORDER BY name ASC`
  );
  return ok(res, rows);
});

/**
 * GET /api/categories/:id
 * Public.
 */
const getById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await pool.execute(
    `SELECT id, name, created_at, updated_at
     FROM categories WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) throw new NotFoundError('Category not found');
  return ok(res, rows[0]);
});

/**
 * POST /api/categories  (admin / manager)
 */
const create = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const [dup] = await pool.execute(
    'SELECT id FROM categories WHERE name = ? LIMIT 1',
    [name]
  );
  if (dup.length > 0) throw new ConflictError('A category with this name already exists');

  const [result] = await pool.execute(
    'INSERT INTO categories (name) VALUES (?)',
    [name]
  );
  const [rows] = await pool.execute(
    `SELECT id, name, created_at, updated_at FROM categories WHERE id = ?`,
    [result.insertId]
  );
  return created(res, rows[0]);
});

/**
 * PUT /api/categories/:id  (admin / manager)
 */
const update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  const [existing] = await pool.execute(
    'SELECT id FROM categories WHERE id = ? LIMIT 1',
    [id]
  );
  if (existing.length === 0) throw new NotFoundError('Category not found');

  const [dup] = await pool.execute(
    'SELECT id FROM categories WHERE name = ? AND id <> ? LIMIT 1',
    [name, id]
  );
  if (dup.length > 0) throw new ConflictError('Another category with this name already exists');

  await pool.execute('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
  const [rows] = await pool.execute(
    `SELECT id, name, created_at, updated_at FROM categories WHERE id = ?`,
    [id]
  );
  return ok(res, rows[0]);
});

/**
 * DELETE /api/categories/:id  (admin)
 * The FK on menu_items.category_id is ON DELETE RESTRICT, so
 * MySQL will block this if menu items still reference the category;
 * the error handler turns ER_ROW_IS_REFERENCED_2 into a 409.
 */
const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const [existing] = await pool.execute(
    'SELECT id FROM categories WHERE id = ? LIMIT 1',
    [id]
  );
  if (existing.length === 0) throw new NotFoundError('Category not found');

  await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
  return noContent(res);
});

module.exports = { list, getById, create, update, remove };
