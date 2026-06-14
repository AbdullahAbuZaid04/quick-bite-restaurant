'use strict';

const Joi = require('joi');

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'refunded',
];

const orderItemSchema = Joi.object({
  menu_item_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).max(100).required(),
});

const createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required(),
  delivery_address: Joi.string().trim().min(5).max(255).required(),
  notes: Joi.string().trim().allow('', null).max(1000),
}).required();

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...ORDER_STATUSES)
    .required(),
}).required();

const listOrdersQuerySchema = Joi.object({
  status: Joi.string().valid(...ORDER_STATUSES),
  user_id: Joi.number().integer().positive(), // admin/manager use only
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
});

module.exports = {
  ORDER_STATUSES,
  createOrderSchema,
  updateOrderStatusSchema,
  listOrdersQuerySchema,
};
