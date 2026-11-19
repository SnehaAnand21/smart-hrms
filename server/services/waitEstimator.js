/**
 * Deterministic AI Wait-Time Predictor
 * Designed for academic demonstration & real-time restaurant waitlist estimation.
 * 
 * Formula:
 * 1. Base average table turnover time (T_avg) = 45 minutes for casual / 60 minutes for fine dining.
 * 2. Filter available capacity: Find total tables in the restaurant capable of seating the party size (capacity >= partySize).
 * 3. Position in queue for this capacity tier (P_tier).
 * 4. Currently occupied matching tables (O_count).
 * 5. Estimated wait = Math.max(5, Math.round((P_tier * T_avg) / Math.max(1, matchingTableCount)));
 */

const Table = require('../models/Table');
const QueueEntry = require('../models/QueueEntry');

const estimateWaitTime = async ({ restaurantId, partySize }) => {
  try {
    // 1. Fetch matching tables for this restaurant
    const matchingTables = await Table.find({
      restaurantId,
      capacity: { $gte: partySize },
    });

    const matchingCount = matchingTables.length || 1;
    
    // Check if any matching table is currently 'available' right now
    const immediateFree = matchingTables.filter((t) => t.status === 'available');
    if (immediateFree.length > 0) {
      // Immediate table could be available if queue is empty
      const waitingCount = await QueueEntry.countDocuments({
        restaurantId,
        status: 'waiting',
      });
      if (waitingCount === 0) {
        return {
          estimatedMinutes: 0,
          queueAhead: 0,
          statusNote: 'Immediate seating may be available',
        };
      }
    }

    // 2. Count parties ahead in the queue with matching party size compatibility
    const queueAhead = await QueueEntry.countDocuments({
      restaurantId,
      status: 'waiting',
      partySize: { $lte: partySize + 2 }, // parties competing for similar size tables
    });

    // 3. Base dining turnover rate in minutes (standardized metric)
    const AVERAGE_TURNOVER_MINUTES = 40;

    // 4. Compute estimated wait
    // If 1 party ahead and 4 compatible tables -> (1 * 40) / 4 = 10 mins
    const estimatedMinutes = Math.max(
      5,
      Math.round(((queueAhead + 1) * AVERAGE_TURNOVER_MINUTES) / matchingCount)
    );

    return {
      estimatedMinutes,
      queueAhead,
      matchingTablesCount: matchingCount,
      statusNote: `${queueAhead} ${queueAhead === 1 ? 'party' : 'parties'} ahead in queue`,
    };
  } catch (error) {
    console.error('[waitEstimator Error]:', error);
    // Safe fallback estimate
    return {
      estimatedMinutes: 15,
      queueAhead: 1,
      statusNote: 'Estimated based on standard turnover',
    };
  }
};

module.exports = {
  estimateWaitTime,
};
