'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/menuController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createMenuItemSchema,
  updateMenuItemSchema,
  listMenuItemsQuerySchema,
  setAvailabilitySchema,
} = require('../validators/menuValidators');

// Public reads
router.get('/', validate(listMenuItemsQuerySchema, 'query'), ctrl.list);
router.get('/:id', ctrl.getById);

// Admin / manager writes
router.post(
  '/',
  authenticate,
  authorize('admin', 'manager'),
  validate(createMenuItemSchema),
  ctrl.create
);
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'manager'),
  validate(updateMenuItemSchema),
  ctrl.update
);
router.patch(
  '/:id/availability',
  authenticate,
  authorize('admin', 'manager'),
  validate(setAvailabilitySchema),
  ctrl.setAvailability
);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
