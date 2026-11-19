const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalytics } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/dashboard', authenticate, authorize('restaurantAdmin'), getDashboardStats);
router.get('/analytics', authenticate, authorize('restaurantAdmin'), getAnalytics);

module.exports = router;
