import axios from 'axios';

// Create axios client with base configuration
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token from localStorage
api.interceptors.request.use(
  (config) => {
    // Attach token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to unwrap errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Unwrap error message for easier handling
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'An error occurred';
    
    // Create a custom error object
    const customError = new Error(errorMessage);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    
    return Promise.reject(customError);
  }
);

export default api;
