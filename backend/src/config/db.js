'use strict';

const mysql = require('mysql2/promise');
const config = require('./env');

/**
 * MySQL connection pool (promise-based).
 *
 * Using a pool is preferred over single connections for web servers:
 *  - automatic reconnection
 *  - concurrency-safe
 *  - bounded by DB_CONNECTION_LIMIT
 */
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: config.db.connectionLimit,
  queueLimit: 0,
  charset: 'utf8mb4',
  // We always use parameterized queries; nothing in this code path
  // ever interpolates raw user input into SQL.
  multipleStatements: false,
  dateStrings: true, // return DATE/DATETIME as strings (easier for JSON)
});

/**
 * Quick health check used at startup.
 */
async function assertConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}

module.exports = { pool, assertConnection };
