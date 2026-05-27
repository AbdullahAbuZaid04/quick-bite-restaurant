# Quick Bite — Backend API

Node.js + Express + MySQL backend for the **Quick Bite Restaurant Ordering System**
(Islamic University of Gaza — ECOM 5416, Programming for the World Wide Web).

This service powers everything the React frontend needs: authentication,
menu browsing, order placement, status tracking, payments, invoices, and an
admin dashboard.

---

## Tech stack

| Layer            | Choice                                  |
| ---------------- | --------------------------------------- |
| Runtime          | Node.js 18+ (tested on Node 22)         |
| Web framework    | Express 4                               |
| Database         | MySQL 8 (InnoDB, utf8mb4)               |
| Driver           | `mysql2/promise` connection pool        |
| Auth             | JSON Web Tokens (`jsonwebtoken`) + bcrypt |
| Validation       | Joi                                     |
| Security         | helmet, CORS allow-list, rate-limit     |

---

## Folder layout

```
backend/
├── database/
│   ├── food_ordering.sql      # schema + triggers
│   └── seed.sql               # sample categories + menu items
├── src/
│   ├── config/
│   │   ├── db.js              # MySQL connection pool
│   │   └── env.js             # validated env loader
│   ├── controllers/           # one file per resource
│   ├── middleware/            # auth, validate, errorHandler
│   ├── routes/                # one router per resource + index.js
│   ├── utils/                 # shared helpers (errors, jwt, ...)
│   ├── validators/            # Joi schemas
│   ├── app.js                 # Express app (middleware + routes)
│   └── server.js              # entry point (boot + graceful shutdown)
├── tests/
│   └── smoke.js               # zero-dependency wiring test (no DB needed)
├── .env.example
├── .gitignore
└── package.json
```

---

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your local values:

```bash
cp .env.example .env
```

At minimum you must set: `DB_PASSWORD` and `JWT_SECRET`.

### 3. Create the database

Using the MySQL CLI (or any client — Workbench, phpMyAdmin, DBeaver…):

```bash
mysql -u root -p < database/food_ordering.sql      # schema + triggers
mysql -u root -p < database/seed.sql               # sample data (optional)
```

### 4. Create the default admin

```bash
npm run db:init
```

This reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` (defaults shown in
`.env.example`) and inserts an `admin` user if one doesn't already exist.
**Change the default password immediately.**

### 5. Run the server

```bash
npm run dev      # nodemon, auto-restarts on save
# or
npm start
```

The API listens on `http://localhost:5000` by default. Quick check:

```bash
curl http://localhost:5000/api/health
# { "success": true, "data": { "status": "ok", ... } }
```

---

## Response envelope

Every JSON response follows the same shape so the frontend can rely on it:

```jsonc
// success
{ "success": true, "data": <payload>, "meta": { "total": 120 } }

// failure
{ "success": false, "error": { "message": "...", "details": [ ... ] } }
```

HTTP status codes follow REST conventions:
`200 OK`, `201 Created`, `204 No Content`,
`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`,
`404 Not Found`, `409 Conflict`, `429 Too Many Requests`, `500 Internal`.

---

## Authentication

All protected routes expect a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are issued by `POST /api/auth/register` and `POST /api/auth/login`.

Roles defined in the schema: `customer`, `admin`, `manager`, `courier`.
The frontend should treat the role as read-only and let the backend enforce
permissions.

---

## API reference

> Base URL: `/api`
> Auth column: `—` = public, `🔒` = any logged-in user,
> `👨‍💼` = admin/manager, `🛵` = courier, `🛡️` = admin only.

### Health

| Method | Path           | Auth | Notes                       |
| ------ | -------------- | ---- | --------------------------- |
| GET    | `/api/health`  | —    | Liveness probe.             |

### Auth

