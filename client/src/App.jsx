import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantDiscoveryPage from './pages/RestaurantDiscoveryPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import VirtualQueuePage from './pages/VirtualQueuePage';
import NotificationsPage from './pages/NotificationsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminTableManagementPage from './pages/admin/AdminTableManagementPage';
import AdminBookingManagementPage from './pages/admin/AdminBookingManagementPage';
import AdminQueueManagementPage from './pages/admin/AdminQueueManagementPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Customer Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100 dark:bg-dark-bg">
        <div className="w-8 h-8 border-4 border-forest-600 dark:border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Protected Route
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100 dark:bg-dark-bg">
        <div className="w-8 h-8 border-4 border-forest-600 dark:border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/restaurants" replace />;
  }
  return children;
};

export function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <div className="min-h-screen flex flex-col bg-ivory-100 dark:bg-dark-bg text-stone-900 dark:text-stone-100 transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/restaurants" element={<RestaurantDiscoveryPage />} />
                <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />

                {/* Customer Authenticated Routes */}
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/virtual-queue"
                  element={
                    <ProtectedRoute>
                      <VirtualQueuePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Authenticated Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/tables"
                  element={
                    <AdminRoute>
                      <AdminTableManagementPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <AdminRoute>
                      <AdminBookingManagementPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/queue"
                  element={
                    <AdminRoute>
                      <AdminQueueManagementPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <AdminRoute>
                      <AdminSettingsPage />
                    </AdminRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <Toast />
          </div>
        </NotificationProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
