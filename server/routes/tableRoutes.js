const express = require('express');
const router = express.Router();
const {
  createTable,
  updateTableStatus,
  updateTable,
  deleteTable,
} = require('../controllers/tableController');
const { authenticate, authorize } = require('../middleware/auth');

// Table management endpoints (admin only)
router.post('/', authenticate, authorize('restaurantAdmin'), createTable);
router.put('/:id/status', authenticate, authorize('restaurantAdmin'), updateTableStatus);
router.put('/:id', authenticate, authorize('restaurantAdmin'), updateTable);
router.delete('/:id', authenticate, authorize('restaurantAdmin'), deleteTable);

module.exports = router;
