'use strict';

const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/respond');

/**
 * GET /api/admin/dashboard   (admin / manager)
 *
 * Returns a small bundle of counters and recent activity that the
 * frontend dashboard can render without making 6 separate calls.
 */
const stats = asyncHandler(async (_req, res) => {
  // Run all summary queries in parallel.
  const [
    [{ total_users }],
    [{ total_customers }],
    [{ total_menu_items }],
    [{ total_available_items }],
    [{ total_categories }],
    [{ total_orders }],
    statusBreakdown,
    [{ revenue_today }],
    [{ revenue_total }],
    recentOrders,
  ] = await Promise.all([
    pool.execute('SELECT COUNT(*) AS total_users FROM users').then((r) => r[0]),
    pool
      .execute("SELECT COUNT(*) AS total_customers FROM users WHERE role = 'customer'")
      .then((r) => r[0]),
    pool.execute('SELECT COUNT(*) AS total_menu_items FROM menu_items').then((r) => r[0]),
    pool
      .execute('SELECT COUNT(*) AS total_available_items FROM menu_items WHERE is_available = 1')
      .then((r) => r[0]),
    pool.execute('SELECT COUNT(*) AS total_categories FROM categories').then((r) => r[0]),
    pool.execute('SELECT COUNT(*) AS total_orders FROM orders').then((r) => r[0]),

    // Orders grouped by status
    pool
      .execute(
        `SELECT status, COUNT(*) AS count
         FROM orders
         GROUP BY status`
      )
      .then((r) => r[0]),

    // Today's revenue (paid only)
    pool
      .execute(
        `SELECT COALESCE(SUM(amount), 0) AS revenue_today
         FROM payments
         WHERE status = 'paid'
           AND DATE(paid_at) = CURDATE()`
      )
      .then((r) => r[0]),

    // All-time revenue (paid only)
    pool
      .execute(
        `SELECT COALESCE(SUM(amount), 0) AS revenue_total
         FROM payments
         WHERE status = 'paid'`
      )
      .then((r) => r[0]),

    // 5 most recent orders
    pool
      .execute(
        `SELECT o.id, o.user_id, u.name AS user_name, o.status,
                o.total_amount, o.created_at
         FROM orders o
         INNER JOIN users u ON u.id = o.user_id
         ORDER BY o.id DESC
         LIMIT 5`
      )
      .then((r) => r[0]),
  ]);

  return ok(res, {
    counters: {
      total_users,
      total_customers,
      total_categories,
      total_menu_items,
      total_available_items,
      total_orders,
    },
    orders_by_status: statusBreakdown,
    revenue: {
      today: Number(revenue_today),
      total: Number(revenue_total),
    },
    recent_orders: recentOrders,
  });
});

module.exports = { stats };
