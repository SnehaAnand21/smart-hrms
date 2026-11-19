import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { queueAPI } from '../services/api';
import { getSocket } from '../services/socket';
import { useNotifications } from '../context/NotificationContext';
import {
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCw,
  Bell,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const VirtualQueuePage = () => {
  const [activeEntries, setActiveEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leavingId, setLeavingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const { fetchNotifications } = useNotifications();

  const fetchQueue = useCallback(async () => {
    try {
      const res = await queueAPI.getMyStatus();
      if (res.data.success) {
        setActiveEntries(res.data.entries || []);
      }
    } catch (err) {
      console.error('Failed to load virtual queue status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();

    const socket = getSocket();
    const handleQueueUpdate = () => {
      fetchQueue();
    };

    socket.on('queue:updated', handleQueueUpdate);

    return () => {
      socket.off('queue:updated', handleQueueUpdate);
    };
  }, [fetchQueue]);

  const handleLeaveQueue = async (id) => {
    setLeavingId(id);
    try {
      const res = await queueAPI.cancel(id);
      if (res.data.success) {
        setStatusMessage('You have left the virtual queue.');
        fetchQueue();
        fetchNotifications();
        setTimeout(() => setStatusMessage(''), 5000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to leave queue.');
    } finally {
      setLeavingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-forest-700 dark:text-emerald-400">
            Intelligent Waitlist Tracking
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">
            Live Virtual Queue Status
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Synchronized queue progress powered by our deterministic table turnover algorithm.
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="px-4 py-2 rounded-xl border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-stone-50 dark:hover:bg-forest-950/60 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
          Refresh Status
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-forest-950/70 border border-emerald-300 dark:border-emerald-600 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-64 bg-stone-200 dark:bg-dark-surface rounded-3xl" />
        </div>
      ) : activeEntries.length === 0 ? (
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-12 text-center border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-4 transition-colors">
          <div className="w-16 h-16 rounded-full bg-forest-50 dark:bg-forest-950/80 text-forest-800 dark:text-emerald-400 flex items-center justify-center mx-auto border border-forest-100 dark:border-forest-800">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
              You are not currently waiting in any queue
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
              If your desired restaurant has all tables occupied, you can step into their virtual
              queue directly from the live floor map.
            </p>
          </div>
          <Link
            to="/restaurants"
            className="inline-block px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Explore Restaurants
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {activeEntries.map((entry) => {
            const isNotified = entry.status === 'notified';
            const isSeated = entry.status === 'seated';

            return (
              <div
                key={entry._id}
                className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-forest-200 dark:border-dark-border shadow-elevated dark:shadow-dark-card p-6 sm:p-8 overflow-hidden relative space-y-6 transition-colors"
              >
                {/* Status Indicator Banner */}
                {isNotified && (
                  <div className="bg-amber-500 text-white p-3 rounded-2xl flex items-center justify-between text-xs font-semibold animate-pulse shadow-sm">
                    <span className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Host Alert: Your table is almost ready! Please approach the podium.
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                      Action Required
                    </span>
                  </div>
                )}

                {/* Queue Primary Card Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-emerald-300 border border-forest-200 dark:border-forest-800">
                        Virtual Queue Active
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
                      {entry.restaurantId?.name || 'Restaurant'}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Joined at {new Date(entry.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Party of {entry.partySize} Guests
                    </p>
                  </div>

                  {/* Position Badge & Wait */}
                  <div className="flex items-center gap-4 bg-forest-50 dark:bg-dark-base p-4 rounded-2xl border border-forest-100 dark:border-dark-border">
                    <div className="text-center pr-3 border-r border-forest-200 dark:border-dark-border">
                      <span className="text-[10px] uppercase font-bold text-forest-700 dark:text-emerald-400 block">
                        Position
                      </span>
                      <span className="font-serif text-3xl font-bold text-forest-950 dark:text-emerald-200">
                        #{entry.queuePosition}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] uppercase font-bold text-forest-700 dark:text-emerald-400 block">
                        Est. Wait
                      </span>
                      <span className="font-serif text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                        ~{entry.estimatedWaitMinutes}m
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Progress Steps */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    Queue Progression
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>1. Joined in Queue</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl border flex items-center gap-2.5 font-semibold ${
                        isNotified || isSeated
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                          : 'bg-forest-100 dark:bg-forest-950/70 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-emerald-300 animate-pulse'
                      }`}
                    >
                      <Clock className="w-4 h-4 shrink-0 text-forest-700 dark:text-emerald-400" />
                      <span>2. In Line Waiting (#{entry.queuePosition})</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl border flex items-center gap-2.5 font-semibold ${
                        isNotified
                          ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 animate-bounce'
                          : isSeated
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                          : 'bg-stone-50 dark:bg-dark-base border-stone-200 dark:border-dark-border text-stone-400 dark:text-stone-500'
                      }`}
                    >
                      <Bell className="w-4 h-4 shrink-0" />
                      <span>3. Host Ready & Seating</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-stone-100 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-stone-500 dark:text-stone-400">
                    Live updates are automatically pushed via Socket.IO. You don't need to refresh.
                  </span>

                  <button
                    onClick={() => handleLeaveQueue(entry._id)}
                    disabled={leavingId === entry._id}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    {leavingId === entry._id ? 'Leaving...' : 'Leave Virtual Queue'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VirtualQueuePage;
