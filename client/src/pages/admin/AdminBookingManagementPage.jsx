import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI, bookingsAPI } from '../../services/api';
import { getSocket } from '../../services/socket';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  RotateCw,
  Users,
  UtensilsCrossed,
  Check,
} from 'lucide-react';

export const AdminBookingManagementPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const fetchBookings = useCallback(async () => {
    try {
      const dashRes = await adminAPI.getDashboard();
      if (dashRes.data.success) {
        const rest = dashRes.data.restaurant;
        setRestaurant(rest);

        const params = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        if (dateFilter) params.date = dateFilter;
        if (search.trim()) params.search = search.trim();

        const bookRes = await bookingsAPI.getRestaurantBookings(rest.id || rest._id, params);
        if (bookRes.data.success) {
          setBookings(bookRes.data.bookings || []);
        }
      }
    } catch (err) {
      console.error('Failed to load restaurant bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFilter, search]);

  useEffect(() => {
    fetchBookings();

    const socket = getSocket();
    const handleUpdate = () => {
      fetchBookings();
    };

    socket.on('booking:updated', handleUpdate);
    return () => {
      socket.off('booking:updated', handleUpdate);
    };
  }, [fetchBookings]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await bookingsAPI.updateStatus(bookingId, newStatus);
      if (res.data.success) {
        setStatusMessage(`Booking marked as '${newStatus}'. Table status updated.`);
        fetchBookings();
        setTimeout(() => setStatusMessage(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-forest-700 dark:text-emerald-400">
            Host & Reception Desk
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">
            Reservation Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Verify guest arrivals, seat parties, and manage table reservations in real time.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="p-2.5 rounded-xl border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-stone-50 dark:hover:bg-forest-950/60 text-stone-700 dark:text-stone-300 shadow-xs transition-colors flex items-center gap-2 text-xs font-semibold"
        >
          <RotateCw className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
          Refresh
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-forest-950/70 border border-emerald-300 dark:border-emerald-600 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-5 border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card grid grid-cols-1 sm:grid-cols-12 gap-3 items-center transition-colors">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, ref code, or phone..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-2xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-2xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none"
          >
            <option value="all" className="dark:bg-dark-surface">All Reservation Statuses</option>
            <option value="confirmed" className="dark:bg-dark-surface">Confirmed</option>
            <option value="seated" className="dark:bg-dark-surface">Seated at Table</option>
            <option value="completed" className="dark:bg-dark-surface">Completed Dining</option>
            <option value="cancelled" className="dark:bg-dark-surface">Cancelled</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="sm:col-span-3">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-2xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Bookings Table / Cards */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-stone-200 dark:bg-dark-surface rounded-3xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-12 text-center border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-2 transition-colors">
          <Calendar className="w-10 h-10 text-stone-400 dark:text-stone-500 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">No reservations found</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            No bookings match your current search and filter combination.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const isConfirmed = booking.status === 'confirmed';
            const isSeated = booking.status === 'seated';

            return (
              <div
                key={booking._id}
                className="bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border p-5 shadow-card dark:shadow-dark-card hover:shadow-elevated dark:hover:shadow-dark-glow transition-all flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
              >
                {/* Details */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-forest-900 dark:bg-forest-950 text-white flex flex-col items-center justify-center font-mono shrink-0 shadow-sm border border-transparent dark:border-forest-800">
                    <span className="text-[9px] text-emerald-300 uppercase">Table</span>
                    <span className="text-sm font-bold">
                      {booking.tableId?.tableNumber || 'T-??'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-forest-900 dark:text-emerald-300 bg-forest-50 dark:bg-forest-950/80 px-2 py-0.5 rounded-md border border-forest-200 dark:border-forest-800">
                        {booking.bookingReference}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isConfirmed
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : isSeated
                            ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                            : booking.status === 'cancelled'
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                            : 'bg-stone-100 dark:bg-dark-base text-stone-800 dark:text-stone-300 border-stone-200 dark:border-dark-border'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                      {booking.customerName || 'Diner Guest'}{' '}
                      <span className="font-sans text-xs font-normal text-stone-500 dark:text-stone-400">
                        ({booking.customerPhone || 'No phone provided'})
                      </span>
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 dark:text-stone-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                        {booking.bookingDate} at {booking.startTime} - {booking.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                        {booking.partySize} Guests
                      </span>
                      <span className="text-stone-400 dark:text-stone-600">·</span>
                      <span className="text-stone-500 dark:text-stone-400">{booking.tableId?.floor || 'Main Floor'}</span>
                    </div>

                    {booking.specialRequests && (
                      <p className="text-xs text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60 inline-block mt-1">
                        Requests: "{booking.specialRequests}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Staff Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-dark-border">
                  {isConfirmed && (
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'seated')}
                      className="px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
                      Seat at Table
                    </button>
                  )}

                  {isSeated && (
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'completed')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Dining Done
                    </button>
                  )}

                  {isConfirmed && (
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminBookingManagementPage;
