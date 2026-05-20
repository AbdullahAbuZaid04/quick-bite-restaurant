'use strict';

const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/respond');
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  ConflictError,
} = require('../utils/errors');

/**
 * Roles allowed to view/modify any order (vs only their own).
 */
const STAFF_ROLES = new Set(['admin', 'manager', 'courier']);

/**
 * Status machine.
 *
 *   pending -> confirmed | cancelled
 *   confirmed -> preparing | cancelled
 *   preparing -> out_for_delivery | cancelled
 *   out_for_delivery -> delivered
 *   delivered -> refunded
 *   cancelled / refunded -> (terminal)
 *
 * Customers can only cancel their own pending orders.
 */
const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
};

/**
 * Helper to fetch a fully-hydrated order (with items) by id.
 * `conn` lets the caller share a transaction.
 */
async function fetchOrder(orderId, conn = pool) {
  const [orderRows] = await conn.execute(
    `SELECT o.id, o.user_id, u.name AS user_name, u.email AS user_email,
            o.status, o.total_amount, o.delivery_address, o.notes,
            o.created_at, o.updated_at
     FROM orders o
     INNER JOIN users u ON u.id = o.user_id
     WHERE o.id = ? LIMIT 1`,
    [orderId]
  );
  if (orderRows.length === 0) return null;

  const [items] = await conn.execute(
    `SELECT oi.id, oi.menu_item_id, m.name AS menu_item_name,
            oi.quantity, oi.unit_price, oi.subtotal, oi.created_at
     FROM order_items oi
     INNER JOIN menu_items m ON m.id = oi.menu_item_id
     WHERE oi.order_id = ?
     ORDER BY oi.id ASC`,
    [orderId]
  );

  return { ...orderRows[0], items };
}

/**
 * POST /api/orders   (any authenticated user)
 *
 * Body:
 *   items: [{ menu_item_id, quantity }, ...]
 *   delivery_address: string
 *   notes?: string
 *
 * Pricing is taken from the DB at the time of order, never from
 * the client. The DB trigger fills subtotal & orders.total_amount
 * automatically.
 *
 * All-or-nothing: if any menu item is missing or unavailable, the
 * whole transaction rolls back.
 */
const create = asyncHandler(async (req, res) => {
  const { items, delivery_address, notes = null } = req.body;

  // Pre-flight: collapse duplicate menu_item_ids in the payload
  // (the order_items UNIQUE(order_id, menu_item_id) constraint
  // would otherwise blow up).
  const merged = new Map(); // menu_item_id -> quantity
  for (const it of items) {
    merged.set(it.menu_item_id, (merged.get(it.menu_item_id) || 0) + it.quantity);
  }
  const mergedItems = [...merged.entries()].map(([menu_item_id, quantity]) => ({
    menu_item_id,
    quantity,
  }));

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Lock the menu rows we care about so prices/availability can't
    // change mid-transaction. Note: mysql2 can't bind a list directly
    // into `IN (?)`, so build the placeholders manually.
    const ids = mergedItems.map((i) => i.menu_item_id);
    const placeholders = ids.map(() => '?').join(',');
    const [menuRows] = await conn.execute(
      `SELECT id, name, price, is_available
       FROM menu_items WHERE id IN (${placeholders})
       FOR UPDATE`,
      ids
    );

    const menuById = new Map(menuRows.map((r) => [r.id, r]));
    for (const it of mergedItems) {
      const m = menuById.get(it.menu_item_id);
      if (!m) {
        throw new BadRequestError(`Menu item ${it.menu_item_id} does not exist`);
      }
      if (!m.is_available) {
        throw new BadRequestError(`Menu item "${m.name}" is currently unavailable`);
      }
    }

    // Create the order header (total_amount starts at 0 and the
    // trigger will update it as items are inserted).
    const [orderResult] = await conn.execute(
      `INSERT INTO orders (user_id, status, total_amount, delivery_address, notes)
       VALUES (?, 'pending', 0, ?, ?)`,
      [req.user.id, delivery_address, notes]
    );
    const orderId = orderResult.insertId;

    // Insert order items. unit_price is read from the DB, not the client.
    for (const it of mergedItems) {
      const m = menuById.get(it.menu_item_id);
      await conn.execute(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, 0)`,
        [orderId, it.menu_item_id, it.quantity, m.price]
      );
    }

    await conn.commit();

    const order = await fetchOrder(orderId);
    return created(res, order);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

/**
 * GET /api/orders
 *   - Customers: returns their own orders.
 *   - Staff (admin/manager/courier): returns all orders, with optional
 *     ?user_id= and ?status= filters.
 */
const list = asyncHandler(async (req, res) => {
  const { status, user_id, limit, offset } = req.query;
  const lim = Number(limit) || 20;
  const off = Number(offset) || 0;

  const where = [];
  const params = [];

  if (!STAFF_ROLES.has(req.user.role)) {
    // Customers are always scoped to themselves.
    where.push('o.user_id = ?');
    params.push(req.user.id);
  } else if (user_id !== undefined) {
    where.push('o.user_id = ?');
    params.push(user_id);
  }
  if (status) {
    where.push('o.status = ?');
    params.push(status);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await pool.execute(
    `SELECT o.id, o.user_id, u.name AS user_name, u.email AS user_email,
            o.status, o.total_amount, o.delivery_address, o.notes,
            o.created_at, o.updated_at,
            (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS items_count
     FROM orders o
     INNER JOIN users u ON u.id = o.user_id
     ${whereSql}
     ORDER BY o.id DESC
     LIMIT ${lim} OFFSET ${off}`,
    params
  );

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM orders o ${whereSql}`,
    params
  );

  return ok(res, rows, { total: countRows[0].total, limit: lim, offset: off });
});

/**
 * GET /api/orders/:id
 * Customers can only fetch their own orders; staff can fetch any.
 */
const getById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const order = await fetchOrder(id);
  if (!order) throw new NotFoundError('Order not found');

  if (!STAFF_ROLES.has(req.user.role) && order.user_id !== req.user.id) {
    throw new ForbiddenError('You can only view your own orders');
  }
  return ok(res, order);
});

