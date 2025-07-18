import axios from 'axios';

// const API_BASE_URL = 'https://localhost:7218/api';
const API_BASE_URL = 'https://api-craftique.innosphere.io.vn/api';

const productImgAPI = axios.create({
  baseURL: `${API_BASE_URL}/ProductImgs`,
  headers: {
    'Content-Type': 'application/json',
  },
});

productImgAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const productImgService = {
  getAll: () => productImgAPI.get('/'),
  
  create: (data) => productImgAPI.post('/', data)
};