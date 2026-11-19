import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Eye, EyeOff, Lock, Mail, User, Phone, Store, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const [role, setRole] = useState('customer'); // 'customer' or 'restaurantAdmin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const res = await register({
      name,
      email,
      password,
      role,
      phone,
      restaurantName: role === 'restaurantAdmin' ? restaurantName : undefined,
    });

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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-forest-900 dark:bg-forest-950 text-emerald-400 shadow-card border border-transparent dark:border-forest-800">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-white tracking-tight">
            Create HRMS Account
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Join the smart dining network as a Customer or Restaurant Admin
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <span className="font-medium leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card transition-colors">
          {/* Role Toggle Selector */}
          <div className="p-1 bg-stone-100 dark:bg-dark-base rounded-2xl grid grid-cols-2 gap-1 mb-5 border border-transparent dark:border-dark-border">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                role === 'customer'
                  ? 'bg-white dark:bg-forest-900 text-forest-900 dark:text-emerald-300 shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Customer / Diner
            </button>
            <button
              type="button"
              onClick={() => setRole('restaurantAdmin')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                role === 'restaurantAdmin'
                  ? 'bg-forest-900 dark:bg-forest-700 text-white shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Restaurant Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sneha Anand"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {role === 'restaurantAdmin' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Restaurant Name
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="e.g. Grand Chettinad Grill"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

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
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98401 23456"
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
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
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
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-100 dark:border-dark-border text-center text-xs text-stone-600 dark:text-stone-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-forest-700 dark:text-emerald-400 hover:text-forest-900 dark:hover:text-emerald-300 underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
