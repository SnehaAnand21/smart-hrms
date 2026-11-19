const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantTables,
  createRestaurant,
  updateRestaurant,
} = require('../controllers/restaurantController');
const { authenticate, authorize, verifyRestaurantOwnership } = require('../middleware/auth');

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/tables', getRestaurantTables);

// Admin-only endpoints
router.post('/', authenticate, authorize('restaurantAdmin'), createRestaurant);
router.put('/:id', authenticate, authorize('restaurantAdmin'), verifyRestaurantOwnership, updateRestaurant);

module.exports = router;
