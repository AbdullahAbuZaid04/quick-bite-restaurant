'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin', 'manager'));

router.get('/dashboard', ctrl.stats);

module.exports = router;
