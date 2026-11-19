const QueueEntry = require('../models/QueueEntry');
const Table = require('../models/Table');
const Notification = require('../models/Notification');
const { joinQueue, reorderQueue, seatQueueEntry } = require('../services/queueService');
const { emitQueueUpdate, emitTableUpdate, emitNotification } = require('../sockets/socketHandler');

// @route   POST /api/queue
// @desc    Join a restaurant virtual queue
exports.joinQueue = async (req, res, next) => {
  try {
    const { restaurantId, partySize, customerName, customerPhone, notes } = req.body;

    if (!restaurantId || !partySize) {
      return res.status(400).json({
        success: false,
        message: 'restaurantId and partySize are required to join the queue.',
      });
    }

    const { entry, estimate } = await joinQueue({
      userId: req.user._id,
      restaurantId,
      partySize: parseInt(partySize, 10),
      customerName: customerName || req.user.name,
      customerPhone: customerPhone || req.user.phone,
      notes: notes || '',
    });

    emitQueueUpdate(restaurantId, {
      action: 'joined',
      entry,
    });

    return res.status(201).json({
      success: true,
      message: `You have joined the virtual queue at position #${entry.queuePosition}. Estimated wait: ~${estimate.estimatedMinutes} minutes.`,
      queueEntry: entry,
      estimate,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/queue/my
// @desc    Get the current user's active virtual queue status
exports.getMyQueueStatus = async (req, res, next) => {
  try {
    const entries = await QueueEntry.find({
      userId: req.user._id,
      status: { $in: ['waiting', 'notified'] },
    })
      .populate('restaurantId', 'name address cuisine contactPhone images')
      .populate('assignedTableId', 'tableNumber capacity floor');

    return res.json({
      success: true,
      entries,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/queue/restaurant/:restaurantId
// @desc    Get active queue entries for a restaurant
exports.getRestaurantQueue = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const entries = await QueueEntry.find({
      restaurantId,
      status: { $in: ['waiting', 'notified'] },
    })
      .sort({ queuePosition: 1 })
      .populate('userId', 'name email phone')
      .populate('assignedTableId', 'tableNumber');

    return res.json({
      success: true,
      count: entries.length,
      queue: entries,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/queue/:id/cancel
// @desc    Customer leaves queue or admin cancels queue entry
exports.cancelQueue = async (req, res, next) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Queue entry not found.',
      });
    }

    if (
      req.user.role !== 'restaurantAdmin' &&
      entry.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot cancel another user’s queue spot.',
      });
    }

    entry.status = 'cancelled';
    await entry.save();

    // Reorder remaining waiting entries
    await reorderQueue(entry.restaurantId);

    emitQueueUpdate(entry.restaurantId.toString(), {
      action: 'cancelled',
      queueId: entry._id,
    });

    return res.json({
      success: true,
      message: 'You have left the virtual queue.',
      queueEntry: entry,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/queue/:id/seat
// @desc    Admin: Seat a customer from virtual queue onto an available table
exports.seatQueueCustomer = async (req, res, next) => {
  try {
    const { tableId } = req.body;
    if (!tableId) {
      return res.status(400).json({
        success: false,
        message: 'tableId is required to seat a customer.',
      });
    }

    const { entry, table } = await seatQueueEntry(req.params.id, tableId, req.user._id);

    emitTableUpdate(entry.restaurantId.toString(), {
      action: 'seated_from_queue',
      tableId,
      table,
    });

    emitQueueUpdate(entry.restaurantId.toString(), {
      action: 'seated',
      queueId: entry._id,
    });

    return res.json({
      success: true,
      message: `Party of ${entry.partySize} seated successfully at Table ${table.tableNumber}.`,
      entry,
      table,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/queue/:id/notify
// @desc    Admin: Alert a customer that their seat is almost ready
exports.notifyQueueCustomer = async (req, res, next) => {
  try {
    const entry = await QueueEntry.findById(req.params.id).populate('restaurantId', 'name');
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Queue entry not found.',
      });
    }

    entry.status = 'notified';
    entry.notifiedAt = new Date();
    await entry.save();

    const notif = await Notification.create({
      userId: entry.userId,
      type: 'queue_notified',
      title: 'Your Table is Almost Ready!',
      message: `Please head over to the host desk at ${entry.restaurantId.name}. Your table is being prepared now!`,
      relatedQueueEntryId: entry._id,
    });

    emitNotification(entry.userId.toString(), notif);
    emitQueueUpdate(entry.restaurantId._id.toString(), {
      action: 'notified',
      queueId: entry._id,
    });

    return res.json({
      success: true,
      message: `Diner alerted successfully.`,
      entry,
    });
  } catch (err) {
    next(err);
  }
};
