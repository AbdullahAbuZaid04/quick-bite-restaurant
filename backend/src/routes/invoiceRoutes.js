'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/invoiceController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', authorize('admin', 'manager'), ctrl.list);
router.post('/', authorize('admin', 'manager'), ctrl.create);
router.get('/:id', ctrl.getById);

module.exports = router;
