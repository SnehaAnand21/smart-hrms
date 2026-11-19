const express = require('express');
const router = express.Router();
const {
  bookTable,
  getMyBookings,
  getRestaurantBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');

// Customer booking endpoints
router.post('/', authenticate, bookTable);
router.get('/my', authenticate, getMyBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id/cancel', authenticate, cancelBooking);

// Admin booking endpoints
router.get('/restaurant/:restaurantId', authenticate, authorize('restaurantAdmin'), getRestaurantBookings);
router.put('/:id/status', authenticate, authorize('restaurantAdmin'), updateBookingStatus);

module.exports = router;
