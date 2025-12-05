import axios from 'axios';

// 1. Determine the Base URL dynamically
// On Vercel, we will set VITE_API_URL to your Render address.
// On Localhost, it falls back to port 5000.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Before every request, check if we have a token and attach it
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;