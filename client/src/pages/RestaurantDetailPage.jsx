import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantsAPI } from '../services/api';
import { getSocket, joinRestaurantRoom, leaveRestaurantRoom } from '../services/socket';
import FloorPlanMap from '../components/FloorPlanMap';
import BookingModal from '../components/BookingModal';
import QueueModal from '../components/QueueModal';
import TableBadge from '../components/TableBadge';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Clock,
  Phone,
  Star,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RotateCw,
  ArrowRight,
  Utensils,
} from 'lucide-react';

export const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeZone, setActiveZone] = useState('all');
  const [partySizeFilter, setPartySizeFilter] = useState('');

  // Selected table for booking
  const [selectedTable, setSelectedTable] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [queuePartySize, setQueuePartySize] = useState(2);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  const fetchDetails = useCallback(async () => {
    try {
      const [restRes, tablesRes] = await Promise.all([
        restaurantsAPI.getById(id),
        restaurantsAPI.getTables(id),
      ]);

      if (restRes.data.success) {
        setRestaurant(restRes.data.restaurant);
      }
      if (tablesRes.data.success) {
        setTables(tablesRes.data.tables || []);
      }
      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Failed to load restaurant details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();

    // Socket.IO real-time subscription
    joinRestaurantRoom(id);
    const socket = getSocket();

    const handleTablesUpdate = (data) => {
      console.log('[Socket.IO] Real-time table update received:', data);
      // Refresh authoritative tables from server
      fetchDetails();
    };

    socket.on('tables:updated', handleTablesUpdate);

    return () => {
      socket.off('tables:updated', handleTablesUpdate);
      leaveRestaurantRoom(id);
    };
  }, [id, fetchDetails]);

  const handleTableSelect = (table) => {
    if (table.status === 'available') {
      setSelectedTable(table);
    }
  };

  const handleOpenBookingModal = () => {
    if (!selectedTable) return;
    setBookingModalOpen(true);
  };

  const handleOpenQueueModal = (pSize = 2) => {
    setQueuePartySize(pSize);
    setQueueModalOpen(true);
  };

  // Filter tables by party size if specified
  const displayedTables = tables.filter((t) => {
    if (!partySizeFilter) return true;
    const reqCap = parseInt(partySizeFilter, 10);
    return t.capacity >= reqCap;
  });

  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const heldCount = tables.filter((t) => t.status === 'held').length;
  const reservedCount = tables.filter((t) => t.status === 'reserved').length;
  const totalCount = tables.length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-64 bg-stone-200 dark:bg-dark-surface rounded-3xl" />
        <div className="h-96 bg-stone-200 dark:bg-dark-surface rounded-3xl" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">Restaurant Not Found</h2>
        <p className="text-xs text-stone-600 dark:text-stone-400">The requested dining establishment does not exist.</p>
        <Link
          to="/restaurants"
          className="inline-block px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white text-xs font-semibold"
        >
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Restaurant Hero Profile */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card overflow-hidden transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Gallery Image */}
          <div className="lg:col-span-5 h-64 lg:h-auto relative overflow-hidden bg-stone-100 dark:bg-dark-base">
            <img
              src={restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000'}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000';
              }}
            />
            <div className="absolute top-4 left-4 bg-forest-950/90 dark:bg-dark-base/90 text-white backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm border border-transparent dark:border-forest-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Seat Tracking Active</span>
            </div>
          </div>

          {/* Restaurant Details */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-emerald-300 text-xs font-bold border border-forest-200 dark:border-forest-800">
                    {restaurant.priceRange || '$$'} Fine Dining
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-stone-800 dark:text-stone-200 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{restaurant.rating.toFixed(1)}</span>
                    <span className="text-stone-400 dark:text-stone-500 font-normal">({restaurant.reviewCount || 120})</span>
                  </div>
                </div>

                {/* Live Sync Status */}
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Synced {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  <button
                    onClick={fetchDetails}
                    title="Manual refresh"
                    className="p-1 text-stone-400 dark:text-stone-500 hover:text-forest-900 dark:hover:text-emerald-300 transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
                {restaurant.name}
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {restaurant.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-forest-700 dark:text-emerald-400 shrink-0" />
                  <span>
                    {restaurant.address?.street}, {restaurant.address?.area}, {restaurant.address?.city}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-forest-700 dark:text-emerald-400 shrink-0" />
                  <span>
                    Open: {restaurant.openingHours?.open} - {restaurant.openingHours?.close} daily
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-forest-700 dark:text-emerald-400 shrink-0" />
                  <span>{restaurant.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Verified Table Availability</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {restaurant.features?.map((f) => (
                  <span
                    key={f}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-ivory-300 dark:bg-dark-base text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-dark-border"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-4 border-t border-stone-100 dark:border-dark-border grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-forest-50 dark:bg-forest-950/40 border border-forest-100 dark:border-forest-800/60">
                <span className="text-[10px] text-forest-700 dark:text-emerald-400 block font-semibold">Total</span>
                <span className="text-base font-bold text-forest-950 dark:text-emerald-200 font-serif">{totalCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block font-semibold">Available</span>
                <span className="text-base font-bold text-emerald-950 dark:text-emerald-200 font-serif">{availableCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60">
                <span className="text-[10px] text-rose-800 dark:text-rose-300 block font-semibold">Occupied</span>
                <span className="text-base font-bold text-rose-950 dark:text-rose-200 font-serif">{occupiedCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60">
                <span className="text-[10px] text-indigo-800 dark:text-indigo-300 block font-semibold">Reserved</span>
                <span className="text-base font-bold text-indigo-950 dark:text-indigo-200 font-serif">{reservedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Plan Controls Bar */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-4 sm:p-5 border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors">
        {/* Zone Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 pr-2 shrink-0">Zone:</span>
          {['all', 'Main Dining', 'VIP Bay', 'Outdoor Terrace'].map((zone) => (
            <button
              key={zone}
              onClick={() => setActiveZone(zone)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors ${
                activeZone === zone
                  ? 'bg-forest-900 dark:bg-forest-700 text-white font-semibold shadow-xs'
                  : 'bg-stone-100 dark:bg-dark-base text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-forest-950/60 border border-transparent dark:border-dark-border'
              }`}
            >
              {zone === 'all' ? 'All Floor Zones' : zone}
            </button>
          ))}
        </div>

        {/* Party size filter & Virtual Queue trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-forest-700 dark:text-emerald-400 shrink-0" />
            <select
              value={partySizeFilter}
              onChange={(e) => setPartySizeFilter(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none"
            >
              <option value="" className="dark:bg-dark-surface">Any Party Size</option>
              <option value="2" className="dark:bg-dark-surface">Table for 2</option>
              <option value="4" className="dark:bg-dark-surface">Table for 4</option>
              <option value="6" className="dark:bg-dark-surface">Table for 6</option>
              <option value="8" className="dark:bg-dark-surface">Table for 8+</option>
            </select>
          </div>

          <button
            onClick={() => handleOpenQueueModal(parseInt(partySizeFilter, 10) || 2)}
            className="px-4 py-1.5 rounded-xl bg-forest-100 dark:bg-forest-950/80 text-forest-900 dark:text-emerald-300 hover:bg-forest-200 dark:hover:bg-forest-900 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 border border-forest-200/50 dark:border-forest-800"
          >
            <Clock className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
            Join Virtual Queue
          </button>
        </div>
      </div>

      {/* Selected Table Action Banner */}
      {selectedTable && (
        <div className="p-4 bg-emerald-50 dark:bg-forest-950/70 border-2 border-emerald-400 dark:border-emerald-500 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md dark:shadow-dark-card animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-mono font-bold text-base shadow-sm">
              {selectedTable.tableNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm">
                  Table {selectedTable.tableNumber} Selected
                </h4>
                <TableBadge status={selectedTable.status} />
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                Capacity: {selectedTable.capacity} Guests · Floor: {selectedTable.floor}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedTable(null)}
              className="px-3 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-emerald-100 dark:hover:bg-forest-900/60 transition-colors"
            >
              Deselect
            </button>
            <button
              onClick={handleOpenBookingModal}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Book Table {selectedTable.tableNumber}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2D Interactive Seat Map Component */}
      <FloorPlanMap
        tables={displayedTables}
        selectedTable={selectedTable}
        onSelectTable={handleTableSelect}
        onJoinQueue={handleOpenQueueModal}
        activeZone={activeZone}
      />

      {/* Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        restaurant={restaurant}
        table={selectedTable}
        onBookingSuccess={() => {
          setSelectedTable(null);
          fetchDetails();
        }}
      />

      <QueueModal
        isOpen={queueModalOpen}
        onClose={() => setQueueModalOpen(false)}
        restaurant={restaurant}
        initialPartySize={queuePartySize}
        onQueueSuccess={() => {
          fetchDetails();
        }}
      />
    </div>
  );
};

export default RestaurantDetailPage;
