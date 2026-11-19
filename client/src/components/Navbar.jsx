import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import {
  UtensilsCrossed,
  Bell,
  CalendarCheck,
  Clock,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  CheckCheck,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { theme, isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-dark-bg/95 backdrop-blur-md border-b border-forest-100 dark:border-dark-border shadow-soft dark:shadow-dark-card transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-forest-900 dark:bg-forest-950 text-gold-500 flex items-center justify-center shadow-card border border-transparent dark:border-forest-700/60 group-hover:scale-105 transition-transform duration-200">
              <UtensilsCrossed className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl font-bold tracking-tight text-forest-950 dark:text-emerald-50">
                  Smart <span className="text-forest-600 dark:text-emerald-400">HRMS</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-emerald-300 border border-forest-200 dark:border-forest-800">
                  Live Seats
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
                Hospitality & Table Availability System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/restaurants"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/restaurants')
                  ? 'bg-forest-50 dark:bg-forest-900/40 text-forest-800 dark:text-emerald-300 font-semibold border border-forest-200/50 dark:border-forest-700/40'
                  : 'text-stone-600 dark:text-stone-300 hover:text-forest-900 dark:hover:text-emerald-300 hover:bg-stone-50 dark:hover:bg-forest-950/40'
              }`}
            >
              Explore Restaurants
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/my-bookings"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/my-bookings')
                      ? 'bg-forest-50 dark:bg-forest-900/40 text-forest-800 dark:text-emerald-300 font-semibold border border-forest-200/50 dark:border-forest-700/40'
                      : 'text-stone-600 dark:text-stone-300 hover:text-forest-900 dark:hover:text-emerald-300 hover:bg-stone-50 dark:hover:bg-forest-950/40'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4 text-forest-600 dark:text-emerald-400" />
                  My Bookings
                </Link>

                <Link
                  to="/virtual-queue"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/virtual-queue')
                      ? 'bg-forest-50 dark:bg-forest-900/40 text-forest-800 dark:text-emerald-300 font-semibold border border-forest-200/50 dark:border-forest-700/40'
                      : 'text-stone-600 dark:text-stone-300 hover:text-forest-900 dark:hover:text-emerald-300 hover:bg-stone-50 dark:hover:bg-forest-950/40'
                  }`}
                >
                  <Clock className="w-4 h-4 text-forest-600 dark:text-emerald-400" />
                  Virtual Queue
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-forest-900 dark:bg-forest-700 text-white font-semibold shadow-sm'
                    : 'text-forest-700 dark:text-emerald-300 bg-forest-50 dark:bg-forest-900/30 hover:bg-forest-100 dark:hover:bg-forest-900/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-forest-950/70 border border-transparent dark:border-forest-800/60 transition-all duration-200"
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-forest-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Notifications Center */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className="relative p-2.5 rounded-full text-stone-600 dark:text-stone-300 hover:text-forest-900 dark:hover:text-emerald-300 hover:bg-stone-100 dark:hover:bg-forest-950/70 border border-transparent dark:border-forest-800/60 transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-surface rounded-2xl shadow-elevated dark:shadow-dark-soft border border-stone-200 dark:border-dark-border py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-stone-100 dark:border-dark-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full font-semibold border border-rose-200 dark:border-rose-900">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => {
                            markAllAsRead();
                          }}
                          className="text-xs text-forest-700 dark:text-emerald-400 hover:text-forest-900 dark:hover:text-emerald-300 font-medium flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-dark-border">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-stone-500 dark:text-stone-400 text-xs">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              if (!n.isRead) markAsRead(n._id);
                            }}
                            className={`p-3.5 hover:bg-stone-50 dark:hover:bg-forest-950/60 transition-colors cursor-pointer ${
                              !n.isRead ? 'bg-forest-50/50 dark:bg-forest-950/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                                {n.title}
                              </h5>
                              {!n.isRead && (
                                <span className="w-2 h-2 rounded-full bg-forest-600 dark:bg-emerald-400 shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                            <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-1.5 block">
                              {new Date(n.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2 border-t border-stone-100 dark:border-dark-border text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-xs font-semibold text-forest-700 dark:text-emerald-400 hover:text-forest-900 dark:hover:text-emerald-300 py-1 block"
                      >
                        View all notifications →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown / Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-forest-950/70 transition-colors border border-stone-200 dark:border-dark-border"
                >
                  <div className="w-8 h-8 rounded-full bg-forest-800 dark:bg-forest-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-200 hidden sm:block pr-1">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-2xl shadow-elevated dark:shadow-dark-soft border border-stone-200 dark:border-dark-border py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-3 border-b border-stone-100 dark:border-dark-border">
                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-emerald-300 border border-forest-200 dark:border-forest-800">
                        {user?.role}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-200 hover:bg-forest-50 dark:hover:bg-forest-950/60 hover:text-forest-900 dark:hover:text-emerald-300 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-forest-600 dark:text-emerald-400" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-bookings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-200 hover:bg-forest-50 dark:hover:bg-forest-950/60 hover:text-forest-900 dark:hover:text-emerald-300 flex items-center gap-2"
                    >
                      <CalendarCheck className="w-4 h-4 text-forest-600 dark:text-emerald-400" />
                      My Bookings
                    </Link>

                    <Link
                      to="/virtual-queue"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-200 hover:bg-forest-50 dark:hover:bg-forest-950/60 hover:text-forest-900 dark:hover:text-emerald-300 flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-forest-600 dark:text-emerald-400" />
                      Virtual Queue
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 border-t border-stone-100 dark:border-dark-border mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-forest-800 dark:text-emerald-300 hover:text-forest-950 dark:hover:text-emerald-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 sm:px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-forest-950/60"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-forest-50 dark:hover:bg-forest-950/60"
          >
            Explore Restaurants
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-forest-50 dark:hover:bg-forest-950/60"
              >
                My Bookings
              </Link>
              <Link
                to="/virtual-queue"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-forest-50 dark:hover:bg-forest-950/60"
              >
                Virtual Queue
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-forest-800 dark:text-emerald-300 bg-forest-50 dark:bg-forest-900/40 font-semibold"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-3 border-t border-stone-200 dark:border-dark-border flex items-center justify-between px-3">
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400">Theme</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-forest-950 text-stone-700 dark:text-emerald-400 border border-stone-200 dark:border-forest-800"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-forest-700" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
