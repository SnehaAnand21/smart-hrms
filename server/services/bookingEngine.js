const Booking = require('../models/Booking');
const Table = require('../models/Table');
const Restaurant = require('../models/Restaurant');
const Notification = require('../models/Notification');

// Convert "HH:MM" 24h string to minutes from midnight
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convert minutes from midnight back to "HH:MM"
const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Check if two time intervals overlap
const hasTimeOverlap = (startA, endA, startB, endB) => {
  const startAMin = timeToMinutes(startA);
  const endAMin = timeToMinutes(endA);
  const startBMin = timeToMinutes(startB);
  const endBMin = timeToMinutes(endB);

  // Overlap condition: start of one is before end of other, and vice versa
  return startAMin < endBMin && endAMin > startBMin;
};

const createBooking = async ({
  userId,
  restaurantId,
  tableId,
  bookingDate,
  startTime,
  partySize,
  durationMinutes = 90,
  specialRequests = '',
  customerName = '',
  customerPhone = '',
}) => {
  // 1. Verify restaurant exists
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    const error = new Error('Selected restaurant does not exist.');
    error.statusCode = 404;
    throw error;
  }

  // 2. Verify table exists and belongs to this restaurant
  const table = await Table.findOne({ _id: tableId, restaurantId });
  if (!table) {
    const error = new Error('Selected table does not exist or does not belong to this restaurant.');
    error.statusCode = 404;
    throw error;
  }

  // 3. Verify party size capacity
  if (partySize > table.capacity) {
    const error = new Error(
      `Table ${table.tableNumber} maximum capacity is ${table.capacity} guests, but party size is ${partySize}.`
    );
    error.statusCode = 400;
    throw error;
  }

  // 4. Calculate end time
  const startMin = timeToMinutes(startTime);
  const endTime = minutesToTime(startMin + durationMinutes);

  // 5. Atomic check for existing conflicting active bookings
  const existingBookings = await Booking.find({
    restaurantId,
    tableId,
    bookingDate,
    status: { $in: ['confirmed', 'pending', 'seated'] },
  });

  for (const existing of existingBookings) {
    if (hasTimeOverlap(startTime, endTime, existing.startTime, existing.endTime)) {
      const error = new Error(
        `Double-booking prevented: Table ${table.tableNumber} is already reserved between ${existing.startTime} and ${existing.endTime} on ${bookingDate}. Please select another time or table, or join our virtual queue.`
      );
      error.statusCode = 409; // Conflict
      throw error;
    }
  }

  // 6. Generate unique booking reference
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const dateCompact = bookingDate.replace(/-/g, '').slice(2);
  const bookingReference = `HRMS-${dateCompact}-${randomSuffix}`;

  // 7. Persist booking
  const booking = await Booking.create({
    bookingReference,
    userId,
    restaurantId,
    tableId,
    bookingDate,
    startTime,
    endTime,
    durationMinutes,
    partySize,
    customerName,
    customerPhone,
    specialRequests,
    status: 'confirmed',
  });

  // 8. If booking is for today and active now, update table status
  const todayStr = new Date().toISOString().split('T')[0];
  if (bookingDate === todayStr) {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    if (currentMin >= startMin - 30 && currentMin <= startMin + durationMinutes) {
      await Table.findByIdAndUpdate(tableId, { status: 'reserved' });
    }
  }

  // 9. Generate persistent notification for the customer
  await Notification.create({
    userId,
    type: 'booking_confirmed',
    title: 'Booking Confirmed!',
    message: `Your reservation at ${restaurant.name} for Table ${table.tableNumber} (${partySize} guests) on ${bookingDate} at ${startTime} is confirmed. Ref: ${bookingReference}`,
    relatedBookingId: booking._id,
  });

  return { booking, table, restaurant };
};

module.exports = {
  createBooking,
  hasTimeOverlap,
  timeToMinutes,
  minutesToTime,
};
