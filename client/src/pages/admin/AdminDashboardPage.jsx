import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, tablesAPI } from '../../services/api';
import { getSocket, joinRestaurantRoom, leaveRestaurantRoom } from '../../services/socket';
import { useTheme } from '../../context/ThemeContext';
import TableBadge from '../../components/TableBadge';
import {
  Users,
  CalendarCheck,
  Clock,
  TrendingUp,
  Percent,
  RotateCw,
  Plus,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

export const AdminDashboardPage = () => {
  const { isDark } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      const [dashRes, analyticsRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAnalytics(),
      ]);

      if (dashRes.data.success) {
        setDashboardData(dashRes.data);
      }
      if (analyticsRes.data.success) {
        setAnalyticsData(analyticsRes.data);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();

    const socket = getSocket();
    const handleTablesUpdate = () => {
      fetchDashboard();
    };
    const handleQueueUpdate = () => {
      fetchDashboard();
    };

    socket.on('tables:updated', handleTablesUpdate);
    socket.on('queue:updated', handleQueueUpdate);
    socket.on('booking:updated', handleTablesUpdate);

    return () => {
      socket.off('tables:updated', handleTablesUpdate);
      socket.off('queue:updated', handleQueueUpdate);
      socket.off('booking:updated', handleTablesUpdate);
    };
  }, [fetchDashboard]);

  // Quick table status change from dashboard
  const handleQuickStatusChange = async (tableId, newStatus) => {
    try {
      const res = await tablesAPI.updateStatus(tableId, newStatus);
      if (res.data.success) {
        setStatusMessage(`Table status updated to '${newStatus}'.`);
        fetchDashboard();
        setTimeout(() => setStatusMessage(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update table status.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-stone-200 dark:bg-dark-surface rounded-3xl" />
          ))}
        </div>
        <div className="h-80 bg-stone-200 dark:bg-dark-surface rounded-3xl" />
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalTables: 10,
    availableTables: 6,
    occupiedTables: 3,
    heldTables: 1,
    reservedTables: 1,
    occupancyRate: 40,
    activeQueueCount: 2,
    todayBookingsCount: 3,
  };

  const restaurant = dashboardData?.restaurant || { name: 'Restaurant' };
  const tables = dashboardData?.tables || [];
  const activeQueue = dashboardData?.activeQueue || [];
  const recentBookings = dashboardData?.recentBookings || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-forest-900 dark:bg-forest-950 text-emerald-400 border border-transparent dark:border-forest-800">
              Staff Portal
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-stone-500 dark:text-stone-400">Live Floor Synchronization Active</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">
            {restaurant.name} Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Real-time table occupancy, queue management, and reservation throughput.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboard}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-stone-50 dark:hover:bg-forest-950/60 text-stone-700 dark:text-stone-300 shadow-xs transition-colors"
            title="Refresh dashboard"
          >
            <RotateCw className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
          </button>
          <Link
            to="/admin/tables"
            className="px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            Manage Floor Plan
          </Link>
          <Link
            to="/admin/queue"
            className="px-4 py-2.5 rounded-xl bg-forest-100 dark:bg-forest-950/80 hover:bg-forest-200 dark:hover:bg-forest-900 text-forest-900 dark:text-emerald-300 border border-forest-200/50 dark:border-forest-800 font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
            Manage Queue ({stats.activeQueueCount})
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-forest-950/70 border border-emerald-300 dark:border-emerald-600 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Total Tables */}
        <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-1 transition-colors">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
            Total Tables
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-stone-900 dark:text-white">{stats.totalTables}</span>
            <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">Floor Capacity</span>
          </div>
        </div>

        {/* Available Tables */}
        <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-emerald-200 dark:border-emerald-800/60 shadow-card dark:shadow-dark-card space-y-1 bg-gradient-to-br from-white dark:from-dark-surface to-emerald-50/40 dark:to-emerald-950/20 transition-colors">
          <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
            Available
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-emerald-900 dark:text-emerald-200">
              {stats.availableTables}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Occupied Tables */}
        <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-card dark:shadow-dark-card space-y-1 bg-gradient-to-br from-white dark:from-dark-surface to-rose-50/40 dark:to-rose-950/20 transition-colors">
          <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-400 uppercase tracking-wider block">
            Occupied
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-rose-900 dark:text-rose-200">
              {stats.occupiedTables}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
        </div>

        {/* Live Queue */}
        <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-amber-200 dark:border-amber-900/60 shadow-card dark:shadow-dark-card space-y-1 bg-gradient-to-br from-white dark:from-dark-surface to-amber-50/40 dark:to-amber-950/20 transition-colors">
          <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
            Active Queue
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-amber-900 dark:text-amber-200">
              {stats.activeQueueCount}
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">Waiting</span>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-1 col-span-2 lg:col-span-1 transition-colors">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
            Occupancy Rate
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-stone-900 dark:text-white">
              {stats.occupancyRate}%
            </span>
            <span className="text-xs text-forest-700 dark:text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Live
            </span>
          </div>
        </div>
      </div>

      {/* Visual Recharts Analytics & Trends */}
      {analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 7-Day Booking Trends */}
          <div className="lg:col-span-7 bg-white dark:bg-dark-surface p-6 rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                  7-Day Reservation Throughput
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Confirmed, Seated, and Cancelled Bookings</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest-50 dark:bg-forest-950/80 text-forest-800 dark:text-emerald-300 border border-transparent dark:border-forest-800">
                Weekly Overview
              </span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.sevenDaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: isDark ? '#9CA3AF' : '#6B7280' }} stroke={isDark ? '#2D3748' : '#E5E7EB'} />
                  <YAxis tick={{ fontSize: 11, fill: isDark ? '#9CA3AF' : '#6B7280' }} stroke={isDark ? '#2D3748' : '#E5E7EB'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#121E19' : '#FFFFFF',
                      borderRadius: '12px',
                      border: isDark ? '1px solid #1E362C' : '1px solid #E5E7EB',
                      fontSize: '12px',
                      color: isDark ? '#F1F5F3' : '#1C1917',
                    }}
                    itemStyle={{ color: isDark ? '#F1F5F3' : '#1C1917' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="confirmed" name="Confirmed" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Seated/Completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cancelled" name="Cancelled" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Peak Dining Hours */}
          <div className="lg:col-span-5 bg-white dark:bg-dark-surface p-6 rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">Peak Dining Hours</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Diner Volume Distribution</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-transparent dark:border-amber-800">
                Avg Turnover: 48m
              </span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.hourlyDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: isDark ? '#9CA3AF' : '#6B7280' }} stroke={isDark ? '#2D3748' : '#E5E7EB'} />
                  <YAxis tick={{ fontSize: 11, fill: isDark ? '#9CA3AF' : '#6B7280' }} stroke={isDark ? '#2D3748' : '#E5E7EB'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#121E19' : '#FFFFFF',
                      borderRadius: '12px',
                      border: isDark ? '1px solid #1E362C' : '1px solid #E5E7EB',
                      fontSize: '12px',
                      color: isDark ? '#F1F5F3' : '#1C1917',
                    }}
                    itemStyle={{ color: isDark ? '#F1F5F3' : '#1C1917' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    name="Reservations"
                    stroke="#10B981"
                    fill={isDark ? '#064E3B' : '#C2DFD4'}
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="walkins"
                    name="Walk-ins"
                    stroke="#F59E0B"
                    fill={isDark ? '#78350F' : '#FDE68A'}
                    fillOpacity={0.4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Live Floor Quick Grid (One-Tap Status Switching) */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card p-6 space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              Live Floor Status & One-Tap Controls
              <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60">
                Staff Controls
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Tap any status pill to immediately toggle table state and broadcast to all connected
              customer browsers.
            </p>
          </div>

          <Link
            to="/admin/tables"
            className="text-xs font-semibold text-forest-700 dark:text-emerald-400 hover:text-forest-900 dark:hover:text-emerald-300 flex items-center gap-1"
          >
            Open Floor Plan Editor →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {tables.map((table) => {
            return (
              <div
                key={table._id}
                className="p-3.5 rounded-2xl border border-stone-200 dark:border-dark-border bg-stone-50/60 dark:bg-dark-base hover:bg-stone-50 dark:hover:bg-forest-950/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                    {table.tableNumber}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">{table.capacity} Seats</span>
                </div>

                <div className="flex items-center justify-center py-1">
                  <TableBadge status={table.status} size="sm" />
                </div>

                {/* Quick Toggle Buttons */}
                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-stone-200/60 dark:border-dark-border text-[10px] font-semibold text-center">
                  <button
                    onClick={() => handleQuickStatusChange(table._id, 'available')}
                    className={`py-1 rounded-md transition-colors ${
                      table.status === 'available'
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white font-bold'
                        : 'bg-white dark:bg-dark-surface hover:bg-emerald-50 dark:hover:bg-forest-950 text-emerald-800 dark:text-emerald-300 border border-stone-200 dark:border-dark-border'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => handleQuickStatusChange(table._id, 'occupied')}
                    className={`py-1 rounded-md transition-colors ${
                      table.status === 'occupied'
                        ? 'bg-rose-600 text-white font-bold'
                        : 'bg-white dark:bg-dark-surface hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-stone-200 dark:border-dark-border'
                    }`}
                  >
                    Occ
                  </button>
                  <button
                    onClick={() => handleQuickStatusChange(table._id, 'reserved')}
                    className={`py-1 rounded-md transition-colors ${
                      table.status === 'reserved'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-white dark:bg-dark-surface hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-stone-200 dark:border-dark-border'
                    }`}
                  >
                    Res
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Active Queue & Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Virtual Queue */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">Active Virtual Queue</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">Waiting Diners in FIFO Order</p>
            </div>
            <Link
              to="/admin/queue"
              className="text-xs font-semibold text-forest-700 dark:text-emerald-400 hover:text-forest-900 dark:hover:text-emerald-300"
            >
              Full Queue →
            </Link>
          </div>

          {activeQueue.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400 dark:text-stone-500">
              No customers currently waiting in the virtual queue.
            </div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-dark-border">
              {activeQueue.slice(0, 5).map((q) => (
                <div key={q._id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-forest-100 dark:bg-forest-950/80 text-forest-900 dark:text-emerald-300 font-bold flex items-center justify-center text-xs border border-transparent dark:border-forest-800">
                      #{q.queuePosition}
                    </span>
                    <div>
                      <h5 className="font-semibold text-stone-900 dark:text-stone-100">{q.customerName}</h5>
                      <span className="text-stone-500 dark:text-stone-400">Party of {q.partySize} · ~{q.estimatedWaitMinutes}m wait</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-transparent dark:border-amber-800">
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reservations */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">Recent Bookings</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">Latest customer table reservations</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-semibold text-forest-700 dark:text-emerald-400 hover:text-forest-900 dark:hover:text-emerald-300"
            >
              View All Bookings →
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400 dark:text-stone-500">No bookings recorded yet.</div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-dark-border overflow-x-auto">
              {recentBookings.map((b) => (
                <div
                  key={b._id}
                  className="py-3 flex items-center justify-between gap-4 text-xs min-w-[420px]"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-forest-900 dark:text-emerald-400">
                        {b.bookingReference}
                      </span>
                      <span className="text-stone-400 dark:text-stone-600">·</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{b.customerName || 'Diner'}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Table {b.tableId?.tableNumber} · {b.bookingDate} at {b.startTime} ({b.partySize} Guests)
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        : b.status === 'seated'
                        ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                        : 'bg-stone-100 dark:bg-dark-base text-stone-700 dark:text-stone-300 border-stone-200 dark:border-dark-border'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
