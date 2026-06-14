'use strict';

const Joi = require('joi');

const createMenuItemSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  description: Joi.string().trim().allow('', null).max(2000),
  price: Joi.number().precision(2).min(0).required(),
  category_id: Joi.number().integer().positive().required(),
  prepare_time: Joi.number().integer().min(0).max(600).required(), // in minutes
  image_url: Joi.string().trim().uri().max(500).allow('', null),
  is_available: Joi.boolean(),
}).required();

const updateMenuItemSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150),
  description: Joi.string().trim().allow('', null).max(2000),
  price: Joi.number().precision(2).min(0),
  category_id: Joi.number().integer().positive(),
  prepare_time: Joi.number().integer().min(0).max(600),
  image_url: Joi.string().trim().uri().max(500).allow('', null),
  is_available: Joi.boolean(),
})
  .min(1)
  .required();

const listMenuItemsQuerySchema = Joi.object({
  category_id: Joi.number().integer().positive(),
  available: Joi.boolean(),
  q: Joi.string().trim().max(150),
  limit: Joi.number().integer().min(1).max(100).default(50),
  offset: Joi.number().integer().min(0).default(0),
});

const setAvailabilitySchema = Joi.object({
  is_available: Joi.boolean().required(),
}).required();

module.exports = {
  createMenuItemSchema,
  updateMenuItemSchema,
  listMenuItemsQuerySchema,
  setAvailabilitySchema,
};
