const Table = require('../models/Table');
const Booking = require('../models/Booking');
const QueueEntry = require('../models/QueueEntry');
const Notification = require('../models/Notification');
const { emitTableUpdate, emitQueueUpdate, emitNotification } = require('../sockets/socketHandler');

// @route   POST /api/tables
// @desc    Add a new table to the restaurant floor plan
exports.createTable = async (req, res, next) => {
  try {
    const { restaurantId, tableNumber, capacity, floor, position } = req.body;

    if (!restaurantId || !tableNumber || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'restaurantId, tableNumber, and capacity are required.',
      });
    }

    const existing = await Table.findOne({ restaurantId, tableNumber: tableNumber.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Table number '${tableNumber}' already exists in this restaurant.`,
      });
    }

    const table = await Table.create({
      restaurantId,
      tableNumber: tableNumber.trim(),
      capacity: parseInt(capacity, 10),
      floor: floor || 'Main Dining',
      position: position || { x: 20, y: 20, shape: 'square' },
      status: 'available',
    });

    // Broadcast live floor update
    emitTableUpdate(restaurantId, {
      action: 'created',
      table,
    });

    return res.status(201).json({
      success: true,
      message: `Table ${table.tableNumber} added successfully.`,
      table,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/tables/:id/status
// @desc    Quick-update table status (available, held, occupied, reserved)
exports.updateTableStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['available', 'held', 'occupied', 'reserved'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found.',
      });
    }

    // Check if table has an active confirmed booking right now if changing to occupied/held
    const oldStatus = table.status;
    table.status = status;

    if (status === 'available') {
      table.currentOccupant = {
        userId: null,
        partySize: null,
        seatedAt: null,
        expectedEnd: null,
        bookingReference: null,
      };

      // Check if there are waiting queue parties eligible for this table
      const nextQueueEntry = await QueueEntry.findOne({
        restaurantId: table.restaurantId,
        status: 'waiting',
        partySize: { $lte: table.capacity },
      }).sort({ queuePosition: 1, joinedAt: 1 });

      if (nextQueueEntry) {
        // Send in-app notification to this waiting diner
        const notif = await Notification.create({
          userId: nextQueueEntry.userId,
          type: 'table_available',
          title: 'A Table Just Opened Up!',
          message: `Good news! Table ${table.tableNumber} (${table.capacity} seats) is now free for your party of ${nextQueueEntry.partySize}. You are next in line!`,
          relatedQueueEntryId: nextQueueEntry._id,
        });
        emitNotification(nextQueueEntry.userId.toString(), notif);
      }
    }

    await table.save();

    // Broadcast table status change to all clients viewing this restaurant
    emitTableUpdate(table.restaurantId.toString(), {
      action: 'status_changed',
      tableId: table._id,
      oldStatus,
      newStatus: status,
      table,
    });

    return res.json({
      success: true,
      message: `Table ${table.tableNumber} status updated to '${status}'.`,
      table,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/tables/:id
// @desc    Update table details and floor plan position
exports.updateTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found.',
      });
    }

    emitTableUpdate(table.restaurantId.toString(), {
      action: 'updated',
      table,
    });

    return res.json({
      success: true,
      message: 'Table updated successfully.',
      table,
    });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/tables/:id
// @desc    Delete table from floor plan
exports.deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found.',
      });
    }

    // Check for active future bookings
    const activeBookings = await Booking.countDocuments({
      tableId: table._id,
      status: { $in: ['confirmed', 'pending', 'seated'] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete Table ${table.tableNumber} because it has ${activeBookings} active booking(s). Please cancel or reassign them first.`,
      });
    }

    const restaurantId = table.restaurantId.toString();
    await table.deleteOne();

    emitTableUpdate(restaurantId, {
      action: 'deleted',
      tableId: req.params.id,
    });

    return res.json({
      success: true,
      message: `Table ${table.tableNumber} has been deleted.`,
    });
  } catch (err) {
    next(err);
  }
};
