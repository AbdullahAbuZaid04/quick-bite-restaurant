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
const { generateInvoiceNumber } = require('../utils/invoiceNumber');

const STAFF_ROLES = new Set(['admin', 'manager']);

/**
 * Helper: load an order with the caller's permission check applied.
 */
async function loadOrderForCaller(orderId, user, conn = pool) {
  const [rows] = await conn.execute(
    'SELECT id, user_id, status, total_amount FROM orders WHERE id = ? LIMIT 1',
    [orderId]
  );
  if (rows.length === 0) throw new NotFoundError('Order not found');

  const order = rows[0];
  const isOwner = order.user_id === user.id;
  const isStaff = STAFF_ROLES.has(user.role);
  if (!isOwner && !isStaff) {
    throw new ForbiddenError('You can only access payments for your own orders');
  }
  return order;
}

/**
 * POST /api/payments
 *
 * Body:
 *   order_id, amount, method, transaction_reference?
 *
 * Customers create their own payments (e.g. cash on delivery starts
 * 'pending'). Staff can update status later via PATCH.
 *
 * Side-effect: when a payment turns 'paid' and the order is still
 * 'pending', we auto-confirm the order and auto-generate the invoice.
 */
const create = asyncHandler(async (req, res) => {
  const { order_id, amount, method, transaction_reference = null } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const order = await loadOrderForCaller(order_id, req.user, conn);

    if (order.status === 'cancelled' || order.status === 'refunded') {
      throw new ConflictError(`Cannot pay for an order in status '${order.status}'`);
    }

    // Sanity: payment amount should match the order total. We allow
    // a 1 cent tolerance for floating-point quirks.
    const total = Number(order.total_amount);
    if (Math.abs(Number(amount) - total) > 0.01) {
      throw new BadRequestError(
        `Payment amount (${amount}) does not match order total (${total})`
      );
    }

    const [result] = await conn.execute(
      `INSERT INTO payments
         (order_id, amount, method, status, transaction_reference)
       VALUES (?, ?, ?, 'pending', ?)`,
      [order_id, amount, method, transaction_reference]
    );

    await conn.commit();

    const [rows] = await pool.execute(
      `SELECT id, order_id, amount, method, status,
              transaction_reference, paid_at, created_at
       FROM payments WHERE id = ?`,
      [result.insertId]
    );
    return created(res, rows[0]);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

/**
 * PATCH /api/payments/:id   (admin / manager)
 *
 * Updates payment status, sets paid_at when status flips to 'paid',
 * auto-confirms the order, and auto-generates the invoice on first
 * successful payment.
 */
const updateStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { status, transaction_reference } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [paymentRows] = await conn.execute(
      'SELECT id, order_id, status FROM payments WHERE id = ? LIMIT 1 FOR UPDATE',
      [id]
    );
    if (paymentRows.length === 0) throw new NotFoundError('Payment not found');

    const payment = paymentRows[0];
    const wasPaid = payment.status === 'paid';

    const fields = ['status = ?'];
    const params = [status];
    if (status === 'paid' && !wasPaid) {
      fields.push('paid_at = CURRENT_TIMESTAMP');
    }
    if (transaction_reference !== undefined) {
      fields.push('transaction_reference = ?');
      params.push(transaction_reference);
    }
    params.push(id);

    await conn.execute(
      `UPDATE payments SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    // Side-effects on transition to 'paid'
    if (status === 'paid' && !wasPaid) {
      // 1) Auto-confirm pending orders.
      await conn.execute(
        `UPDATE orders SET status = 'confirmed'
         WHERE id = ? AND status = 'pending'`,
        [payment.order_id]
      );

      // 2) Auto-generate invoice if one doesn't yet exist.
      const [inv] = await conn.execute(
        'SELECT id FROM invoices WHERE order_id = ? LIMIT 1',
        [payment.order_id]
      );
      if (inv.length === 0) {
        const [orderTotalRows] = await conn.execute(
          'SELECT total_amount FROM orders WHERE id = ?',
          [payment.order_id]
        );
        const invoiceNumber = generateInvoiceNumber(payment.order_id);
        await conn.execute(
          `INSERT INTO invoices (order_id, invoice_number, total_amount)
           VALUES (?, ?, ?)`,
          [payment.order_id, invoiceNumber, orderTotalRows[0].total_amount]
        );
      }
    }

    await conn.commit();

    const [rows] = await pool.execute(
      `SELECT id, order_id, amount, method, status,
              transaction_reference, paid_at, created_at
       FROM payments WHERE id = ?`,
      [id]
    );
    return ok(res, rows[0]);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

/**
 * GET /api/payments/:id
 * Customers may view payments only for orders they own.
 */
const getById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const [rows] = await pool.execute(
    `SELECT p.id, p.order_id, p.amount, p.method, p.status,
            p.transaction_reference, p.paid_at, p.created_at,
            o.user_id AS order_user_id
     FROM payments p
     INNER JOIN orders o ON o.id = p.order_id
     WHERE p.id = ? LIMIT 1`,
    [id]
  );
  if (rows.length === 0) throw new NotFoundError('Payment not found');

  const isOwner = rows[0].order_user_id === req.user.id;
  if (!isOwner && !STAFF_ROLES.has(req.user.role)) {
    throw new ForbiddenError('You can only view your own payments');
  }

  const { order_user_id, ...payment } = rows[0];
  return ok(res, payment);
});

/**
 * GET /api/orders/:orderId/payments
 */
const listForOrder = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.orderId);
  await loadOrderForCaller(orderId, req.user);

  const [rows] = await pool.execute(
    `SELECT id, order_id, amount, method, status,
            transaction_reference, paid_at, created_at
     FROM payments
     WHERE order_id = ?
     ORDER BY id DESC`,
    [orderId]
  );
  return ok(res, rows);
});

module.exports = { create, updateStatus, getById, listForOrder };
