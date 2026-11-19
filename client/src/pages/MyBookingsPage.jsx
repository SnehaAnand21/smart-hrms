import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import {
  CalendarCheck,
  Clock,
  Users,
  MapPin,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ArrowRight,
  FileText,
} from 'lucide-react';

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('upcoming'); // 'upcoming', 'past', 'cancelled'
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const { fetchNotifications } = useNotifications();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingsAPI.getMy();
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setCancellingBookingId(cancelModalBooking._id);

    try {
      const res = await bookingsAPI.cancel(
        cancelModalBooking._id,
        cancelReason || 'Cancelled by customer'
      );
      if (res.data.success) {
        setActionMessage(
          `Reservation ${cancelModalBooking.bookingReference} cancelled. Table released back to live availability.`
        );
        fetchBookings();
        fetchNotifications();
        setCancelModalBooking(null);
        setCancelReason('');
        setTimeout(() => setActionMessage(''), 6000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel reservation.');
    } finally {
      setCancellingBookingId(null);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'cancelled') {
      return b.status === 'cancelled';
    }
    if (filterTab === 'past') {
      return b.status === 'completed' || (b.bookingDate < todayStr && b.status !== 'cancelled');
    }
    // upcoming
    return (
      (b.status === 'confirmed' || b.status === 'pending' || b.status === 'seated') &&
      b.bookingDate >= todayStr
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-forest-700 dark:text-emerald-400">
            Diner Reservation Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">My Table Bookings</h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Track confirmed seat reservations, review references, or release tables in real time.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="px-4 py-2 rounded-xl border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-stone-50 dark:hover:bg-forest-950/60 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
          Refresh
        </button>
      </div>

      {/* Success Banner */}
      {actionMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-forest-950/70 border border-emerald-300 dark:border-emerald-600 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="border-b border-stone-200 dark:border-dark-border flex gap-4 text-xs font-semibold">
        <button
          onClick={() => setFilterTab('upcoming')}
          className={`pb-3 border-b-2 transition-all ${
            filterTab === 'upcoming'
              ? 'border-forest-900 dark:border-emerald-400 text-forest-900 dark:text-emerald-400 font-bold'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Upcoming Bookings (
          {
            bookings.filter(
              (b) =>
                (b.status === 'confirmed' || b.status === 'seated') && b.bookingDate >= todayStr
            ).length
          }
          )
        </button>
        <button
          onClick={() => setFilterTab('past')}
          className={`pb-3 border-b-2 transition-all ${
            filterTab === 'past'
              ? 'border-forest-900 dark:border-emerald-400 text-forest-900 dark:text-emerald-400 font-bold'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Past & Completed
        </button>
        <button
          onClick={() => setFilterTab('cancelled')}
          className={`pb-3 border-b-2 transition-all ${
            filterTab === 'cancelled'
              ? 'border-forest-900 dark:border-emerald-400 text-forest-900 dark:text-emerald-400 font-bold'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Cancelled Reservations
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-stone-200 dark:bg-dark-surface rounded-3xl" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-12 text-center border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-4 transition-colors">
          <CalendarCheck className="w-12 h-12 text-stone-400 dark:text-stone-500 mx-auto" />
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
              No {filterTab} bookings found
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
              Ready to dine out? Explore partner restaurants and reserve an available table.
            </p>
          </div>
          <Link
            to="/restaurants"
            className="inline-block px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Explore Restaurants Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isConfirmed = b.status === 'confirmed';
            const isCancelled = b.status === 'cancelled';
            const isSeated = b.status === 'seated';

            return (
              <div
                key={b._id}
                className="bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border p-5 sm:p-6 shadow-card dark:shadow-dark-card hover:shadow-elevated dark:hover:shadow-dark-glow transition-all flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6"
              >
                {/* Left: Info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-forest-900 dark:bg-forest-950 text-white shrink-0 flex flex-col items-center justify-center font-mono shadow-sm border border-transparent dark:border-forest-800">
                    <span className="text-[10px] text-emerald-300 font-sans uppercase">Table</span>
                    <span className="text-sm font-bold">{b.tableId?.tableNumber || 'T-??'}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-forest-800 dark:text-emerald-300 bg-forest-50 dark:bg-forest-950/80 px-2 py-0.5 rounded-md border border-forest-200 dark:border-forest-800">
                        {b.bookingReference}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                          isConfirmed
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : isSeated
                            ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                            : isCancelled
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                            : 'bg-stone-100 dark:bg-dark-base text-stone-800 dark:text-stone-300 border-stone-300 dark:border-dark-border'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                      {b.restaurantId?.name || 'Restaurant'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 dark:text-stone-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                        {b.bookingDate} at {b.startTime} - {b.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                        {b.partySize} Guests
                      </span>
                      <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                        {b.restaurantId?.address?.area || 'Chennai'}
                      </span>
                    </div>

                    {b.specialRequests && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 italic pt-1">
                        Note: "{b.specialRequests}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-dark-border">
                  {b.restaurantId?._id && (
                    <Link
                      to={`/restaurants/${b.restaurantId._id}`}
                      className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-dark-base hover:bg-stone-200 dark:hover:bg-forest-950/60 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors border border-transparent dark:border-dark-border"
                    >
                      View Live Map
                    </Link>
                  )}

                  {isConfirmed && (
                    <button
                      onClick={() => setCancelModalBooking(b)}
                      className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1 border border-rose-200 dark:border-rose-900"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-dark-surface rounded-3xl max-w-md w-full p-6 shadow-2xl dark:shadow-dark-card border border-stone-200 dark:border-dark-border space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/70 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">Cancel Reservation?</h3>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Are you sure you want to cancel booking <strong>{cancelModalBooking.bookingReference}</strong> at{' '}
              <strong>{cancelModalBooking.restaurantId?.name}</strong>? The table will immediately
              become available on the live seat map and may be assigned to waiting queue diners.
            </p>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Reason for cancellation (Optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Change of schedule, guest unavailable, etc."
                rows={2}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 dark:border-dark-border text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-forest-950/50"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                disabled={cancellingBookingId === cancelModalBooking._id}
                onClick={handleCancelBooking}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {cancellingBookingId === cancelModalBooking._id
                  ? 'Releasing Table...'
                  : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
