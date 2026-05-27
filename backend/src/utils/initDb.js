'use strict';

/**
 * One-off seeding script. Run with:
 *
 *   npm run db:init
 *
 * Assumes `food_ordering.sql` has already been executed
 * (the schema must exist). It only:
 *
 *   - creates the default admin user if one doesn't already exist
 *   - is safe to re-run (idempotent)
 */

const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const config = require('../config/env');

async function run() {
  try {
    // Make sure the schema is reachable.
    await pool.query('SELECT 1');

    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [config.admin.email]
    );

    if (rows.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`[seed] admin already exists: ${config.admin.email} (id=${rows[0].id})`);
    } else {
      const hash = await bcrypt.hash(config.admin.password, config.bcrypt.saltRounds);
      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES (?, ?, ?, 'admin')`,
        [config.admin.name, config.admin.email, hash]
      );
      // eslint-disable-next-line no-console
      console.log(`[seed] admin created: ${config.admin.email} (id=${result.insertId})`);
      // eslint-disable-next-line no-console
      console.log(`[seed] default password: ${config.admin.password}  <-- change this immediately!`);
    }

    // eslint-disable-next-line no-console
    console.log('[seed] done.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[seed] failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end().catch(() => {});
  }
}

run();
