'use strict';

/**
 * Generate a human-readable invoice number, e.g.:
 *   QB-20260511-000123
 *
 *   QB        => Quick Bite
 *   20260511  => issue date (YYYYMMDD)
 *   000123    => zero-padded order id
 */
function generateInvoiceNumber(orderId, date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const padded = String(orderId).padStart(6, '0');
  return `QB-${yyyy}${mm}${dd}-${padded}`;
}

module.exports = { generateInvoiceNumber };
