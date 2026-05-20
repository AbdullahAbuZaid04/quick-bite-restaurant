'use strict';

const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
}).required();

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
}).required();

module.exports = { createCategorySchema, updateCategorySchema };
