/* eslint-disable no-console */
'use strict';

/**
 * Smoke test: verify routing, validation, auth, and error pipeline
 * end-to-end without needing a real MySQL.
 *
 * We stub `mysql2/promise` via Node's require cache before the app
 * is loaded, then make in-process HTTP-style requests using express's
 * own callback signature via `http.createServer(app)`.
 */

process.env.JWT_SECRET = 'smoke_test_secret_long_enough_string';
process.env.NODE_ENV = 'test';
process.env.PORT = '0';

// Lightweight mock of the parts of mysql2/promise that we use.
// We pre-populate require.cache with a fake mysql2/promise module so
// that any later `require('mysql2/promise')` returns our stub.
const path = require('path');
const mysql2Path = require.resolve('mysql2/promise');

const fakePool = {
  _users: [], // [{id, name, email, password_hash, role, created_at, updated_at}]
  async execute(sql, params = []) {
    // Strip whitespace/newlines so we can write simple regex matchers below.
    const s = sql.replace(/\s+/g, ' ').trim();
    // We deliberately keep this tiny: just enough to exercise auth.
    if (/^SELECT id FROM users WHERE email = \?/i.test(s)) {
      const email = params[0];
      const hit = this._users.find((u) => u.email === email);
      return [hit ? [{ id: hit.id }] : []];
    }
    if (/^SELECT .* FROM users WHERE email = \? LIMIT 1/i.test(s)) {
      const email = params[0];
      const hit = this._users.find((u) => u.email === email);
      return [hit ? [hit] : []];
    }
    if (/^SELECT .* FROM users WHERE id = \?/i.test(s)) {
      const id = params[0];
      const hit = this._users.find((u) => u.id === id);
      return [hit ? [hit] : []];
    }
    if (/^INSERT INTO users/i.test(s)) {
      const id = this._users.length + 1;
      const [name, email, password_hash] = params;
      this._users.push({
        id,
        name,
        email,
        password_hash,
        role: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return [{ insertId: id }];
    }
    if (/^SELECT 1$/i.test(s)) return [[{ '1': 1 }]];

    // Anything else: empty result. Forces 404 paths in handlers that
    // we are not exercising here.
    return [[]];
  },
  async query(sql) {
    return this.execute(sql, []);
  },
  async getConnection() {
    return {
      execute: this.execute.bind(this),
      query: this.query.bind(this),
      beginTransaction: async () => {},
      commit: async () => {},
      rollback: async () => {},
      release: () => {},
      ping: async () => {},
    };
  },
  async end() {},
};

const Module = require('module');

// Inject our stub before the app pulls in `mysql2/promise`.
require.cache[mysql2Path] = {
  id: mysql2Path,
  filename: mysql2Path,
  loaded: true,
  exports: {
    createPool: () => fakePool,
  },
};

const app = require('../src/app');
const http = require('http');

function request(server, method, path, { headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        host: '127.0.0.1',
        port: server.address().port,
        method,
        path,
        headers: {
          'content-type': 'application/json',
          ...(data ? { 'content-length': Buffer.byteLength(data) } : {}),
          ...headers,
        },
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(buf);
          } catch {
            /* not json */
          }
          resolve({ status: res.statusCode, body: parsed, raw: buf });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function assert(cond, msg) {
  if (!cond) {
    console.error('  ❌', msg);
    process.exitCode = 1;
  } else {
    console.log('  ✅', msg);
  }
}

async function main() {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  console.log(`\n--- smoke test against http://127.0.0.1:${server.address().port} ---\n`);

  // 1. Root
  let res = await request(server, 'GET', '/');
  assert(res.status === 200, 'GET / -> 200');
  assert(res.body && res.body.data && res.body.data.name === 'Quick Bite API', 'GET / returns API info');

  // 2. Health
  res = await request(server, 'GET', '/api/health');
  assert(res.status === 200, 'GET /api/health -> 200');

  // 3. Unknown route -> 404
  res = await request(server, 'GET', '/api/does-not-exist');
  assert(res.status === 404, 'GET /api/does-not-exist -> 404');
  assert(res.body && res.body.success === false, '404 has success=false envelope');

  // 4. Register with bad body -> 400
  res = await request(server, 'POST', '/api/auth/register', { body: { email: 'not-an-email' } });
  assert(res.status === 400, 'POST /api/auth/register (bad body) -> 400');
  assert(
    res.body && Array.isArray(res.body.error && res.body.error.details),
    'validation error includes details[]'
  );

  // 5. Register valid -> 201, returns token
  res = await request(server, 'POST', '/api/auth/register', {
    body: { name: 'Alice', email: 'alice@example.com', password: 'Aa12345678!' },
  });
  assert(res.status === 201, 'POST /api/auth/register (valid) -> 201');
  assert(res.body && res.body.data && res.body.data.token, 'register returns a JWT token');
  assert(res.body && res.body.data.user && res.body.data.user.role === 'customer', 'new user is a customer');
  const token = res.body.data.token;

  // 6. Login with wrong password -> 401
  res = await request(server, 'POST', '/api/auth/login', {
    body: { email: 'alice@example.com', password: 'wrong-password' },
  });
  assert(res.status === 401, 'login with wrong password -> 401');

  // 7. Login with correct creds -> 200
  res = await request(server, 'POST', '/api/auth/login', {
    body: { email: 'alice@example.com', password: 'Aa12345678!' },
  });
  assert(res.status === 200, 'login with correct password -> 200');

  // 8. /me without token -> 401
  res = await request(server, 'GET', '/api/auth/me');
  assert(res.status === 401, 'GET /api/auth/me without token -> 401');

  // 9. /me with token -> 200
  res = await request(server, 'GET', '/api/auth/me', {
    headers: { authorization: `Bearer ${token}` },
  });
  assert(res.status === 200, 'GET /api/auth/me with token -> 200');
  assert(res.body && res.body.data && res.body.data.user.email === 'alice@example.com', '/me returns Alice');

  // 10. Hitting an admin-only route as a customer -> 403
  res = await request(server, 'POST', '/api/categories', {
    headers: { authorization: `Bearer ${token}` },
    body: { name: 'Bakery' },
  });
  assert(res.status === 403, 'customer trying to create category -> 403');

  // 11. CORS preflight should return CORS headers
  res = await request(server, 'OPTIONS', '/api/health', {
    headers: { origin: 'http://localhost:3000', 'access-control-request-method': 'GET' },
  });
  assert(res.status === 204 || res.status === 200, 'CORS preflight responds');

  server.close();
  console.log('\n--- smoke test complete ---\n');
}

main().catch((err) => {
  console.error('smoke test crashed:', err);
  process.exit(1);
});
