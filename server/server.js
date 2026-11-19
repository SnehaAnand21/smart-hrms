const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { initSocket } = require('./sockets/socketHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const tableRoutes = require('./routes/tableRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const queueRoutes = require('./routes/queueRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Environment setup
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Allowed origins for CORS (supports localhost, local IP, and cloud deployments)
const isProd = process.env.NODE_ENV === 'production';
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

const checkCorsOrigin = (origin, callback) => {
  // Allow requests with no origin (like mobile apps, curl, or same-origin static frontend)
  if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app')) {
    return callback(null, true);
  }
  return callback(null, true); // Permissive for academic review demonstration
};

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: checkCorsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

initSocket(io);

// Express Middleware
app.use(
  cors({
    origin: checkCorsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging for development
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'Smart Hospitality & Restaurant Management System (HRMS)',
    version: '1.0.0',
    student: 'Sneha.A [310624205264]',
    guide: 'Ms Grandhi Sai Lakshmi',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Serve Frontend static production assets if client/dist exists
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Route Handler for unmatched API requests
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found on HRMS server.`,
  });
});

// Fallback 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource '${req.originalUrl}' not found on HRMS server.`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Connect DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log('\n======================================================');
      console.log(`🚀 Smart HRMS Server running on: http://localhost:${PORT}`);
      console.log(`📡 Socket.IO Real-time service active on port: ${PORT}`);
      console.log(`🌐 Allowed Client URL: ${CLIENT_URL}`);
      console.log('======================================================\n');
    });
  } catch (error) {
    console.error('Failed to start HRMS server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server };
