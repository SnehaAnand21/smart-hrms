const Booking = require('../models/Booking');
const Table = require('../models/Table');
const Restaurant = require('../models/Restaurant');
const Notification = require('../models/Notification');
const QueueEntry = require('../models/QueueEntry');
const { createBooking } = require('../services/bookingEngine');
const { emitTableUpdate, emitBookingUpdate, emitNotification } = require('../sockets/socketHandler');

// @route   POST /api/bookings
// @desc    Reserve a table (with double-booking prevention)
exports.bookTable = async (req, res, next) => {
  try {
    const {
      restaurantId,
      tableId,
      bookingDate,
      startTime,
      partySize,
      specialRequests,
      customerName,
      customerPhone,
      durationMinutes,
    } = req.body;

    if (!restaurantId || !tableId || !bookingDate || !startTime || !partySize) {
      return res.status(400).json({
        success: false,
        message: 'restaurantId, tableId, bookingDate, startTime, and partySize are required.',
      });
    }

    const result = await createBooking({
      userId: req.user._id,
      restaurantId,
      tableId,
      bookingDate,
      startTime,
      partySize: parseInt(partySize, 10),
      durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : 90,
      specialRequests,
      customerName: customerName || req.user.name,
      customerPhone: customerPhone || req.user.phone,
    });

    // Broadcast table status update
    emitTableUpdate(restaurantId, {
      action: 'booking_created',
      tableId,
      booking: result.booking,
    });

    emitBookingUpdate(restaurantId, {
      action: 'new_booking',
      booking: result.booking,
    });

    return res.status(201).json({
      success: true,
      message: `Table ${result.table.tableNumber} booked successfully! Your reservation reference is ${result.booking.bookingReference}.`,
      booking: result.booking,
      table: result.table,
      restaurant: {
        id: result.restaurant._id,
        name: result.restaurant.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/bookings/my
// @desc    Get all bookings for the logged-in user
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('restaurantId', 'name address cuisine images rating contactPhone')
      .populate('tableId', 'tableNumber capacity floor')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/bookings/restaurant/:restaurantId
// @desc    Admin: get bookings for their restaurant with optional date & status filters
exports.getRestaurantBookings = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { status, date, search } = req.query;

    const filter = { restaurantId };
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (date) {
      filter.bookingDate = date;
    }
    if (search && search.trim()) {
      const s = search.trim();
      filter.$or = [
        { bookingReference: new RegExp(s, 'i') },
        { customerName: new RegExp(s, 'i') },
        { customerPhone: new RegExp(s, 'i') },
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('tableId', 'tableNumber capacity floor')
      .populate('userId', 'name email phone')
      .sort({ bookingDate: 1, startTime: 1 });

    return res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/bookings/:id
// @desc    Get booking details
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('restaurantId', 'name address cuisine contactPhone')
      .populate('tableId', 'tableNumber capacity floor position')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Role check: customer can only see their own booking unless restaurant admin
    if (
      req.user.role !== 'restaurantAdmin' &&
      booking.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot view another customer’s reservation.',
      });
    }

    return res.json({
      success: true,
      booking,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking (releases table and notifies queue if applicable)
exports.cancelBooking = async (req, res, next) => {
  try {
    const { reason = 'Cancelled by customer' } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Authorization
    if (
      req.user.role !== 'restaurantAdmin' &&
      booking.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot cancel another diner’s booking.',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled.',
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    await booking.save();

    // Check if table was reserved for this booking right now, and make available if no other active booking
    const todayStr = new Date().toISOString().split('T')[0];
    if (booking.bookingDate === todayStr) {
      const activeOverlap = await Booking.countDocuments({
        tableId: booking.tableId,
        bookingDate: todayStr,
        status: { $in: ['confirmed', 'seated'] },
      });

      if (activeOverlap === 0) {
        const table = await Table.findById(booking.tableId);
        if (table && table.status === 'reserved') {
          table.status = 'available';
          await table.save();

          // Alert waiting queue party
          const nextQueueEntry = await QueueEntry.findOne({
            restaurantId: booking.restaurantId,
            status: 'waiting',
            partySize: { $lte: table.capacity },
          }).sort({ queuePosition: 1, joinedAt: 1 });

          if (nextQueueEntry) {
            const notif = await Notification.create({
              userId: nextQueueEntry.userId,
              type: 'table_available',
              title: 'Seat Available!',
              message: `A booking was just cancelled! Table ${table.tableNumber} is now open for your party of ${nextQueueEntry.partySize}.`,
              relatedQueueEntryId: nextQueueEntry._id,
            });
            emitNotification(nextQueueEntry.userId.toString(), notif);
          }

          emitTableUpdate(booking.restaurantId.toString(), {
            action: 'table_freed',
            tableId: table._id,
            table,
          });
        }
      }
    }

    // In-app notification for user
    await Notification.create({
      userId: booking.userId,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `Your reservation (Ref: ${booking.bookingReference}) has been cancelled.`,
      relatedBookingId: booking._id,
    });

    emitBookingUpdate(booking.restaurantId.toString(), {
      action: 'booking_cancelled',
      bookingId: booking._id,
      booking,
    });

    return res.json({
      success: true,
      message: 'Booking cancelled successfully.',
      booking,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/bookings/:id/status
// @desc    Admin: update booking status (seated, completed, cancelled)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'seated', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    booking.status = status;
    await booking.save();

    // If seated, update table to occupied
    if (status === 'seated') {
      await Table.findByIdAndUpdate(booking.tableId, {
        status: 'occupied',
        currentOccupant: {
          userId: booking.userId,
          partySize: booking.partySize,
          seatedAt: new Date(),
          bookingReference: booking.bookingReference,
        },
      });
      emitTableUpdate(booking.restaurantId.toString(), { action: 'seated', tableId: booking.tableId });
    } else if (status === 'completed' || status === 'cancelled') {
      // Free table if no other active booking
      await Table.findByIdAndUpdate(booking.tableId, {
        status: 'available',
        currentOccupant: null,
      });
      emitTableUpdate(booking.restaurantId.toString(), { action: 'table_freed', tableId: booking.tableId });
    }

    emitBookingUpdate(booking.restaurantId.toString(), {
      action: 'status_updated',
      booking,
    });

    return res.json({
      success: true,
      message: `Booking status updated to ${status}.`,
      booking,
    });
  } catch (err) {
    next(err);
  }
};