| Method | Path                    | Auth | Body                                              |
| ------ | ----------------------- | ---- | ------------------------------------------------- |
| POST   | `/api/auth/register`    | —    | `{ name, email, password }`                       |
| POST   | `/api/auth/login`       | —    | `{ email, password }`                             |
| GET    | `/api/auth/me`          | 🔒   | —                                                 |
| PATCH  | `/api/auth/me`          | 🔒   | `{ name?, password? }`                            |

### Categories

| Method | Path                       | Auth   | Body              |
| ------ | -------------------------- | ------ | ----------------- |
| GET    | `/api/categories`          | —      | —                 |
| GET    | `/api/categories/:id`      | —      | —                 |
| POST   | `/api/categories`          | 👨‍💼  | `{ name }`        |
| PUT    | `/api/categories/:id`      | 👨‍💼  | `{ name }`        |
| DELETE | `/api/categories/:id`      | 🛡️    | —                 |

### Menu items

| Method | Path                                  | Auth   | Body / Query                                                                                                |
| ------ | ------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| GET    | `/api/menu`                           | —      | `?category_id=&available=true&q=pizza&limit=50&offset=0`                                                    |
| GET    | `/api/menu/:id`                       | —      | —                                                                                                           |
| POST   | `/api/menu`                           | 👨‍💼  | `{ name, description?, price, category_id, prepare_time, image_url?, is_available? }`                       |
| PUT    | `/api/menu/:id`                       | 👨‍💼  | any subset of the above                                                                                     |
| PATCH  | `/api/menu/:id/availability`          | 👨‍💼  | `{ is_available: boolean }`                                                                                 |
| DELETE | `/api/menu/:id`                       | 🛡️    | (refused if the item appears on existing orders — flip availability instead)                                |

### Orders

| Method | Path                              | Auth        | Notes                                                                                       |
| ------ | --------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| POST   | `/api/orders`                     | 🔒          | `{ items: [{ menu_item_id, quantity }], delivery_address, notes? }` — prices come from DB.   |
| GET    | `/api/orders`                     | 🔒          | Customers see only their own; staff see all. `?status=&user_id=&limit=&offset=`             |
| GET    | `/api/orders/:id`                 | 🔒          | Customers can only fetch their own.                                                         |
| PATCH  | `/api/orders/:id/status`          | 👨‍💼 / 🛵 | `{ status }` — must follow the state-machine in `orderController.js`.                       |
| POST   | `/api/orders/:id/cancel`          | 🔒          | Customers may cancel only while `pending`. Staff may cancel any non-terminal status.        |
| GET    | `/api/orders/:orderId/payments`   | 🔒          | Customers' own only.                                                                        |
| GET    | `/api/orders/:orderId/invoice`    | 🔒          | Customers' own only.                                                                        |

**Order status machine**

```
pending ─▶ confirmed ─▶ preparing ─▶ out_for_delivery ─▶ delivered ─▶ refunded
   │           │            │
   ▼           ▼            ▼
cancelled  cancelled    cancelled
```

### Payments

| Method | Path                  | Auth   | Body                                                              |
| ------ | --------------------- | ------ | ----------------------------------------------------------------- |
| POST   | `/api/payments`       | 🔒     | `{ order_id, amount, method, transaction_reference? }`            |
| GET    | `/api/payments/:id`   | 🔒     | Customers' own only.                                              |
| PATCH  | `/api/payments/:id`   | 👨‍💼  | `{ status, transaction_reference? }`                              |

When a payment transitions to `paid`:
1. The order moves from `pending` → `confirmed` (if applicable).
2. An invoice is auto-generated if one doesn't already exist.
3. `paid_at` is set to `CURRENT_TIMESTAMP`.

### Invoices

| Method | Path                        | Auth   | Notes                                          |
| ------ | --------------------------- | ------ | ---------------------------------------------- |
| GET    | `/api/invoices`             | 👨‍💼  | All invoices.                                  |
| POST   | `/api/invoices`             | 👨‍💼  | `{ order_id }` — manual creation.              |
| GET    | `/api/invoices/:id`         | 🔒     | Customers' own only.                           |

### Users (admin user-management)

