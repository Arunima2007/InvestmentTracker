/**
 * API Service – centralised HTTP client for the Flask backend.
 * All requests automatically include the JWT token from localStorage.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/',          // proxied by Vite in dev
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT token ────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: auto-logout on 401 ────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

/* ── Auth ──────────────────────────────── */
export const signup = (data) => api.post('/auth/signup', data);
export const login  = (data) => api.post('/auth/login', data);

/* ── Profile ──────────────────────────── */
export const getProfile  = ()     => api.get('/profile');
export const saveProfile = (data) => api.post('/profile', data);

/* ── Recommendation & Projection ──────── */
export const getRecommendation = ()     => api.get('/recommendation');
export const getProjection     = (data) => api.post('/projection', data || {});

export default api;
