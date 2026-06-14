'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/categoryController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createCategorySchema,
  updateCategorySchema,
} = require('../validators/categoryValidators');

// Public reads
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);

// Admin / manager writes
router.post(
  '/',
  authenticate,
  authorize('admin', 'manager'),
  validate(createCategorySchema),
  ctrl.create
);
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'manager'),
  validate(updateCategorySchema),
  ctrl.update
);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
