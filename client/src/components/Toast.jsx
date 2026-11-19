import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = () => {
  const { activeToast, dismissToast } = useNotifications();

  if (!activeToast) return null;

  const isSuccess = activeToast.type === 'booking_confirmed' || activeToast.type === 'queue_seated';
  const isAlert = activeToast.type === 'table_available' || activeToast.type === 'queue_notified';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full transition-all duration-300 animate-bounce-in">
      <div className="bg-white/95 dark:bg-dark-surface/95 backdrop-blur border border-forest-200 dark:border-dark-border rounded-xl shadow-elevated dark:shadow-dark-soft p-4 flex items-start gap-3">
        <div
          className={`p-2 rounded-lg shrink-0 ${
            isSuccess
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
              : isAlert
              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 animate-pulse'
              : 'bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-emerald-300'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : isAlert ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">{activeToast.title}</h4>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 leading-relaxed">{activeToast.message}</p>
        </div>

        <button
          onClick={dismissToast}
          className="text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded-md transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
