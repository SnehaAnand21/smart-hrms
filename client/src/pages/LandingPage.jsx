import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantsAPI } from '../services/api';
import TableBadge from '../components/TableBadge';
import {
  Search,
  MapPin,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  Layers,
  ChevronRight,
  Star,
} from 'lucide-react';

export const LandingPage = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await restaurantsAPI.getAll({ sort: 'rating' });
        if (res.data.success) {
          setFeaturedRestaurants(res.data.restaurants.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}&cuisine=${encodeURIComponent(cuisineFilter)}`);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-950 via-forest-900 to-forest-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800/80 border border-forest-700 text-emerald-400 text-xs font-semibold tracking-wide backdrop-blur-sm animate-pulse-ring">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span>MERN Full-Stack Hospitality Innovation</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Genuine Table-Level Seat Availability in{' '}
            <span className="text-emerald-400 italic">Real Time.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            Eliminate walk-in guesswork and crowded waiting lobbies. Inspect live 2D floor maps,
            reserve specific tables with atomic double-booking protection, or join virtual queues
            before you leave home.
          </p>

          {/* Quick Search Card */}
          <div className="max-w-3xl mx-auto mt-8 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md rounded-3xl p-3 shadow-2xl dark:shadow-dark-card border border-white/20 dark:border-dark-border text-stone-900 dark:text-stone-100 transition-colors">
            <form
              onSubmit={handleSearchSubmit}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center"
            >
              <div className="sm:col-span-6 flex items-center gap-2.5 px-3 py-2 bg-stone-50 dark:bg-dark-base rounded-2xl border border-stone-200 dark:border-dark-border">
                <Search className="w-5 h-5 text-forest-700 dark:text-emerald-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Restaurant name, area (e.g. Guindy, Nungambakkam)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3 flex items-center gap-2 px-3 py-2 bg-stone-50 dark:bg-dark-base rounded-2xl border border-stone-200 dark:border-dark-border">
                <select
                  value={cuisineFilter}
                  onChange={(e) => setCuisineFilter(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-stone-700 dark:text-stone-200 focus:outline-none"
                >
                  <option value="" className="dark:bg-dark-surface">All Cuisines</option>
                  <option value="South Indian" className="dark:bg-dark-surface">South Indian</option>
                  <option value="Italian" className="dark:bg-dark-surface">Italian Bistro</option>
                  <option value="Japanese" className="dark:bg-dark-surface">Japanese Sushi</option>
                  <option value="Pan-Asian" className="dark:bg-dark-surface">Pan-Asian</option>
                  <option value="North Indian" className="dark:bg-dark-surface">North Indian</option>
                  <option value="Cafe" className="dark:bg-dark-surface">Artisan Cafe</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  Find Tables
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </form>
          </div>

          {/* Value Props Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Live WebSocket Floor Map
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Double-Booking Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Wait-Time Estimator
            </span>
          </div>
        </div>
      </section>

      {/* Academic Project Presentation Highlight Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 shadow-elevated dark:shadow-dark-card border border-stone-200 dark:border-dark-border grid grid-cols-1 md:grid-cols-3 gap-6 items-center transition-colors">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-emerald-300 border border-forest-200 dark:border-forest-800">
                Academic Project Review 1 & 2
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">ID: 310624205264</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
              Department of Information Technology · Easwari Engineering College
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Designed and implemented by <strong className="text-forest-900 dark:text-emerald-400">Sneha.A</strong> under
              the guidance of <strong className="text-forest-900 dark:text-emerald-400">Ms Grandhi Sai Lakshmi</strong>.
              Featuring genuine table-level seat mapping, rule-based wait estimation, and Socket.IO
              concurrency.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 justify-end">
            <Link
              to="/restaurants"
              className="px-5 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white text-xs sm:text-sm font-semibold transition-colors text-center shadow-sm"
            >
              Explore Live Seat Maps →
            </Link>
            <Link
              to="/login"
              className="px-5 py-3 rounded-xl bg-ivory-300 hover:bg-ivory-400 dark:bg-dark-base dark:hover:bg-forest-950 text-forest-950 dark:text-emerald-300 text-xs sm:text-sm font-semibold transition-colors text-center border border-stone-300 dark:border-dark-border"
            >
              Staff Dashboard Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Live Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-forest-700 dark:text-emerald-400 block">
              Real-Time Seating Status
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">
              Featured Partner Restaurants
            </h2>
          </div>
          <Link
            to="/restaurants"
            className="text-sm font-semibold text-forest-700 dark:text-emerald-400 hover:text-forest-900 dark:hover:text-emerald-300 flex items-center gap-1 group"
          >
            View all 6 partner restaurants
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-stone-200 dark:bg-dark-surface rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border overflow-hidden shadow-card dark:shadow-dark-card hover:shadow-elevated dark:hover:shadow-dark-glow transition-all duration-300 flex flex-col group"
              >
                {/* Image & Badges */}
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

                  {/* Live availability pill */}
                  <div className="absolute bottom-3 left-3 bg-forest-950/90 dark:bg-dark-base/90 text-white backdrop-blur-md px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm border border-transparent dark:border-forest-800/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      {restaurant.availabilitySummary?.availableTables || 0} of{' '}
                      {restaurant.availabilitySummary?.totalTables || 10} tables free
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white group-hover:text-forest-800 dark:group-hover:text-emerald-400 transition-colors">
                      {restaurant.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                      {restaurant.address?.area}, {restaurant.address?.city}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
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

                  <div className="pt-3 border-t border-stone-100 dark:border-dark-border flex items-center justify-between">
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      Hours: {restaurant.openingHours?.open} - {restaurant.openingHours?.close}
                    </span>
                    <Link
                      to={`/restaurants/${restaurant._id}`}
                      className="px-4 py-2 rounded-xl bg-forest-50 dark:bg-forest-950/60 hover:bg-forest-900 dark:hover:bg-forest-700 text-forest-800 dark:text-emerald-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-1 border border-forest-200/40 dark:border-forest-800/60"
                    >
                      Seat Map →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it Works / 4 Pillars */}
      <section className="bg-ivory-200/80 dark:bg-dark-base py-16 px-4 sm:px-6 lg:px-8 border-y border-stone-200 dark:border-dark-border transition-colors">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-forest-700 dark:text-emerald-400">
              System Architecture & Workflow
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">
              How Smart HRMS Solves the Problem
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              Unlike generic booking apps displaying estimated time slots, our platform monitors
              every individual table and synchronizes seat changes in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-3 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-emerald-400 flex items-center justify-center font-bold text-base font-serif border border-forest-200 dark:border-forest-800">
                01
              </div>
              <h4 className="font-serif font-bold text-stone-900 dark:text-white text-base">Search & Filter</h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Filter by cuisine, party capacity, and location. See live available seat counts before
                heading out.
              </p>
            </div>

            <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-3 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold text-base font-serif border border-emerald-200 dark:border-emerald-800">
                02
              </div>
              <h4 className="font-serif font-bold text-stone-900 dark:text-white text-base">Interactive Seat Map</h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                View the 2D floor layout. Color-coded tables indicate Available, Held, Occupied, and
                Reserved states.
              </p>
            </div>

            <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-3 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 dark:bg-amber-950/80 text-gold-700 dark:text-amber-400 flex items-center justify-center font-bold text-base font-serif border border-gold-200 dark:border-amber-800">
                03
              </div>
              <h4 className="font-serif font-bold text-stone-900 dark:text-white text-base">Atomic Booking & Queue</h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Lock your table without double-booking risk. Or join the virtual queue with deterministic
                turnover calculations.
              </p>
            </div>

            <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card space-y-3 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-400 flex items-center justify-center font-bold text-base font-serif border border-indigo-200 dark:border-indigo-800">
                04
              </div>
              <h4 className="font-serif font-bold text-stone-900 dark:text-white text-base">Live Socket Alerts</h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Socket.IO emits status updates directly to your screen. Get alerted the instant your
                table is ready.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
