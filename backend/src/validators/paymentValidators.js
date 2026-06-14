'use strict';

const Joi = require('joi');

const PAYMENT_METHODS = ['cash', 'wallet', 'bank_transfer', 'card'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

const createPaymentSchema = Joi.object({
  order_id: Joi.number().integer().positive().required(),
  amount: Joi.number().precision(2).positive().required(),
  method: Joi.string()
    .valid(...PAYMENT_METHODS)
    .required(),
  // status / transaction_reference are admin-only when explicitly provided;
  // by default new payments start in 'pending' and admins move them to 'paid'.
  transaction_reference: Joi.string().trim().max(150),
}).required();

const updatePaymentStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...PAYMENT_STATUSES)
    .required(),
  transaction_reference: Joi.string().trim().max(150),
}).required();

module.exports = {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  createPaymentSchema,
  updatePaymentStatusSchema,
};
