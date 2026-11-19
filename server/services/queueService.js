const QueueEntry = require('../models/QueueEntry');
const Table = require('../models/Table');
const Restaurant = require('../models/Restaurant');
const Notification = require('../models/Notification');
const { estimateWaitTime } = require('./waitEstimator');

/**
 * Join Virtual Queue
 */
const joinQueue = async ({
  userId,
  restaurantId,
  partySize,
  customerName = '',
  customerPhone = '',
  notes = '',
}) => {
  // 1. Prevent duplicate active queue entries for the same restaurant
  const existingActive = await QueueEntry.findOne({
    userId,
    restaurantId,
    status: { $in: ['waiting', 'notified'] },
  });

  if (existingActive) {
    const error = new Error(
      `You are already in this restaurant's virtual queue at position #${existingActive.queuePosition}.`
    );
    error.statusCode = 400;
    throw error;
  }

  // 2. Determine current position
  const waitingCount = await QueueEntry.countDocuments({
    restaurantId,
    status: 'waiting',
  });
  const queuePosition = waitingCount + 1;

  // 3. Estimate wait time
  const estimate = await estimateWaitTime({ restaurantId, partySize });

  // 4. Create queue entry
  const entry = await QueueEntry.create({
    userId,
    restaurantId,
    partySize,
    queuePosition,
    estimatedWaitMinutes: estimate.estimatedMinutes,
    customerName,
    customerPhone,
    notes,
    status: 'waiting',
  });

  const restaurant = await Restaurant.findById(restaurantId).select('name');

  // 5. Create notification
  await Notification.create({
    userId,
    type: 'queue_joined',
    title: 'Joined Virtual Queue',
    message: `You are in line at ${restaurant ? restaurant.name : 'the restaurant'} at position #${queuePosition}. Estimated wait: ~${estimate.estimatedMinutes} mins.`,
    relatedQueueEntryId: entry._id,
  });

  return { entry, estimate };
};

/**
 * Recalculate queue positions after an entry leaves or is seated
 */
const reorderQueue = async (restaurantId) => {
  const waitingEntries = await QueueEntry.find({
    restaurantId,
    status: { $in: ['waiting', 'notified'] },
  }).sort({ queuePosition: 1, joinedAt: 1 });

  for (let i = 0; i < waitingEntries.length; i++) {
    const newPosition = i + 1;
    if (waitingEntries[i].queuePosition !== newPosition) {
      waitingEntries[i].queuePosition = newPosition;
      // Recalculate wait time based on new position
      const estimate = await estimateWaitTime({
        restaurantId,
        partySize: waitingEntries[i].partySize,
      });
      waitingEntries[i].estimatedWaitMinutes = estimate.estimatedMinutes;
      await waitingEntries[i].save();
    }
  }

  return waitingEntries;
};

/**
 * Find next eligible queue entry when a table frees up
 */
const findNextEligibleEntry = async (restaurantId, tableCapacity) => {
  return QueueEntry.findOne({
    restaurantId,
    status: 'waiting',
    partySize: { $lte: tableCapacity },
  }).sort({ queuePosition: 1, joinedAt: 1 });
};

/**
 * Seat a queue party onto a table
 */
const seatQueueEntry = async (queueId, tableId, adminUserId) => {
  const entry = await QueueEntry.findById(queueId);
  if (!entry) {
    const error = new Error('Queue entry not found.');
    error.statusCode = 404;
    throw error;
  }

  const table = await Table.findById(tableId);
  if (!table) {
    const error = new Error('Table not found.');
    error.statusCode = 404;
    throw error;
  }

  if (table.capacity < entry.partySize) {
    const error = new Error(
      `Table capacity (${table.capacity}) is smaller than party size (${entry.partySize}).`
    );
    error.statusCode = 400;
    throw error;
  }

  // Update entry status
  entry.status = 'seated';
  entry.assignedTableId = table._id;
  entry.seatedAt = new Date();
  await entry.save();

  // Update table status to 'occupied'
  table.status = 'occupied';
  table.currentOccupant = {
    userId: entry.userId,
    partySize: entry.partySize,
    seatedAt: new Date(),
  };
  await table.save();

  // Reorder remaining queue
  await reorderQueue(entry.restaurantId);

  // Notify customer
  await Notification.create({
    userId: entry.userId,
    type: 'queue_seated',
    title: 'Your Table is Ready!',
    message: `Welcome! Table ${table.tableNumber} is ready for your party of ${entry.partySize}. Please proceed to your seat.`,
    relatedQueueEntryId: entry._id,
  });

  return { entry, table };
};

module.exports = {
  joinQueue,
  reorderQueue,
  findNextEligibleEntry,
  seatQueueEntry,
};
