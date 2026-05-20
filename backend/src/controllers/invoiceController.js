'use strict';

const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/respond');
const {
  NotFoundError,
  ForbiddenError,
  ConflictError,
} = require('../utils/errors');
const { generateInvoiceNumber } = require('../utils/invoiceNumber');

const STAFF_ROLES = new Set(['admin', 'manager']);

/**
 * Hydrated invoice = invoice row + order summary + line items.
 * This is what the frontend renders on the receipt/track-order screen.
 */
async function fetchInvoice(invoiceId, conn = pool) {
  const [invRows] = await conn.execute(
    `SELECT i.id, i.order_id, i.invoice_number, i.total_amount,
            i.issued_at, i.created_at,
            o.user_id, o.status AS order_status,
            o.delivery_address, o.notes,
            u.name AS user_name, u.email AS user_email
     FROM invoices i
     INNER JOIN orders o ON o.id = i.order_id
     INNER JOIN users u ON u.id = o.user_id
     WHERE i.id = ? LIMIT 1`,
    [invoiceId]
  );
  if (invRows.length === 0) return null;

  const inv = invRows[0];
  const [items] = await conn.execute(
    `SELECT oi.id, oi.menu_item_id, m.name AS menu_item_name,
            oi.quantity, oi.unit_price, oi.subtotal
     FROM order_items oi
     INNER JOIN menu_items m ON m.id = oi.menu_item_id
     WHERE oi.order_id = ?
     ORDER BY oi.id ASC`,
    [inv.order_id]
  );

  return { ...inv, items };
}

/**
 * POST /api/invoices  (admin / manager)
 *
 * Body: { order_id }
 *
 * Most of the time invoices are auto-created when a payment turns
 * 'paid'; this manual endpoint exists for admin overrides.
 */
const create = asyncHandler(async (req, res) => {
  const orderId = Number(req.body.order_id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    throw new NotFoundError('Order not found');
  }

  const [orderRows] = await pool.execute(
    'SELECT id, total_amount FROM orders WHERE id = ? LIMIT 1',
    [orderId]
  );
  if (orderRows.length === 0) throw new NotFoundError('Order not found');

  const [dup] = await pool.execute(
    'SELECT id FROM invoices WHERE order_id = ? LIMIT 1',
    [orderId]
  );
  if (dup.length > 0) {
    throw new ConflictError('An invoice already exists for this order');
  }

  const invoiceNumber = generateInvoiceNumber(orderId);
  const [result] = await pool.execute(
    `INSERT INTO invoices (order_id, invoice_number, total_amount)
     VALUES (?, ?, ?)`,
    [orderId, invoiceNumber, orderRows[0].total_amount]
  );

  const invoice = await fetchInvoice(result.insertId);
  return created(res, invoice);
});

/**
 * GET /api/invoices/:id
 * Customers can only fetch invoices belonging to their own orders.
 */
const getById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const invoice = await fetchInvoice(id);
  if (!invoice) throw new NotFoundError('Invoice not found');

  if (!STAFF_ROLES.has(req.user.role) && invoice.user_id !== req.user.id) {
    throw new ForbiddenError('You can only view your own invoices');
  }
  return ok(res, invoice);
});

/**
 * GET /api/orders/:orderId/invoice
 */
const getForOrder = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.orderId);

  const [orderRows] = await pool.execute(
    'SELECT id, user_id FROM orders WHERE id = ? LIMIT 1',
    [orderId]
  );
  if (orderRows.length === 0) throw new NotFoundError('Order not found');

  if (!STAFF_ROLES.has(req.user.role) && orderRows[0].user_id !== req.user.id) {
    throw new ForbiddenError('You can only view your own invoices');
  }

  const [invRows] = await pool.execute(
    'SELECT id FROM invoices WHERE order_id = ? LIMIT 1',
    [orderId]
  );
  if (invRows.length === 0) throw new NotFoundError('Invoice not found for this order');

  const invoice = await fetchInvoice(invRows[0].id);
  return ok(res, invoice);
});

/**
 * GET /api/invoices  (admin / manager)
 */
const list = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 50;
  const offset = Number(req.query.offset) || 0;

  const [rows] = await pool.execute(
    `SELECT i.id, i.order_id, i.invoice_number, i.total_amount,
            i.issued_at, i.created_at,
            u.name AS user_name, u.email AS user_email
     FROM invoices i
     INNER JOIN orders o ON o.id = i.order_id
     INNER JOIN users u ON u.id = o.user_id
     ORDER BY i.id DESC
     LIMIT ${limit} OFFSET ${offset}`
  );
  const [[{ total }]] = await pool.execute('SELECT COUNT(*) AS total FROM invoices');
  return ok(res, rows, { total, limit, offset });
});

module.exports = { create, getById, getForOrder, list };
