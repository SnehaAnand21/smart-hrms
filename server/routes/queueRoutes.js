const express = require('express');
const router = express.Router();
const {
  joinQueue,
  getMyQueueStatus,
  getRestaurantQueue,
  cancelQueue,
  seatQueueCustomer,
  notifyQueueCustomer,
} = require('../controllers/queueController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, joinQueue);
router.get('/my', authenticate, getMyQueueStatus);
router.get('/restaurant/:restaurantId', getRestaurantQueue);
router.put('/:id/cancel', authenticate, cancelQueue);

// Admin-only queue operations
router.put('/:id/seat', authenticate, authorize('restaurantAdmin'), seatQueueCustomer);
router.put('/:id/notify', authenticate, authorize('restaurantAdmin'), notifyQueueCustomer);

module.exports = router;
