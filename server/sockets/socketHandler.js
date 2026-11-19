let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room for a specific restaurant (for live floor plan & tables updates)
    socket.on('join:restaurant', (restaurantId) => {
      if (restaurantId) {
        socket.join(`restaurant:${restaurantId}`);
        console.log(`[Socket.IO] ${socket.id} joined room restaurant:${restaurantId}`);
      }
    });

    socket.on('leave:restaurant', (restaurantId) => {
      if (restaurantId) {
        socket.leave(`restaurant:${restaurantId}`);
        console.log(`[Socket.IO] ${socket.id} left room restaurant:${restaurantId}`);
      }
    });

    // Join private room for user-specific alerts & notifications
    socket.on('join:user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Socket.IO] ${socket.id} joined user room user:${userId}`);
      }
    });

    socket.on('leave:user', (userId) => {
      if (userId) {
        socket.leave(`user:${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  return ioInstance;
};

// Event emitter helpers
const emitTableUpdate = (restaurantId, data) => {
  if (ioInstance && restaurantId) {
    ioInstance.to(`restaurant:${restaurantId}`).emit('tables:updated', data);
    console.log(`[Socket.IO] Emitted tables:updated to restaurant:${restaurantId}`);
  }
};

const emitBookingUpdate = (restaurantId, data) => {
  if (ioInstance && restaurantId) {
    ioInstance.to(`restaurant:${restaurantId}`).emit('booking:updated', data);
    console.log(`[Socket.IO] Emitted booking:updated to restaurant:${restaurantId}`);
  }
};

const emitQueueUpdate = (restaurantId, data) => {
  if (ioInstance && restaurantId) {
    ioInstance.to(`restaurant:${restaurantId}`).emit('queue:updated', data);
    console.log(`[Socket.IO] Emitted queue:updated to restaurant:${restaurantId}`);
  }
};

const emitNotification = (userId, data) => {
  if (ioInstance && userId) {
    ioInstance.to(`user:${userId}`).emit('notification:new', data);
    console.log(`[Socket.IO] Emitted notification:new to user:${userId}`);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitTableUpdate,
  emitBookingUpdate,
  emitQueueUpdate,
  emitNotification,
};
