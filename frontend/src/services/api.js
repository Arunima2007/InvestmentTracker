/**
 * API Service - centralized HTTP client for the Flask backend.
 * All requests automatically include the JWT token from localStorage.
 */

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to authenticated requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout when the backend rejects the token.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

/* Auth */
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);

/* Profile */
export const getProfile = () => api.get('/profile');
export const saveProfile = (data) => api.post('/profile', data);

/* Recommendation */
export const predictInvestment = (data) =>
  api.post('/recommendation/predict', data);

export const getRecommendation = (data) =>
  api.post('/recommendation/predict', data);

export default api;
