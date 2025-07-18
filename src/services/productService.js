import axios from "axios";

// const API_BASE_URL = 'https://localhost:7218/api';
const API_BASE_URL = "https://api-craftique.innosphere.io.vn/api";

const productAPI = axios.create({
  baseURL: `${API_BASE_URL}/Product`,
  headers: {
    "Content-Type": "application/json",
  },
});

productAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const productService = {
  getAll: () => productAPI.get("/showall"),
  getById: (id) => productAPI.get(`/${id}`),
  create: (data) => productAPI.post("/", data),
  update: (id, data) => productAPI.put(`/${id}`, data),
  delete: (id) => productAPI.delete(`/${id}`),
};
