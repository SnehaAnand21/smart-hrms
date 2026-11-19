import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationsAPI } from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeToast, setActiveToast] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationsAPI.getAll();
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('[NotificationContext] Failed to load notifications:', err.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for real-time notifications via Socket.IO
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = getSocket();

    const handleNewNotification = (notification) => {
      console.log('[NotificationContext] Real-time alert received:', notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Trigger interactive visual toast banner
      setActiveToast({
        id: Date.now(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
      });

      // Auto-hide toast after 6 seconds
      setTimeout(() => {
        setActiveToast((current) => (current?.id === activeToast?.id ? null : current));
      }, 6000);
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [isAuthenticated, user, activeToast?.id]);

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('[NotificationContext] Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('[NotificationContext] Error marking all as read:', err);
    }
  };

  const dismissToast = () => setActiveToast(null);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToast,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
export default NotificationContext;
