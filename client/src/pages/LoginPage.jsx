import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Eye, EyeOff, Lock, Mail, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const wasExpired = searchParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'restaurantAdmin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/restaurants');
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  // 1-Click Demo Account Quick Fill
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setErrorMessage('');

    const res = await login(demoEmail, demoPassword);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'restaurantAdmin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/restaurants');
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-forest-900 dark:bg-forest-950 text-emerald-400 shadow-card border border-transparent dark:border-forest-800">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-white tracking-tight">
            Welcome to Smart HRMS
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Sign in to access real-time table reservations and floor management
          </p>
        </div>

        {/* Expired Session Notice */}
        {wasExpired && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Your session expired. Please sign in again.</span>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <span className="font-medium leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* 1-Click Academic Demo Buttons */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-5 border border-forest-100 dark:border-dark-border shadow-soft dark:shadow-dark-card space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-forest-900 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              1-Click Academic Review Logins
            </span>
            <span className="text-[10px] text-stone-400 dark:text-stone-500">Pre-seeded</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@hrms.com', 'admin123')}
              className="px-3 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              Admin (Sneha A)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('sneha@hrms.com', 'customer123')}
              className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-200" />
              Customer (Diner)
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card transition-colors">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Account'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-100 dark:border-dark-border text-center text-xs text-stone-600 dark:text-stone-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-forest-700 dark:text-emerald-400 hover:text-forest-900 dark:hover:text-emerald-300 underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
