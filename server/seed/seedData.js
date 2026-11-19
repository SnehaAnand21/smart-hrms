const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Table = require('../models/Table');
const Booking = require('../models/Booking');
const QueueEntry = require('../models/QueueEntry');
const Notification = require('../models/Notification');

const seedDatabase = async ({ quiet = false } = {}) => {
  const log = (...args) => {
    if (!quiet) console.log(...args);
  };

  log('[Seed] Starting database seed process...');

  // 1. Clear existing collections
  await User.deleteMany({});
  await Restaurant.deleteMany({});
  await Table.deleteMany({});
  await Booking.deleteMany({});
  await QueueEntry.deleteMany({});
  await Notification.deleteMany({});

  log('[Seed] Cleaned existing collections.');

  // 2. Hash default passwords
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);
  const customerPasswordHash = await bcrypt.hash('customer123', salt);

  // 3. Create Seed Users
  const users = await User.insertMany([
    {
      name: 'Sneha A (Admin)',
      email: 'admin@hrms.com',
      passwordHash: adminPasswordHash,
      role: 'restaurantAdmin',
      phone: '+91 98401 11222',
    },
    {
      name: 'Chef Marco Rossi',
      email: 'bistro@hrms.com',
      passwordHash: adminPasswordHash,
      role: 'restaurantAdmin',
      phone: '+91 98402 33445',
    },
    {
      name: 'Sneha Anand (Diner)',
      email: 'sneha@hrms.com',
      passwordHash: customerPasswordHash,
      role: 'customer',
      phone: '+91 98405 66778',
    },
    {
      name: 'Vikram Sundaram',
      email: 'diner@hrms.com',
      passwordHash: customerPasswordHash,
      role: 'customer',
      phone: '+91 98406 88990',
    },
    {
      name: 'Priya Raman',
      email: 'priya@hrms.com',
      passwordHash: customerPasswordHash,
      role: 'customer',
      phone: '+91 98407 12345',
    },
  ]);

  const admin1 = users[0];
  const admin2 = users[1];
  const customer1 = users[2];
  const customer2 = users[3];
  const customer3 = users[4];

  // 4. Create 6 Realistic Restaurants
  const restaurants = await Restaurant.insertMany([
    {
      name: 'The Royal Chettinad Palace',
      description: 'Heritage fine dining celebrating authentic South Indian Chettinad spices, clay-pot biryanis, and coastal seafood delicacies in an opulent heritage hall.',
      cuisine: ['South Indian', 'Chettinad', 'Seafood'],
      address: {
        street: '45 Mount Road',
        area: 'Guindy',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600032',
      },
      location: {
        type: 'Point',
        coordinates: [80.2088, 13.0067],
      },
      openingHours: { open: '11:30', close: '23:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      images: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
      ],
      rating: 4.8,
      reviewCount: 342,
      priceRange: '$$$',
      contactPhone: '+91 44 2235 9901',
      features: ['Valet Parking', 'Heritage Courtyard', 'Live Carnatic Music', 'AC Banquet'],
      ownerId: admin1._id,
    },
    {
      name: 'Truffles & Basil Bistro',
      description: 'Chic Mediterranean bistro serving hand-tossed sourdough Neapolitan pizzas, artisanal truffle pastas, and handcrafted gelato.',
      cuisine: ['Italian', 'Continental', 'European'],
      address: {
        street: '18 Khader Nawaz Khan Road',
        area: 'Nungambakkam',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600006',
      },
      location: {
        type: 'Point',
        coordinates: [80.2464, 13.0604],
      },
      openingHours: { open: '12:00', close: '23:30', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      images: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80',
      ],
      rating: 4.7,
      reviewCount: 289,
      priceRange: '$$$',
      contactPhone: '+91 44 2833 4455',
      features: ['Outdoor Glasshouse', 'Wood-fired Oven', 'Cocktail Lounge', 'Valet'],
      ownerId: admin2._id,
    },
    {
      name: 'Kyoto Blossom Sushi Bar',
      description: 'Intimate Japanese dining featuring omakase sushi counters, crispy tempura, authentic ramen bowls, and serene Zen ambience.',
      cuisine: ['Japanese', 'Sushi', 'Asian Fusion'],
      address: {
        street: '82 Chamiers Road',
        area: 'Alwarpet',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600018',
      },
      location: {
        type: 'Point',
        coordinates: [80.2488, 13.0315],
      },
      openingHours: { open: '12:30', close: '22:30', days: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      images: [
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1000&q=80',
      ],
      rating: 4.9,
      reviewCount: 195,
      priceRange: '$$$$',
      contactPhone: '+91 44 4211 7788',
      features: ['Omakase Counter', 'Private Tatami Booths', 'Sake Bar', 'Zen Garden'],
    },
    {
      name: 'Golden Dragon Asian House',
      description: 'Vibrant Pan-Asian cuisine featuring Cantonese dim sum baskets, fiery Sichuan stir-fries, and fragrant Thai curries with live open kitchen.',
      cuisine: ['Pan-Asian', 'Chinese', 'Thai'],
      address: {
        street: '34 TTK Road',
        area: 'T. Nagar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600017',
      },
      location: {
        type: 'Point',
        coordinates: [80.2337, 13.0418],
      },
      openingHours: { open: '12:00', close: '23:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      images: [
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=80',
      ],
      rating: 4.5,
      reviewCount: 215,
      priceRange: '$$',
      contactPhone: '+91 44 2434 8812',
      features: ['Dim Sum Trolley', 'Family Lazy Susan Tables', 'Live Wok Station'],
    },
    {
      name: 'Saffron & Charcoal Grill',
      description: 'North Indian tandoor mastery with rich slow-cooked Dal Makhani, saffron-infused biryanis, and sizzling seekh kebabs in a regal setting.',
      cuisine: ['North Indian', 'Mughlai', 'Barbecue'],
      address: {
        street: '102 Velachery Main Road',
        area: 'Velachery',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600042',
      },
      location: {
        type: 'Point',
        coordinates: [80.2184, 12.9815],
      },
      openingHours: { open: '12:00', close: '23:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      images: [
        'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80',
      ],
      rating: 4.6,
      reviewCount: 310,
      priceRange: '$$',
      contactPhone: '+91 44 2244 5566',
      features: ['Live Tandoor Counter', 'Rooftop Gazebo', 'Buffet Available'],
    },
    {
      name: 'The Green Canopy Garden Cafe',
      description: 'Botanical garden cafe surrounded by lush foliage, offering specialty single-origin pour-overs, sourdough avocado toasts, and vegan bowls.',
      cuisine: ['Cafe', 'Continental', 'Bakery'],
      address: {
        street: '15 Gandhi Road',
        area: 'Besant Nagar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600090',
      },
      location: {
        type: 'Point',
        coordinates: [80.2668, 13.0002],
      },
      openingHours: { open: '08:30', close: '22:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      images: [
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1000&q=80',
      ],
      rating: 4.7,
      reviewCount: 420,
      priceRange: '$$',
      contactPhone: '+91 44 2491 3322',
      features: ['Pet Friendly', 'Lush Garden Seating', 'Work-from-Cafe WiFi', 'Specialty Roastery'],
    },
  ]);

  // Associate admin 1 and 2 to their restaurants
  admin1.restaurantId = restaurants[0]._id;
  await admin1.save();
  admin2.restaurantId = restaurants[1]._id;
  await admin2.save();

  log(`[Seed] Seeded ${restaurants.length} restaurants and linked admin accounts.`);

  // 5. Seed 10-12 Tables per restaurant with Floor Plan Coordinates
  const tables = [];
  const statusPool = ['available', 'available', 'available', 'occupied', 'held', 'reserved', 'available', 'available'];

  for (let rIdx = 0; rIdx < restaurants.length; rIdx++) {
    const rest = restaurants[rIdx];
    const isFirstRest = rIdx === 0;

    // Floor plan table specs (10 tables per restaurant)
    const tableSpecs = [
      { num: 'T-01', cap: 2, floor: 'Main Dining', x: 15, y: 20, shape: 'round', status: 'available' },
      { num: 'T-02', cap: 2, floor: 'Main Dining', x: 35, y: 20, shape: 'round', status: isFirstRest ? 'occupied' : 'available' },
      { num: 'T-03', cap: 4, floor: 'Main Dining', x: 60, y: 20, shape: 'square', status: 'available' },
      { num: 'T-04', cap: 4, floor: 'Main Dining', x: 82, y: 20, shape: 'square', status: isFirstRest ? 'reserved' : 'available' },
      { num: 'T-05', cap: 4, floor: 'Main Dining', x: 15, y: 55, shape: 'square', status: 'available' },
      { num: 'T-06', cap: 6, floor: 'Main Dining', x: 42, y: 55, shape: 'rect', status: isFirstRest ? 'occupied' : 'available' },
      { num: 'T-07', cap: 6, floor: 'Main Dining', x: 75, y: 55, shape: 'rect', status: isFirstRest ? 'held' : 'available' },
      { num: 'T-08', cap: 8, floor: 'VIP Bay', x: 20, y: 85, shape: 'rect', status: 'available' },
      { num: 'T-09', cap: 2, floor: 'Outdoor Terrace', x: 55, y: 85, shape: 'round', status: 'available' },
      { num: 'T-10', cap: 4, floor: 'Outdoor Terrace', x: 80, y: 85, shape: 'square', status: 'available' },
    ];

    for (const spec of tableSpecs) {
      tables.push({
        restaurantId: rest._id,
        tableNumber: spec.num,
        capacity: spec.cap,
        floor: spec.floor,
        position: { x: spec.x, y: spec.y, shape: spec.shape },
        status: spec.status,
        currentOccupant:
          spec.status === 'occupied'
            ? {
                userId: customer2._id,
                partySize: spec.cap,
                seatedAt: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
              }
            : null,
      });
    }
  }

  const createdTables = await Table.insertMany(tables);
  log(`[Seed] Seeded ${createdTables.length} tables with coordinate mapping.`);

  // 6. Seed Bookings
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const firstRestTables = createdTables.filter((t) => t.restaurantId.toString() === restaurants[0]._id.toString());
  const reservedTable = firstRestTables.find((t) => t.tableNumber === 'T-04') || firstRestTables[3];
  const tableT01 = firstRestTables.find((t) => t.tableNumber === 'T-01') || firstRestTables[0];

  const bookings = await Booking.insertMany([
    {
      bookingReference: 'HRMS-CHE-0891',
      userId: customer1._id,
      restaurantId: restaurants[0]._id,
      tableId: reservedTable._id,
      bookingDate: todayStr,
      startTime: '19:30',
      endTime: '21:00',
      partySize: 4,
      status: 'confirmed',
      customerName: customer1.name,
      customerPhone: customer1.phone,
      specialRequests: 'Window side seating for anniversary celebration',
    },
    {
      bookingReference: 'HRMS-CHE-0942',
      userId: customer1._id,
      restaurantId: restaurants[0]._id,
      tableId: tableT01._id,
      bookingDate: tomorrowStr,
      startTime: '13:00',
      endTime: '14:30',
      partySize: 2,
      status: 'confirmed',
      customerName: customer1.name,
      customerPhone: customer1.phone,
      specialRequests: 'Quiet table for business lunch meeting',
    },
    {
      bookingReference: 'HRMS-BIS-0311',
      userId: customer2._id,
      restaurantId: restaurants[1]._id,
      tableId: createdTables.find((t) => t.restaurantId.toString() === restaurants[1]._id.toString())._id,
      bookingDate: todayStr,
      startTime: '20:00',
      endTime: '21:30',
      partySize: 2,
      status: 'confirmed',
      customerName: customer2.name,
      customerPhone: customer2.phone,
      specialRequests: 'Celebrating birthday with complimentary dessert',
    },
  ]);

  log(`[Seed] Seeded ${bookings.length} reservations.`);

  // 7. Seed Queue Entries for restaurant 0
  const queueEntries = await QueueEntry.insertMany([
    {
      userId: customer3._id,
      restaurantId: restaurants[0]._id,
      partySize: 4,
      queuePosition: 1,
      joinedAt: new Date(Date.now() - 12 * 60 * 1000), // 12 mins ago
      estimatedWaitMinutes: 10,
      status: 'waiting',
      customerName: customer3.name,
      customerPhone: customer3.phone,
      notes: 'High chair required for toddler',
    },
    {
      userId: customer2._id,
      restaurantId: restaurants[0]._id,
      partySize: 2,
      queuePosition: 2,
      joinedAt: new Date(Date.now() - 5 * 60 * 1000),
      estimatedWaitMinutes: 20,
      status: 'waiting',
      customerName: customer2.name,
      customerPhone: customer2.phone,
      notes: 'Fine with terrace or indoor',
    },
  ]);

  log(`[Seed] Seeded ${queueEntries.length} virtual queue entries.`);

  // 8. Seed Notifications
  await Notification.insertMany([
    {
      userId: customer1._id,
      type: 'booking_confirmed',
      title: 'Reservation Confirmed',
      message: `Your booking at The Royal Chettinad Palace for Table ${reservedTable.tableNumber} on ${todayStr} at 19:30 is confirmed! (Ref: HRMS-CHE-0891)`,
      relatedBookingId: bookings[0]._id,
      isRead: false,
    },
    {
      userId: customer3._id,
      type: 'queue_joined',
      title: 'Virtual Queue Update',
      message: 'You are currently #1 in line at The Royal Chettinad Palace. Estimated wait: ~10 minutes.',
      relatedQueueEntryId: queueEntries[0]._id,
      isRead: false,
    },
    {
      userId: customer1._id,
      type: 'general',
      title: 'Welcome to Smart HRMS!',
      message: 'Explore live seat maps, book genuine tables in real-time, or join virtual queues.',
      isRead: true,
    },
  ]);

  log('[Seed] Database seeding completed successfully!');
  return {
    restaurantsCount: restaurants.length,
    tablesCount: createdTables.length,
    bookingsCount: bookings.length,
    queueCount: queueEntries.length,
    adminEmail: 'admin@hrms.com',
    customerEmail: 'sneha@hrms.com',
  };
};

// If run directly via node seed/seedData.js
if (require.main === module) {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
  const { connectDB, disconnectDB } = require('../config/db');

  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      console.log('\n=============================================');
      console.log('✅ HRMS Database Seeding Complete!');
      console.log('Demo Credentials:');
      console.log('  Admin:    admin@hrms.com    / admin123');
      console.log('  Customer: sneha@hrms.com    / customer123');
      console.log('=============================================\n');
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    }
  })();
}

module.exports = { seedDatabase };
