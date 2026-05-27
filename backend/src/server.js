'use strict';

const app = require('./app');
const config = require('./config/env');
const { assertConnection, pool } = require('./config/db');

async function start() {
  try {
    await assertConnection();
    // eslint-disable-next-line no-console
    console.log(`[db] connected to MySQL at ${config.db.host}:${config.db.port}/${config.db.name}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[db] failed to connect:', err.message);
    process.exit(1);
  }

  const server = app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(
      `[server] Quick Bite API listening on http://localhost:${config.port} (${config.env})`
    );
  });

  // Graceful shutdown
  function shutdown(signal) {
    // eslint-disable-next-line no-console
    console.log(`\n[server] received ${signal}, shutting down...`);
    server.close(async () => {
      try {
        await pool.end();
        // eslint-disable-next-line no-console
        console.log('[db] pool closed. bye.');
        process.exit(0);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[db] error while closing pool:', err);
        process.exit(1);
      }
    });

    // Force-exit after 10s if hung.
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.error('[server] forced shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.error('[server] unhandledRejection:', reason);
  });
}

start();
