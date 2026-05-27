'use strict';

const Joi = require('joi');

const ROLES = ['customer', 'admin', 'manager', 'courier'];

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().lowercase().email().max(190).required(),
  password: Joi.string().min(8).max(128).required(),
  // Self-registration always defaults to "customer".
  // Admins create privileged users via /users (PATCH role).
}).required();

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(1).max(128).required(),
}).required();

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  password: Joi.string().min(8).max(128),
})
  .min(1)
  .required();

const updateUserByAdminSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  role: Joi.string().valid(...ROLES),
  password: Joi.string().min(8).max(128),
})
  .min(1)
  .required();

module.exports = {
  ROLES,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateUserByAdminSchema,
};
