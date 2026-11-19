import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD ? window.location.origin : 'http://localhost:5000');

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected to HRMS server with ID:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket.IO] Disconnected from HRMS server:', reason);
    });

    socket.on('connect_error', (error) => {
      console.warn('[Socket.IO] Connection error:', error.message);
    });
  }
  return socket;
};

export const joinRestaurantRoom = (restaurantId) => {
  const s = getSocket();
  if (restaurantId && s.connected) {
    s.emit('join:restaurant', restaurantId);
  } else if (restaurantId) {
    s.once('connect', () => s.emit('join:restaurant', restaurantId));
  }
};

export const leaveRestaurantRoom = (restaurantId) => {
  const s = getSocket();
  if (restaurantId && s.connected) {
    s.emit('leave:restaurant', restaurantId);
  }
};

export const joinUserRoom = (userId) => {
  const s = getSocket();
  if (userId && s.connected) {
    s.emit('join:user', userId);
  } else if (userId) {
    s.once('connect', () => s.emit('join:user', userId));
  }
};

export const leaveUserRoom = (userId) => {
  const s = getSocket();
  if (userId && s.connected) {
    s.emit('leave:user', userId);
  }
};

export default getSocket;
