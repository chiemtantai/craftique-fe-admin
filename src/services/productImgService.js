import axios from 'axios';

const API_BASE_URL = 'https://localhost:7218/api';

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
  
  create: (data) => productImgAPI.post('/', data),
  
  update: (id, data) => productImgAPI.put(`/${id}`, data),
  
  delete: (id) => productImgAPI.delete(`/${id}`),
  
  createSingle: (productItemId, imageUrl) => {
    return productImgAPI.post('/', {
      imageUrl: [imageUrl], 
      productItemID: productItemId
    });
  },
  
  createMultiple: (productItemId, imageUrls) => {
    return productImgAPI.post('/', {
      imageUrl: imageUrls, 
      productItemID: productItemId
    });
  }
};