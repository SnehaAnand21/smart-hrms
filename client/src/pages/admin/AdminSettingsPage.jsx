import React, { useState, useEffect } from 'react';
import { adminAPI, restaurantsAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import {
  Store,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCw,
  BarChart3,
  ShieldCheck,
  Moon,
  Sun,
} from 'lucide-react';

export const AdminSettingsPage = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineStr, setCuisineStr] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [openTime, setOpenTime] = useState('11:00');
  const [closeTime, setCloseTime] = useState('23:00');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getDashboard();
      if (res.data.success && res.data.restaurant) {
        const rest = res.data.restaurant;
        // Fetch full restaurant model
        const fullRes = await restaurantsAPI.getById(rest.id || rest._id);
        if (fullRes.data.success) {
          const r = fullRes.data.restaurant;
          setRestaurant(r);
          setName(r.name || '');
          setDescription(r.description || '');
          setCuisineStr(Array.isArray(r.cuisine) ? r.cuisine.join(', ') : '');
          setStreet(r.address?.street || '');
          setArea(r.address?.area || '');
          setCity(r.address?.city || 'Chennai');
          setContactPhone(r.contactPhone || '');
          setOpenTime(r.openingHours?.open || '11:00');
          setCloseTime(r.openingHours?.close || '23:00');
        }
      }
    } catch (err) {
      console.error('Failed to load restaurant settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!restaurant?._id) return;

    setSaveLoading(true);
    setStatusMessage('');
    setErrorMessage('');

    try {
      const cuisinesArray = cuisineStr
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const res = await restaurantsAPI.update(restaurant._id, {
        name,
        description,
        cuisine: cuisinesArray,
        address: {
          ...restaurant.address,
          street,
          area,
          city,
        },
        contactPhone,
        openingHours: {
          ...restaurant.openingHours,
          open: openTime,
          close: closeTime,
        },
      });

      if (res.data.success) {
        setStatusMessage('Restaurant profile updated successfully!');
        setRestaurant(res.data.restaurant);
        setTimeout(() => setStatusMessage(''), 5000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-forest-700 dark:text-emerald-400">
            Establishment Profile
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">
            Restaurant Settings & Information
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Update operating hours, cuisine tags, and contact details shown to customers.
          </p>
        </div>

        <button
          onClick={fetchProfile}
          className="p-2.5 rounded-xl border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-stone-50 dark:hover:bg-dark-elevated text-stone-700 dark:text-stone-200 shadow-xs transition-colors flex items-center gap-2 text-xs font-semibold"
        >
          <RotateCw className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
          Reload
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-2xl text-rose-900 dark:text-rose-200 text-xs flex items-center gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="h-96 bg-stone-200 dark:bg-dark-surface rounded-3xl animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Edit Form */}
          <div className="lg:col-span-8 bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border p-6 sm:p-8 shadow-card space-y-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 border border-stone-300 dark:border-dark-border bg-white dark:bg-dark-bg text-stone-900 dark:text-stone-100 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 border border-stone-300 dark:border-dark-border bg-white dark:bg-dark-bg text-stone-900 dark:text-stone-100 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Cuisines (Comma-separated)
                </label>
                <input
                  type="text"
                  value={cuisineStr}
                  onChange={(e) => setCuisineStr(e.target.value)}
                  placeholder="South Indian, Chettinad, Seafood"
                  required
                  className="w-full px-3.5 py-2.5 border border-stone-300 dark:border-dark-border bg-white dark:bg-dark-bg text-stone-900 dark:text-stone-100 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none placeholder:text-stone-400 dark:placeholder:text-stone-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 border border-stone-300 dark:border-dark-border bg-white dark:bg-dark-bg text-stone-900 dark:text-stone-100 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Neighborhood / Area
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 border border-stone-300 dark:border-dark-border bg-white dark:bg-dark-bg text-stone-900 dark:text-stone-100 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 border border-stone-300 dark:border-dark-border bg-white dark:bg-dark-bg text-stone-900 dark:text-stone-100 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Opening Time
                  </label>
                  <input
                    type="text"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    placeholder="11:30"
                    required
                    className="w-full px-3.5 py-2.5 border border-stone-300 dark:border-dark-border bg-white dark:bg-dark-bg text-stone-900 dark:text-stone-100 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Closing Time
                  </label>
                  <input
                    type="text"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    placeholder="23:00"
                    required
                    className="w-full px-3.5 py-2.5 border border-stone-300 dark:border-dark-border bg-white dark:bg-dark-bg text-stone-900 dark:text-stone-100 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 border border-stone-300 dark:border-dark-border bg-white dark:bg-dark-bg text-stone-900 dark:text-stone-100 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-emerald-400 dark:text-emerald-100" />
                  {saveLoading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Side Info, Theme Control & Academic Project Specs */}
          <div className="lg:col-span-4 space-y-6">
            {/* UI Theme Card */}
            <div className="bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-forest-700 dark:text-emerald-400 block">
                    UI Theme
                  </span>
                  <h4 className="font-serif font-bold text-stone-900 dark:text-white text-base">
                    Appearance
                  </h4>
                </div>
                <div className="p-2 rounded-xl bg-forest-50 dark:bg-dark-elevated text-forest-700 dark:text-emerald-400">
                  {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Switch between light mode and deep obsidian dark mode with signature emerald accents.
              </p>
              <div className="pt-1 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Active Mode: <strong className="text-forest-800 dark:text-emerald-400 capitalize">{theme}</strong>
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-dark-border bg-stone-50 dark:bg-dark-elevated hover:bg-forest-50 dark:hover:bg-dark-border text-stone-800 dark:text-stone-200 text-xs font-medium transition-all flex items-center gap-2"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-forest-700" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-forest-950 dark:bg-dark-surface text-white p-6 rounded-3xl border border-transparent dark:border-dark-border shadow-card space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                System Health
              </span>
              <h3 className="font-serif text-lg font-bold text-white">HRMS Real-Time Engine</h3>
              <ul className="text-xs text-stone-300 space-y-2.5">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>WebSocket Port: 5000 (Active)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>MongoDB Atlas / Local DB: Synced</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Double-Booking Locks: Active</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Virtual Queue Estimator: Active</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border p-6 shadow-card space-y-3">
              <h4 className="font-serif font-bold text-stone-900 dark:text-white text-sm">Review Credentials</h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Academic demo account: <strong>Sneha A</strong> [310624205264] · Easwari Engineering
                College.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;
