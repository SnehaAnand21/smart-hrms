import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hrms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      if (localStorage.getItem('hrms_token')) {
        localStorage.removeItem('hrms_token');
        localStorage.removeItem('hrms_user');
        // Do not force redirect if already on login/register
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ----------------- API MODULES -----------------

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const restaurantsAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  getTables: (id, params) => api.get(`/restaurants/${id}/tables`, { params }),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
};

export const tablesAPI = {
  create: (data) => api.post('/tables', data),
  updateStatus: (id, status) => api.put(`/tables/${id}/status`, { status }),
  update: (id, data) => api.put(`/tables/${id}`, data),
  delete: (id) => api.delete(`/tables/${id}`),
};

export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  getRestaurantBookings: (restaurantId, params) =>
    api.get(`/bookings/restaurant/${restaurantId}`, { params }),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
};

export const queueAPI = {
  join: (data) => api.post('/queue', data),
  getMyStatus: () => api.get('/queue/my'),
  getRestaurantQueue: (restaurantId) => api.get(`/queue/restaurant/${restaurantId}`),
  cancel: (id) => api.put(`/queue/${id}/cancel`),
  seat: (id, tableId) => api.put(`/queue/${id}/seat`, { tableId }),
  notify: (id) => api.put(`/queue/${id}/notify`),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const adminAPI = {
  getDashboard: (params) => api.get('/admin/dashboard', { params }),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
};

export default api;
