'use strict';

const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created, noContent } = require('../utils/respond');
const { NotFoundError, BadRequestError } = require('../utils/errors');

// All public/admin read paths exclude soft-deleted rows.
// Historical order_items still JOIN to find the original row, because
// it physically remains in the table.
const M_LIVE = 'm.deleted_at IS NULL';

/**
 * Helper: assert that a category exists *and is not retired*.
 * Throws 400 if not, so the frontend gets a clean message rather
 * than a raw FK error.
 */
async function assertCategoryExists(categoryId) {
  const [rows] = await pool.execute(
    'SELECT id FROM categories WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [categoryId]
  );
  if (rows.length === 0) {
    throw new BadRequestError('Referenced category does not exist');
  }
}

const SELECT_MENU = `
  SELECT
    m.id, m.name, m.description, m.price,
    m.category_id, c.name AS category_name,
    m.prepare_time, m.image_url, m.is_available,
    m.created_at, m.updated_at
  FROM menu_items m
  INNER JOIN categories c ON c.id = m.category_id
`;

/**
 * GET /api/menu
 *
 * Query params:
 *   category_id  filter by category
 *   available    'true' / 'false'
 *   q            case-insensitive search in name/description
 *   limit, offset
 *
 * Soft-deleted items are never returned.
 *
 * Note on pagination: mysql2 prepared statements forbid binding
 * LIMIT/OFFSET as parameters in some versions, so we cast to Number
 * and inline them after Joi has validated they're safe integers.
 */
const list = asyncHandler(async (req, res) => {
  const { category_id, available, q, limit, offset } = req.query;

  const where = [M_LIVE];
  const params = [];

  if (category_id !== undefined) {
    where.push('m.category_id = ?');
    params.push(category_id);
  }
  if (available !== undefined) {
    where.push('m.is_available = ?');
    params.push(available ? 1 : 0);
  }
  if (q) {
    where.push('(m.name LIKE ? OR m.description LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  const whereSql = `WHERE ${where.join(' AND ')}`;
  const lim = Number(limit) || 50;
  const off = Number(offset) || 0;

  const [rows] = await pool.execute(
    `${SELECT_MENU} ${whereSql}
     ORDER BY m.id DESC
     LIMIT ${lim} OFFSET ${off}`,
    params
  );

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM menu_items m
     ${whereSql}`,
    params
  );

  return ok(res, rows, { total: countRows[0].total, limit: lim, offset: off });
});

/**
 * GET /api/menu/:id
 * Soft-deleted items return 404.
 */
const getById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await pool.execute(
    `${SELECT_MENU} WHERE m.id = ? AND ${M_LIVE}`,
    [id]
  );
  if (rows.length === 0) throw new NotFoundError('Menu item not found');
  return ok(res, rows[0]);
});

/**
 * POST /api/menu  (admin / manager)
 */
const create = asyncHandler(async (req, res) => {
  const {
    name,
    description = null,
    price,
    category_id,
    prepare_time,
    image_url = null,
    is_available = true,
  } = req.body;

  await assertCategoryExists(category_id);

  const [result] = await pool.execute(
    `INSERT INTO menu_items
      (name, description, price, category_id, prepare_time, image_url, is_available)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description, price, category_id, prepare_time, image_url, is_available ? 1 : 0]
  );

  const [rows] = await pool.execute(`${SELECT_MENU} WHERE m.id = ?`, [result.insertId]);
  return created(res, rows[0]);
});

/**
 * PUT /api/menu/:id  (admin / manager)
 * Partial-update friendly: only supplied fields are changed.
 * Soft-deleted items cannot be updated (return 404).
 */
const update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const [existing] = await pool.execute(
    'SELECT id FROM menu_items WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [id]
  );
  if (existing.length === 0) throw new NotFoundError('Menu item not found');

  const allowed = [
    'name',
    'description',
    'price',
    'category_id',
    'prepare_time',
    'image_url',
    'is_available',
  ];
  const fields = [];
  const params = [];

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      let v = req.body[key];
      if (key === 'is_available') v = v ? 1 : 0;
      fields.push(`${key} = ?`);
      params.push(v);
    }
  }

  if (fields.length === 0) {
    throw new BadRequestError('No fields to update');
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'category_id')) {
    await assertCategoryExists(req.body.category_id);
  }

  params.push(id);
  await pool.execute(
    `UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`,
    params
  );

  const [rows] = await pool.execute(`${SELECT_MENU} WHERE m.id = ?`, [id]);
  return ok(res, rows[0]);
});

/**
 * PATCH /api/menu/:id/availability  (admin / manager)
 */
const setAvailability = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { is_available } = req.body;

  const [existing] = await pool.execute(
    'SELECT id FROM menu_items WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [id]
  );
  if (existing.length === 0) throw new NotFoundError('Menu item not found');

  await pool.execute(
    'UPDATE menu_items SET is_available = ? WHERE id = ?',
    [is_available ? 1 : 0, id]
  );

  const [rows] = await pool.execute(`${SELECT_MENU} WHERE m.id = ?`, [id]);
  return ok(res, rows[0]);
});

/**
 * DELETE /api/menu/:id  (admin)
 *
 * Soft delete: sets deleted_at = NOW() and is_available = 0. The row
 * physically remains so historical order_items that reference this
 * item still resolve the name/price via JOIN — but the item disappears
 * from /api/menu listings, /api/menu/:id lookups, and from any
 * subsequent order creation (assertMenuItem checks deleted_at).
 *
 * Unlike before, this works even when the item appears on past
 * orders. Order history stays intact.
 */
const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const [existing] = await pool.execute(
    'SELECT id FROM menu_items WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [id]
  );
  if (existing.length === 0) throw new NotFoundError('Menu item not found');

  await pool.execute(
    `UPDATE menu_items
     SET deleted_at = CURRENT_TIMESTAMP,
         is_available = 0
     WHERE id = ?`,
    [id]
  );
  return noContent(res);
});

module.exports = { list, getById, create, update, setAvailability, remove };
