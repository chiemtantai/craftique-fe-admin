import axios from 'axios';

const API_BASE_URL = 'https://localhost:7218/api';

const shipperAPI = axios.create({
  baseURL: `${API_BASE_URL}/Shipper`,
  headers: {
    'Content-Type': 'application/json',
  },
});

shipperAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const shipperService = {
  getAll: () => shipperAPI.get('/all'),
};