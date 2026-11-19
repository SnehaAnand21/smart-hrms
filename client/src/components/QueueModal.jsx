import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { queueAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Clock, Users, X, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const QueueModal = ({
  isOpen,
  onClose,
  restaurant,
  initialPartySize = 2,
  onQueueSuccess = () => {},
}) => {
  const { user } = useAuth();
  const { fetchNotifications } = useNotifications();
  const navigate = useNavigate();

  const [partySize, setPartySize] = useState(initialPartySize);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !restaurant) return null;

  // Approximate wait time calculation preview
  const estimatedWait = Math.max(10, partySize * 5 + 5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await queueAPI.join({
        restaurantId: restaurant._id,
        partySize: parseInt(partySize, 10),
        customerName: customerName || user?.name || 'Guest',
        customerPhone: customerPhone || user?.phone || '',
        notes,
      });

      if (res.data.success) {
        fetchNotifications();
        onQueueSuccess(res.data.queueEntry);
        onClose();
        navigate('/virtual-queue');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to join virtual queue.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-dark-surface rounded-3xl max-w-md w-full shadow-2xl dark:shadow-dark-card border border-stone-200 dark:border-dark-border overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-forest-900 dark:bg-forest-950 text-white px-6 py-5 flex items-center justify-between border-b border-transparent dark:border-forest-800/50">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
              Virtual Queue Entry
            </span>
            <h3 className="font-serif text-xl font-bold text-white mt-0.5">{restaurant.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 rounded-full hover:bg-forest-800 dark:hover:bg-forest-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Wait Time Preview Banner */}
          <div className="bg-emerald-50 dark:bg-forest-950/60 rounded-2xl p-4 border border-emerald-200 dark:border-forest-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium block">
                  Deterministic Wait Estimate
                </span>
                <span className="text-lg font-bold text-emerald-950 dark:text-emerald-200 font-serif">
                  ~{estimatedWait} mins
                </span>
              </div>
            </div>
            <span className="text-[10px] font-semibold uppercase px-2 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-md border border-emerald-300 dark:border-emerald-700/60">
              Live Queue
            </span>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Party Size */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-forest-600 dark:text-emerald-400" /> Party Size
            </label>
            <select
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest (Solo Diner)' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Name & Phone */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">Diner Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full name"
                required
                className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Contact Phone (For SMS/Alert)
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98401 22334"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Dining Notes / High-Chair Requirement
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Need high chair, fine with bar seating or terrace..."
              rows={2}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
            You will receive live in-app notifications and WebSocket alerts as your position
            advances and when your table is ready.
          </p>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-dark-border text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-forest-950/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading ? 'Joining Queue...' : 'Join Virtual Queue'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QueueModal;
