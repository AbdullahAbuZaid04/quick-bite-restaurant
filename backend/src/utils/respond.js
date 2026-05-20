'use strict';

/**
 * Standardised JSON envelope so the frontend always knows what to expect.
 * Successful:
 *   { success: true, data: <payload>, meta?: {...} }
 * Failed:
 *   { success: false, error: { message, details? } }
 */
function ok(res, data, meta) {
  const body = { success: true, data };
  if (meta !== undefined) body.meta = meta;
  return res.json(body);
}

function created(res, data) {
  return res.status(201).json({ success: true, data });
}

function noContent(res) {
  return res.status(204).send();
}

function fail(res, statusCode, message, details) {
  const body = { success: false, error: { message } };
  if (details !== undefined && details !== null) body.error.details = details;
  return res.status(statusCode).json(body);
}

module.exports = { ok, created, noContent, fail };
