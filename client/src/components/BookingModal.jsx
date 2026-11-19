import React, { useState } from 'react';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';

export const BookingModal = ({
  isOpen,
  onClose,
  restaurant,
  table,
  onBookingSuccess = () => {},
}) => {
  const { user } = useAuth();
  const { fetchNotifications } = useNotifications();

  const todayStr = new Date().toISOString().split('T')[0];

  const [bookingDate, setBookingDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('19:30');
  const [partySize, setPartySize] = useState(table?.capacity || 2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen || !table || !restaurant) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await bookingsAPI.create({
        restaurantId: restaurant._id,
        tableId: table._id,
        bookingDate,
        startTime,
        partySize: parseInt(partySize, 10),
        durationMinutes: 90,
        specialRequests,
        customerName: customerName || user?.name || 'Guest',
        customerPhone: customerPhone || user?.phone || '',
      });

      if (res.data.success) {
        setConfirmedBooking(res.data.booking);
        fetchNotifications();
        onBookingSuccess(res.data.booking);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Double-booking conflict: Table is unavailable for this time.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setConfirmedBooking(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-dark-surface rounded-3xl max-w-lg w-full shadow-2xl dark:shadow-dark-card border border-stone-200 dark:border-dark-border overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-forest-900 dark:bg-forest-950 text-white px-6 py-5 flex items-center justify-between border-b border-transparent dark:border-forest-800/50">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
              Instant Seat Reservation
            </span>
            <h3 className="font-serif text-xl font-bold text-white mt-0.5">
              {restaurant.name}
            </h3>
          </div>
          <button
            onClick={handleModalClose}
            className="text-stone-300 hover:text-white p-1 rounded-full hover:bg-forest-800 dark:hover:bg-forest-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          /* Confirmation Success State */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner animate-bounce border border-emerald-300 dark:border-emerald-700/60">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
                Reservation Confirmed!
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                Your table is secured with real-time double-booking verification.
              </p>
            </div>

            <div className="bg-ivory-200 dark:bg-dark-base rounded-2xl p-4 text-left border border-stone-200 dark:border-dark-border space-y-2 text-xs">
              <div className="flex justify-between border-b border-stone-300/60 dark:border-dark-border pb-2">
                <span className="text-stone-500 dark:text-stone-400">Booking Reference:</span>
                <span className="font-mono font-bold text-forest-900 dark:text-emerald-400 text-sm">
                  {confirmedBooking.bookingReference}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Assigned Table:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {table.tableNumber} ({table.floor})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Date & Time:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {confirmedBooking.bookingDate} at {confirmedBooking.startTime} (90 mins)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Party Size:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {confirmedBooking.partySize} Guests
                </span>
              </div>
            </div>

            <button
              onClick={handleModalClose}
              className="w-full py-3 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white font-semibold transition-colors shadow-sm"
            >
              Done & View Floor Map
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Table Highlights */}
            <div className="flex items-center justify-between p-3.5 bg-forest-50 dark:bg-forest-950/40 rounded-2xl border border-forest-100 dark:border-forest-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-800 dark:bg-forest-700 text-white flex items-center justify-center font-mono font-bold text-sm">
                  {table.tableNumber}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-forest-950 dark:text-emerald-200">
                    Table {table.tableNumber} · {table.floor}
                  </h4>
                  <p className="text-xs text-forest-700 dark:text-forest-300">
                    Maximum Capacity: Up to {table.capacity} Guests
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                Available
              </span>
            </div>

            {/* Error Conflict Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Date & Time Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-forest-600 dark:text-emerald-400" /> Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-forest-600 dark:text-emerald-400" /> Arrival Time
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="12:00">12:00 PM (Lunch)</option>
                  <option value="12:30">12:30 PM (Lunch)</option>
                  <option value="13:00">01:00 PM (Lunch)</option>
                  <option value="13:30">01:30 PM (Lunch)</option>
                  <option value="18:30">06:30 PM (Dinner)</option>
                  <option value="19:00">07:00 PM (Dinner)</option>
                  <option value="19:30">07:30 PM (Dinner)</option>
                  <option value="20:00">08:00 PM (Dinner)</option>
                  <option value="20:30">08:30 PM (Dinner)</option>
                  <option value="21:00">09:00 PM (Dinner)</option>
                </select>
              </div>
            </div>

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
                {Array.from({ length: table.capacity }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest (Solo)' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            {/* Guest Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">Guest Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Primary guest name"
                  required
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98400 00000"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-forest-600 dark:text-emerald-400" /> Special Requests (Optional)
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Dietary requirements, seating preference, anniversary or birthday notes..."
                rows={2}
                maxLength={300}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-dark-border text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-forest-950/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {loading ? 'Validating Slot...' : 'Confirm Table Reservation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
