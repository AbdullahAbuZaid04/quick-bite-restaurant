'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/userController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { updateUserByAdminSchema } = require('../validators/authValidators');

router.use(authenticate);

router.get('/', authorize('admin', 'manager'), ctrl.list);
router.get('/:id', ctrl.getById); // self or staff (checked inside controller)
router.patch(
  '/:id',
  authorize('admin'),
  validate(updateUserByAdminSchema),
  ctrl.update
);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