/**
 * PATCH /api/orders/:id/status   (admin / manager / courier)
 *
 * Couriers may only move 'preparing' -> 'out_for_delivery' -> 'delivered'.
 */
const updateStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const [rows] = await pool.execute(
    'SELECT id, user_id, status FROM orders WHERE id = ? LIMIT 1',
    [id]
  );
  if (rows.length === 0) throw new NotFoundError('Order not found');

  const current = rows[0].status;
  const allowed = ALLOWED_TRANSITIONS[current] || [];
  if (!allowed.includes(status)) {
    throw new ConflictError(
      `Invalid status transition: ${current} -> ${status}`,
      { allowed }
    );
  }

  // Couriers have a narrower lane than admins/managers.
  if (req.user.role === 'courier') {
    const courierAllowed = new Set(['out_for_delivery', 'delivered']);
    if (!courierAllowed.has(status)) {
      throw new ForbiddenError('Couriers may only mark orders as out_for_delivery or delivered');
    }
  }

  await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  const order = await fetchOrder(id);
  return ok(res, order);
});

/**
 * POST /api/orders/:id/cancel   (customer for own pending order, or staff)
 */
const cancel = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const [rows] = await pool.execute(
    'SELECT id, user_id, status FROM orders WHERE id = ? LIMIT 1',
    [id]
  );
  if (rows.length === 0) throw new NotFoundError('Order not found');
  const order = rows[0];

  const isOwner = order.user_id === req.user.id;
  const isStaff = STAFF_ROLES.has(req.user.role);
  if (!isOwner && !isStaff) {
    throw new ForbiddenError('You can only cancel your own orders');
  }

  // Customers can only cancel while still pending.
  if (!isStaff && order.status !== 'pending') {
    throw new ConflictError('Only pending orders can be cancelled by customers');
  }

  if (!ALLOWED_TRANSITIONS[order.status]?.includes('cancelled')) {
    throw new ConflictError(`Order in status '${order.status}' cannot be cancelled`);
  }

  await pool.execute("UPDATE orders SET status = 'cancelled' WHERE id = ?", [id]);
  const fresh = await fetchOrder(id);
  return ok(res, fresh);
});

module.exports = { create, list, getById, updateStatus, cancel, fetchOrder };
