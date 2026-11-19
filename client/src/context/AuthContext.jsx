import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { joinUserRoom, leaveUserRoom } from '../services/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('hrms_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('hrms_token') || null);
  const [loading, setLoading] = useState(true);

  // Verify current user on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('hrms_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('hrms_user', JSON.stringify(res.data.user));
            joinUserRoom(res.data.user._id || res.data.user.id);
          }
        } catch (err) {
          console.warn('[AuthContext] Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        const { token: jwtToken, user: userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('hrms_token', jwtToken);
        localStorage.setItem('hrms_user', JSON.stringify(userData));
        joinUserRoom(userData.id || userData._id);
        return { success: true, user: userData };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      if (res.data.success) {
        const { token: jwtToken, user: newUser } = res.data;
        setToken(jwtToken);
        setUser(newUser);
        localStorage.setItem('hrms_token', jwtToken);
        localStorage.setItem('hrms_user', JSON.stringify(newUser));
        joinUserRoom(newUser.id || newUser._id);
        return { success: true, user: newUser };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    if (user) {
      leaveUserRoom(user._id || user.id);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('hrms_token');
    localStorage.removeItem('hrms_user');
  };

  const isAdmin = user?.role === 'restaurantAdmin';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isCustomer,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
