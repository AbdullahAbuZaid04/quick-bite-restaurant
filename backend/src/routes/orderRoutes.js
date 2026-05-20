'use strict';

const router = require('express').Router();
const orderCtrl = require('../controllers/orderController');
const paymentCtrl = require('../controllers/paymentController');
const invoiceCtrl = require('../controllers/invoiceController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createOrderSchema,
  updateOrderStatusSchema,
  listOrdersQuerySchema,
} = require('../validators/orderValidators');

// All order endpoints require auth.
router.use(authenticate);

router.get('/', validate(listOrdersQuerySchema, 'query'), orderCtrl.list);
router.post('/', validate(createOrderSchema), orderCtrl.create);
router.get('/:id', orderCtrl.getById);

router.patch(
  '/:id/status',
  authorize('admin', 'manager', 'courier'),
  validate(updateOrderStatusSchema),
  orderCtrl.updateStatus
);

router.post('/:id/cancel', orderCtrl.cancel);

// Nested resources
router.get('/:orderId/payments', paymentCtrl.listForOrder);
router.get('/:orderId/invoice', invoiceCtrl.getForOrder);

module.exports = router;
