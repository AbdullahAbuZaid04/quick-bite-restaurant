'use strict';

const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created, noContent } = require('../utils/respond');
const { NotFoundError, ConflictError } = require('../utils/errors');

// All read paths exclude soft-deleted rows.
// Historical JOINs (e.g. from menu_items or orders) still find them
// because the rows physically remain in the table.
const LIVE = 'deleted_at IS NULL';

/**
 * GET /api/categories
 * Public. List all live categories, alphabetically.
 */
const list = asyncHandler(async (_req, res) => {
  const [rows] = await pool.execute(
    `SELECT id, name, created_at, updated_at
     FROM categories
     WHERE ${LIVE}
     ORDER BY name ASC`
  );
  return ok(res, rows);
});

/**
 * GET /api/categories/:id
 * Public. Soft-deleted categories return 404.
 */
const getById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await pool.execute(
    `SELECT id, name, created_at, updated_at
     FROM categories WHERE id = ? AND ${LIVE}`,
    [id]
  );
  if (rows.length === 0) throw new NotFoundError('Category not found');
  return ok(res, rows[0]);
});

/**
 * POST /api/categories  (admin / manager)
 * Duplicate-name check ignores retired categories — the migration
 * enforces this at the DB level too via uq_categories_name_live.
 */
const create = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const [dup] = await pool.execute(
    `SELECT id FROM categories WHERE name = ? AND ${LIVE} LIMIT 1`,
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
    `SELECT id FROM categories WHERE id = ? AND ${LIVE} LIMIT 1`,
    [id]
  );
  if (existing.length === 0) throw new NotFoundError('Category not found');

  const [dup] = await pool.execute(
    `SELECT id FROM categories
     WHERE name = ? AND id <> ? AND ${LIVE} LIMIT 1`,
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
 *
 * Soft delete: sets deleted_at = NOW(). The row physically remains
 * so historical menu_items and orders that reference this category
 * can still resolve the category name via JOIN — but the category
 * disappears from /api/categories listings and lookups.
 *
 * Refuses to delete a category that still has live menu items, so
 * we don't leave items "orphaned" in a retired category. Admins
 * should retire the items first (or move them to another category
 * via PUT /api/menu/:id).
 */
const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const [existing] = await pool.execute(
    `SELECT id FROM categories WHERE id = ? AND ${LIVE} LIMIT 1`,
    [id]
  );
  if (existing.length === 0) throw new NotFoundError('Category not found');

  const [liveChildren] = await pool.execute(
    `SELECT COUNT(*) AS n FROM menu_items
     WHERE category_id = ? AND deleted_at IS NULL`,
    [id]
  );
  if (liveChildren[0].n > 0) {
    throw new ConflictError(
      'Cannot delete: this category still has live menu items. Retire them first, or reassign them to another category.',
      { live_items: liveChildren[0].n }
    );
  }

  await pool.execute(
    'UPDATE categories SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
  return noContent(res);
});

module.exports = { list, getById, create, update, remove };
