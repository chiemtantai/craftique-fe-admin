import axios from 'axios';

// const API_BASE_URL = 'https://localhost:7218/api';
const API_BASE_URL = 'https://api-craftique.innosphere.io.vn/api';

const productItemAPI = axios.create({
  baseURL: `${API_BASE_URL}/ProductItem`,
  headers: {
    'Content-Type': 'application/json',
  },
});

productItemAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const productItemService = {
  getAll: () => productItemAPI.get('/'),
  
  getPaginated: (pageNumber = 1, pageSize = 10, searchTerm = '') => {
    const params = { pageNumber, pageSize };
    if (searchTerm) params.searchTerm = searchTerm;
    return productItemAPI.get('/', { params });
  },
  
  getById: (id) => productItemAPI.get(`/${id}`),
  
  create: (data) => productItemAPI.post('/', data),
  
  update: (id, data) => productItemAPI.put(`/${id}`, data),
  
  delete: (id) => productItemAPI.delete(`/${id}`),
};