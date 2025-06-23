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

export const manageService = {
  getTotalUsers: () => manageAPI.get('/get-total-user'),
  getTotalRevenue: () => manageAPI.get(`/get-total-revenue`),
  getTotalProducts: () => manageAPI.get('/total-products'),
  getTopSellingProductItems: () => manageAPI.get(`/get-top-selling-product-items`),
  getTopCustomers: () => manageAPI.get(`/get-top-customers`),
};