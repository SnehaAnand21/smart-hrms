import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCheck, CheckCircle2, Clock, RotateCw, AlertCircle } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } =
    useNotifications();
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'

  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-forest-700 dark:text-emerald-400">
            Activity & Notifications
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">Notification Center</h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Real-time reservation confirmations, seat availability alerts, and queue status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-xl bg-forest-50 dark:bg-forest-950/80 hover:bg-forest-100 dark:hover:bg-forest-900 text-forest-900 dark:text-emerald-300 border border-transparent dark:border-forest-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
              Mark all as read
            </button>
          )}
          <button
            onClick={fetchNotifications}
            className="p-2 rounded-xl border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-stone-50 dark:hover:bg-forest-950/60 text-stone-700 dark:text-stone-300 transition-colors"
            title="Refresh notifications"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-forest-900 dark:bg-forest-700 text-white font-semibold'
              : 'bg-white dark:bg-dark-surface border border-stone-200 dark:border-dark-border text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-forest-950/50'
          }`}
        >
          All Activity ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-forest-900 dark:bg-forest-700 text-white font-semibold'
              : 'bg-white dark:bg-dark-surface border border-stone-200 dark:border-dark-border text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-forest-950/50'
          }`}
        >
          Unread Alerts ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-12 text-center border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-3 transition-colors">
          <Bell className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-100">No notifications found</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {filter === 'unread'
              ? 'You have caught up with all your alerts!'
              : 'Notifications will appear when you book tables or join virtual queues.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card divide-y divide-stone-100 dark:divide-dark-border overflow-hidden transition-colors">
          {filteredNotifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => {
                if (!notif.isRead) markAsRead(notif._id);
              }}
              className={`p-5 transition-colors flex items-start gap-4 cursor-pointer hover:bg-stone-50/80 dark:hover:bg-forest-950/40 ${
                !notif.isRead ? 'bg-forest-50/30 dark:bg-forest-950/20' : ''
              }`}
            >
              <div
                className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                  notif.type === 'table_available'
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                    : notif.type === 'booking_confirmed'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    : 'bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-emerald-300'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">{notif.title}</h4>
                  <span className="text-[11px] text-stone-400 dark:text-stone-500 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(notif.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    at{' '}
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{notif.message}</p>
              </div>

              {!notif.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-forest-600 dark:bg-emerald-400 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
