import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI, queueAPI, tablesAPI } from '../../services/api';
import { getSocket } from '../../services/socket';
import {
  Clock,
  Users,
  Bell,
  UtensilsCrossed,
  XCircle,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
} from 'lucide-react';

export const AdminQueueManagementPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [queueEntries, setQueueEntries] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  // Seating Modal
  const [seatingEntry, setSeatingEntry] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [seatingLoading, setSeatingLoading] = useState(false);

  const fetchQueueData = useCallback(async () => {
    try {
      const dashRes = await adminAPI.getDashboard();
      if (dashRes.data.success) {
        setRestaurant(dashRes.data.restaurant);
        setTables(dashRes.data.tables || []);

        const qRes = await queueAPI.getRestaurantQueue(
          dashRes.data.restaurant.id || dashRes.data.restaurant._id
        );
        if (qRes.data.success) {
          setQueueEntries(qRes.data.queue || []);
        }
      }
    } catch (err) {
      console.error('Failed to load queue data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueueData();

    const socket = getSocket();
    const handleQueueUpdate = () => {
      fetchQueueData();
    };
    const handleTablesUpdate = () => {
      fetchQueueData();
    };

    socket.on('queue:updated', handleQueueUpdate);
    socket.on('tables:updated', handleTablesUpdate);

    return () => {
      socket.off('queue:updated', handleQueueUpdate);
      socket.off('tables:updated', handleTablesUpdate);
    };
  }, [fetchQueueData]);

  const handleNotifyCustomer = async (entry) => {
    try {
      const res = await queueAPI.notify(entry._id);
      if (res.data.success) {
        setStatusMessage(`Notification dispatched to ${entry.customerName}.`);
        fetchQueueData();
        setTimeout(() => setStatusMessage(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to dispatch alert.');
    }
  };

  const handleOpenSeatModal = (entry) => {
    setSeatingEntry(entry);
    // Auto-select first matching table with capacity >= partySize
    const matching = tables.find(
      (t) => t.status === 'available' && t.capacity >= entry.partySize
    );
    setSelectedTableId(matching?._id || '');
  };

  const handleConfirmSeat = async (e) => {
    e.preventDefault();
    if (!seatingEntry || !selectedTableId) return;

    setSeatingLoading(true);
    try {
      const res = await queueAPI.seat(seatingEntry._id, selectedTableId);
      if (res.data.success) {
        setStatusMessage(
          `Customer ${seatingEntry.customerName} seated at Table. Table marked 'Occupied'.`
        );
        setSeatingEntry(null);
        setSelectedTableId('');
        fetchQueueData();
        setTimeout(() => setStatusMessage(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign table.');
    } finally {
      setSeatingLoading(false);
    }
  };

  const handleCancelEntry = async (entry) => {
    if (!window.confirm(`Remove ${entry.customerName} from the queue?`)) return;

    try {
      const res = await queueAPI.cancel(entry._id);
      if (res.data.success) {
        setStatusMessage(`${entry.customerName} removed from waitlist.`);
        fetchQueueData();
        setTimeout(() => setStatusMessage(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel queue spot.');
    }
  };

  const availableTables = tables.filter((t) => t.status === 'available');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-forest-700 dark:text-emerald-400">
            Waitlist Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">
            Virtual Queue & Waitlist
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Manage waiting walk-in and app diners, call parties, and assign tables automatically.
          </p>
        </div>

        <button
          onClick={fetchQueueData}
          className="p-2.5 rounded-xl border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-stone-50 dark:hover:bg-forest-950/60 text-stone-700 dark:text-stone-300 shadow-xs transition-colors flex items-center gap-2 text-xs font-semibold"
        >
          <RotateCw className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
          Refresh Queue
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-forest-950/70 border border-emerald-300 dark:border-emerald-600 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Available Table Summary Bar */}
      <div className="bg-forest-900 dark:bg-forest-950 text-white rounded-3xl p-5 shadow-card border border-transparent dark:border-forest-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            Floor Ready Status
            <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {availableTables.length} Tables Currently Free
            </span>
          </h3>
          <p className="text-xs text-stone-300">
            Free tables:{' '}
            {availableTables.length > 0
              ? availableTables.map((t) => `${t.tableNumber} (${t.capacity}p)`).join(', ')
              : 'None (Dining room fully occupied)'}
          </p>
        </div>

        <span className="text-xs bg-forest-800 dark:bg-forest-900 px-3 py-1.5 rounded-xl text-emerald-300 font-semibold border border-forest-700 dark:border-forest-800">
          {queueEntries.length} Parties in Queue
        </span>
      </div>

      {/* Queue List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-stone-200 dark:bg-dark-surface rounded-3xl" />
          ))}
        </div>
      ) : queueEntries.length === 0 ? (
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-12 text-center border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-2 transition-colors">
          <Clock className="w-10 h-10 text-stone-400 dark:text-stone-500 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">Virtual queue is empty</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            No customers are currently waiting in line for a table.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {queueEntries.map((entry) => {
            const isNotified = entry.status === 'notified';

            return (
              <div
                key={entry._id}
                className={`bg-white dark:bg-dark-surface rounded-3xl border p-5 shadow-card dark:shadow-dark-card hover:shadow-elevated dark:hover:shadow-dark-glow transition-all flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
                  isNotified
                    ? 'border-amber-400 dark:border-amber-600 bg-amber-50/20 dark:bg-amber-950/20 ring-2 ring-amber-200 dark:ring-amber-800/40'
                    : 'border-stone-200 dark:border-dark-border'
                }`}
              >
                {/* Left: Position & Guest Details */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-forest-900 dark:bg-forest-950 text-white flex flex-col items-center justify-center font-mono shrink-0 shadow-sm border border-transparent dark:border-forest-800">
                    <span className="text-[10px] text-emerald-400 font-sans uppercase">Pos</span>
                    <span className="text-xl font-bold font-serif">#{entry.queuePosition}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-base font-bold text-stone-900 dark:text-white">
                        {entry.customerName || 'Diner Party'}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isNotified
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800 animate-pulse'
                            : 'bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-emerald-300 border-forest-200 dark:border-forest-800'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 dark:text-stone-300">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                        Party of {entry.partySize} Guests
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-400">
                        <Clock className="w-3.5 h-3.5" />
                        Est. Wait: ~{entry.estimatedWaitMinutes} mins
                      </span>
                      {entry.customerPhone && (
                        <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                          <Phone className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                          {entry.customerPhone}
                        </span>
                      )}
                    </div>

                    {entry.notes && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 italic pt-0.5">
                        Notes: "{entry.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Staff Controls */}
                <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-dark-border">
                  <button
                    onClick={() => handleNotifyCustomer(entry)}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800/60 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    {isNotified ? 'Resend Call Alert' : 'Call / Alert Diner'}
                  </button>

                  <button
                    onClick={() => handleOpenSeatModal(entry)}
                    className="px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
                    Seat Party
                  </button>

                  <button
                    onClick={() => handleCancelEntry(entry)}
                    className="p-2 text-stone-400 dark:text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove from queue"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Seating Table Assignment Modal */}
      {seatingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-dark-surface rounded-3xl max-w-md w-full p-6 shadow-2xl dark:shadow-dark-card border border-stone-200 dark:border-dark-border space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-dark-border">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                Seat {seatingEntry.customerName}
              </h3>
              <button
                onClick={() => setSeatingEntry(null)}
                className="text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300">
              Select an available table with capacity for at least {seatingEntry.partySize} guests:
            </p>

            <form onSubmit={handleConfirmSeat} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Assign Table
                </label>
                <select
                  value={selectedTableId}
                  onChange={(e) => setSelectedTableId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="" className="dark:bg-dark-surface">-- Choose an Available Table --</option>
                  {tables
                    .filter((t) => t.status === 'available')
                    .map((t) => (
                      <option key={t._id} value={t._id} className="dark:bg-dark-surface">
                        {t.tableNumber} ({t.capacity} seats, {t.floor}){' '}
                        {t.capacity < seatingEntry.partySize ? '⚠️ Under capacity' : '✓ Compatible'}
                      </option>
                    ))}
                </select>
              </div>

              {availableTables.length === 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>No tables are currently marked 'Available'. Free up a table first.</span>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setSeatingEntry(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-dark-border text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-forest-950/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={seatingLoading || !selectedTableId}
                  className="px-5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
                >
                  {seatingLoading ? 'Seating...' : 'Confirm Seating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQueueManagementPage;
