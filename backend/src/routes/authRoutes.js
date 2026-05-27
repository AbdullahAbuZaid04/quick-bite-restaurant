'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} = require('../validators/authValidators');

// Public
router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);

// Authenticated
router.get('/me', authenticate, ctrl.me);
router.patch('/me', authenticate, validate(updateProfileSchema), ctrl.updateMe);

module.exports = router;
