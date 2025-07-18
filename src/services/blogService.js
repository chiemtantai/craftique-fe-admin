import axios from 'axios';

// const API_BASE_URL = 'https://localhost:7218/api';
const API_BASE_URL = 'https://api-craftique.innosphere.io.vn/api';

const blogAPI = axios.create({
  baseURL: `${API_BASE_URL}/Blog`,
  headers: {
    'Content-Type': 'application/json',
  },
});

blogAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const blogService = {
  getAll: () => blogAPI.get('/'),
  getById: (id) => blogAPI.get(`/${id}`),
  create: (data) => blogAPI.post('/', data),
  update: (id, data) => blogAPI.put(`/${id}`, data),
  delete: (id) => blogAPI.delete(`/${id}`),
};