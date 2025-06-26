import axios from 'axios';

const API_BASE_URL = 'https://localhost:7218/api';

const manageAPI = axios.create({
  baseURL: `${API_BASE_URL}/Admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

manageAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to build query parameters
const buildQueryParams = (filters) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '') {
      params.append(key, value);
    }
  });
  
  return params.toString();
};

export const manageService = {
  getTotalUsers: () => manageAPI.get('/get-total-user'),
  getTotalRevenue: () => manageAPI.get('/get-total-revenue'),
  getTotalProducts: () => manageAPI.get('/total-products'),
  
  getTopSellingProductItems: (filters = {}) => {
    const queryParams = buildQueryParams(filters);
    const url = queryParams ? `/get-top-selling-product-items?${queryParams}` : '/get-top-selling-product-items';
    return manageAPI.get(url);
  },
  
  getTopCustomers: (filters = {}) => {
    const queryParams = buildQueryParams(filters);
    const url = queryParams ? `/get-top-customers?${queryParams}` : '/get-top-customers';
    return manageAPI.get(url);
  },
};