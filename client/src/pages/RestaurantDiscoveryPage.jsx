import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { restaurantsAPI } from '../services/api';
import TableBadge from '../components/TableBadge';
import {
  Search,
  Filter,
  Users,
  Star,
  MapPin,
  Clock,
  RotateCcw,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export const RestaurantDiscoveryPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const initialSearch = searchParams.get('search') || '';
  const initialCuisine = searchParams.get('cuisine') || '';

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(initialSearch);
  const [cuisine, setCuisine] = useState(initialCuisine);
  const [partySize, setPartySize] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('rating');
  const [availableOnly, setAvailableOnly] = useState(false);

  const cuisinesList = [
    'South Indian',
    'Italian',
    'Japanese',
    'Pan-Asian',
    'North Indian',
    'Continental',
    'Cafe',
  ];

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (cuisine) params.cuisine = cuisine;
      if (partySize) params.partySize = partySize;
      if (minRating) params.minRating = minRating;
      if (sort) params.sort = sort;
      if (availableOnly) params.availableOnly = 'true';

      const res = await restaurantsAPI.getAll(params);
      if (res.data.success) {
        setRestaurants(res.data.restaurants || []);
      }
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [cuisine, partySize, minRating, sort, availableOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  const handleReset = () => {
    setSearch('');
    setCuisine('');
    setPartySize('');
    setMinRating('');
    setSort('rating');
    setAvailableOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-emerald-300 border border-forest-200 dark:border-forest-800">
            Real-Time Table Discovery
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-stone-500 dark:text-stone-400">Live Availability Feed</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white tracking-tight">
          Explore Restaurants with Genuine Seat Visibility
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl">
          Browse floor availability across curated Chennai dining destinations. Pick your table in
          real time or join virtual queues directly from the live map.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-5 border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-4 transition-colors">
        {/* Search input & Primary controls */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by restaurant name, area (e.g. Guindy, Alwarpet, Nungambakkam)..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 border border-stone-300 dark:border-dark-border hover:bg-stone-50 dark:hover:bg-forest-950/50 text-stone-700 dark:text-stone-300 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            Reset
          </button>
        </form>

        {/* Cuisine Filter Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 pr-2 shrink-0">Cuisine:</span>
          <button
            onClick={() => setCuisine('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors ${
              cuisine === ''
                ? 'bg-forest-900 dark:bg-forest-700 text-white font-semibold'
                : 'bg-stone-100 dark:bg-dark-base text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-forest-950/60 border border-transparent dark:border-dark-border'
            }`}
          >
            All
          </button>
          {cuisinesList.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c === cuisine ? '' : c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors ${
                cuisine === c
                  ? 'bg-forest-900 dark:bg-forest-700 text-white font-semibold'
                  : 'bg-stone-100 dark:bg-dark-base text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-forest-950/60 border border-transparent dark:border-dark-border'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Refinement dropdowns */}
        <div className="pt-2 border-t border-stone-100 dark:border-dark-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Party Size */}
          <div>
            <label className="block text-stone-500 dark:text-stone-400 font-medium mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-forest-600 dark:text-emerald-400" /> Party Size
            </label>
            <select
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
            >
              <option value="" className="dark:bg-dark-surface">Any Size</option>
              <option value="2" className="dark:bg-dark-surface">2 Guests (Table for 2)</option>
              <option value="4" className="dark:bg-dark-surface">4 Guests (Table for 4)</option>
              <option value="6" className="dark:bg-dark-surface">6 Guests (Table for 6)</option>
              <option value="8" className="dark:bg-dark-surface">8+ Guests (VIP Bay)</option>
            </select>
          </div>

          {/* Min Rating */}
          <div>
            <label className="block text-stone-500 dark:text-stone-400 font-medium mb-1 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500" /> Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
            >
              <option value="" className="dark:bg-dark-surface">All Ratings</option>
              <option value="4.5" className="dark:bg-dark-surface">4.5+ Stars</option>
              <option value="4.0" className="dark:bg-dark-surface">4.0+ Stars</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-stone-500 dark:text-stone-400 font-medium mb-1">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
            >
              <option value="rating" className="dark:bg-dark-surface">Highest Rated</option>
              <option value="name" className="dark:bg-dark-surface">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Available Only Checkbox */}
          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="availOnly"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-4 h-4 rounded text-forest-700 dark:text-emerald-500 focus:ring-forest-500 border-stone-300 dark:border-dark-border dark:bg-dark-base"
            />
            <label htmlFor="availOnly" className="text-xs font-semibold text-stone-800 dark:text-stone-200 select-none cursor-pointer">
              Only Show Free Seats
            </label>
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-stone-200 dark:bg-dark-surface rounded-3xl" />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-12 text-center border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-4 transition-colors">
          <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-dark-base text-stone-400 dark:text-stone-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
              No matching restaurants found
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
              We couldn't find any dining spots matching your exact filters. Try loosening your
              party size or clearing the cuisine filter.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => {
            const avail = restaurant.availabilitySummary || {
              totalTables: 10,
              availableTables: 6,
              occupiedTables: 3,
            };
            const hasFree = avail.availableTables > 0;

            return (
              <div
                key={restaurant._id}
                className="bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border overflow-hidden shadow-card dark:shadow-dark-card hover:shadow-elevated dark:hover:shadow-dark-glow transition-all duration-300 flex flex-col group"
              >
                {/* Photo & Top Floating Badges */}
                <div className="relative h-48 overflow-hidden bg-stone-100 dark:bg-dark-base">
                  <img
                    src={restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1 shadow-sm border border-transparent dark:border-dark-border">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{restaurant.rating.toFixed(1)}</span>
                  </div>

                  {/* Live Seat Availability Pill */}
                  <div
                    className={`absolute bottom-3 left-3 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm ${
                      hasFree
                        ? 'bg-forest-950/90 dark:bg-dark-base/90 text-white border border-forest-800'
                        : 'bg-rose-950/90 dark:bg-rose-950/90 text-rose-200 border border-rose-800'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        hasFree ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                      }`}
                    />
                    <span>
                      {hasFree
                        ? `${avail.availableTables} of ${avail.totalTables} Tables Available`
                        : 'House Full · Virtual Queue Open'}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white group-hover:text-forest-800 dark:group-hover:text-emerald-400 transition-colors">
                      {restaurant.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
                      {restaurant.address?.street}, {restaurant.address?.area}
                    </p>
                    <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 pt-1 leading-relaxed">
                      {restaurant.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {restaurant.cuisine?.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-ivory-300 dark:bg-dark-base text-stone-700 dark:text-stone-300 border border-transparent dark:border-dark-border"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer & Navigation CTA */}
                  <div className="pt-4 border-t border-stone-100 dark:border-dark-border flex items-center justify-between">
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      <span>Hours: </span>
                      <strong className="text-stone-700 dark:text-stone-200 font-semibold">
                        {restaurant.openingHours?.open} - {restaurant.openingHours?.close}
                      </strong>
                    </div>

                    <Link
                      to={`/restaurants/${restaurant._id}`}
                      className="px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1 group-hover:gap-1.5"
                    >
                      <span>View Live Floor Map</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RestaurantDiscoveryPage;