| Method | Path                  | Auth   | Body / Notes                                       |
| ------ | --------------------- | ------ | -------------------------------------------------- |
| GET    | `/api/users`          | 👨‍💼  | `?role=&q=&limit=&offset=`                         |
| GET    | `/api/users/:id`      | 🔒     | Self or staff.                                     |
| PATCH  | `/api/users/:id`      | 🛡️    | `{ name?, role?, password? }`                      |
| DELETE | `/api/users/:id`      | 🛡️    | (refused if user has orders).                      |

### Admin dashboard

| Method | Path                       | Auth   | Notes                                                       |
| ------ | -------------------------- | ------ | ----------------------------------------------------------- |
| GET    | `/api/admin/dashboard`     | 👨‍💼  | Counters, orders-by-status, today/total revenue, recent.   |

---

## Example: end-to-end flow

```bash
BASE=http://localhost:5000/api

# 1) Register a customer
curl -s -X POST $BASE/auth/register \
  -H 'content-type: application/json' \
  -d '{"name":"Alice","email":"alice@x.com","password":"Aa12345678!"}'

# 2) Login
TOKEN=$(curl -s -X POST $BASE/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"alice@x.com","password":"Aa12345678!"}' | jq -r .data.token)

# 3) Browse menu
curl -s $BASE/menu | jq

# 4) Place an order
curl -s -X POST $BASE/orders \
  -H "authorization: Bearer $TOKEN" \
  -H 'content-type: application/json' \
  -d '{
    "items":[{"menu_item_id":1,"quantity":2},{"menu_item_id":7,"quantity":1}],
    "delivery_address":"42 Omar Mukhtar St, Gaza",
    "notes":"Extra napkins please"
  }'

# 5) Pay
curl -s -X POST $BASE/payments \
  -H "authorization: Bearer $TOKEN" \
  -H 'content-type: application/json' \
  -d '{"order_id":1,"amount":16.50,"method":"cash"}'

# 6) Track
curl -s $BASE/orders/1 -H "authorization: Bearer $TOKEN" | jq
```

---

## Testing

```bash
npm test     # runs tests/smoke.js (no MySQL required)
```

The smoke test stubs `mysql2/promise` so the full middleware pipeline
(routing → validation → auth → controllers → error handler) runs in-process,
exercising 17 assertions across registration, login, /me, role-gating,
404 handling, CORS preflight, and validation errors.

---

## Security notes

- Passwords are never stored or returned in plaintext — only bcrypt hashes
  (`BCRYPT_SALT_ROUNDS=10` by default).
- All SQL goes through parameterized `?` placeholders. `multipleStatements`
  is disabled on the pool to harden against injection.
- JWT secret must be a long random string in production — see
  `.env.example`.
- Login is rate-limited to 20 attempts per 15 minutes per IP.
- Global limiter caps API traffic at 300 req/min per IP.
- `helmet()` is enabled for sensible default security headers.
- CORS uses an allow-list from `CORS_ORIGIN` (comma-separated).

---

## Database design

See `database/food_ordering.sql` for the canonical schema. The ERD lives in
`docs/ERD.jpeg`. Tables:

- `users`  — accounts and roles
- `categories`, `menu_items`  — what's for sale
- `orders`, `order_items`  — what was ordered, with auto-computed
  `subtotal` / `total_amount` via triggers
- `payments`, `invoices`  — money and receipts

Pricing for an order item is captured at the time of order (`unit_price`),
so subsequent menu-item price changes don't retroactively alter past orders.

---

## Roadmap / nice-to-haves

- Image upload for `menu_items.image_url` (multer + S3 or local disk).
- Real-time order status updates over WebSocket / SSE.
- Refund flow that ties back to the payment gateway.
- Swagger / OpenAPI document generated from the validators.

---

**Team — Quick Bite**
Abdullah Mohammed AbuZaid · Abdullah Ali Al-Hindawi ·
Abdalkareem Rajab Abo Younis · Hazem Mohamed Oukal
