const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hrms';
  
  try {
    // Attempt standard connection with 2.5s timeout for local responsiveness
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB] Connected successfully to: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (primaryErr) {
    console.warn(`[MongoDB] Standard connection to ${uri} failed (${primaryErr.message}).`);
    
    // In development or review mode, fallback to embedded MongoMemoryServer
    try {
      console.log('[MongoDB] Initializing embedded MongoDB server for instant zero-config academic demo...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memUri = mongodInstance.getUri();
      
      await mongoose.connect(memUri);
      console.log(`[MongoDB] Embedded in-memory MongoDB connected successfully at: ${memUri}`);
      
      // Auto-seed data into memory instance if not already seeded
      const { seedDatabase } = require('../seed/seedData');
      await seedDatabase({ quiet: true });
      console.log('[MongoDB] Seed data automatically loaded into embedded MongoDB instance.');
      
      return mongoose.connection;
    } catch (fallbackErr) {
      console.error('[MongoDB Error] Could not connect to either primary or fallback MongoDB:', fallbackErr.message);
      throw new Error(`Failed to initialize MongoDB. Please ensure MongoDB is running or provide a valid MONGODB_URI (e.g. MongoDB Atlas) in server/.env: ${primaryErr.message}`);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
    console.log('[MongoDB] Disconnected.');
  } catch (err) {
    console.error('[MongoDB] Error during disconnect:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
