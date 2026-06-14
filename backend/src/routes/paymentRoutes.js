'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/paymentController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createPaymentSchema,
  updatePaymentStatusSchema,
} = require('../validators/paymentValidators');

router.use(authenticate);

router.post('/', validate(createPaymentSchema), ctrl.create);
router.get('/:id', ctrl.getById);
router.patch(
  '/:id',
  authorize('admin', 'manager'),
  validate(updatePaymentStatusSchema),
  ctrl.updateStatus
);

module.exports = router;
