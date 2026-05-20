# Weekly Project Progress Report — Draft

**Team Name:** Quick Bite
**Week Number:** Week 8 — Advanced Client-Side Features (AJAX) + Backend Bootstrap

**Team Members:**
- Abdullah Mohammed AbuZaid — 120211559
- Abdullah Ali Al-Hindawi — 120211863
- Abdalkareem Rajab Abo Younis — 120211877
- Hazem Mohamed Oukal — 120212771

**GitHub Repository:** https://github.com/AbdullahAbuZaid04/test-resturant.git

---

## Work completed this week

This week we bootstrapped the **Backend service** that the project
will rely on for the rest of the semester. The backend is a Node.js +
Express + MySQL service following a layered architecture
(routes → controllers → DB), with JWT-based authentication.

Specifically:

**Backend (initial release):**
   - MySQL schema for `users`, `categories`, `menu_items`, `orders`,
     `order_items`, `payments`, `invoices`, with triggers that
     auto-compute `subtotal` and `total_amount`.
   - REST API covering auth, menu CRUD, order placement with
     transactional integrity, payments, invoices, user management,
     and admin dashboard stats.
   - Security: bcrypt password hashing, JWT auth, helmet headers,
     CORS allow-list, login + global rate-limiting, parameterised SQL.
   - Wiring test (no DB needed) — 17 assertions, all pass.

## Features implemented

- Cart → Checkout flow that POSTs to `/api/orders`.
- Manage Menu CRUD wired to `/api/menu/*` and `/api/categories/*`.

## Problems encountered

- Coordinating the JSON response shape across many endpoints — initially
  every controller returned a different envelope and the frontend kept
  breaking.
- Validating user input twice (client and server) without duplicating
  the rules in two places.
- Handling MySQL foreign-key errors (e.g., deleting a category that still
  has menu items) cleanly instead of leaking raw `ER_ROW_IS_REFERENCED_2`
  to the user.

## Solutions applied

- Adopted a single response envelope: `{ success, data, meta }` or
  `{ success: false, error: { message, details? } }`. The frontend now
  has one place that unpacks responses.
- On the server, Joi schemas live in `src/validators/` and are wired in
  via a single `validate(schema)` middleware. The frontend reuses the
  same rules informally (e.g. min-length 8 for passwords) but treats
  the server as the source of truth.
- A centralised Express error handler translates known MySQL error codes
  (`ER_DUP_ENTRY`, `ER_NO_REFERENCED_ROW_2`, `ER_ROW_IS_REFERENCED_2`)
  into clean 4xx responses with friendly messages.

## Plan for next week

- Add per-item images (multer upload → `/api/uploads/menu/:id`).
- Implement server-side pagination & sorting on the orders list view.
- Hook the Track Order page up to live status updates (Server-Sent
  Events) instead of polling.
- Begin Phase 4: deployment to a VPS / Render / Railway, with a
  managed MySQL service.

## Questions for instructor

- For grading, would you like the database SQL dump committed to the
  repository, or only the schema?
- Are SSE/WebSocket-based live updates acceptable, or should we stick
  to polling for the demo?
