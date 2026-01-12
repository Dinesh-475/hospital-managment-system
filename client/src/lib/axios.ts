import axios from 'axios';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to inject token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // match authSlice storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
