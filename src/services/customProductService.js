import axios from "axios";


const API_BASE_URL = "https://api-craftique.innosphere.io.vn/api";

const customProductAPI = axios.create({
  baseURL: `${API_BASE_URL}/CustomProduct`,
  headers: {
    "Content-Type": "application/json",
  },
});

customProductAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm API lấy đơn hàng custom
const customOrderAPI = axios.create({
  baseURL: `${API_BASE_URL}/CustomProductFile`,
  headers: { "Content-Type": "application/json" }
});
customOrderAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const customProductService = {
  getAll: () => customProductAPI.get("/"),
  getById: (id) => customProductAPI.get(`/${id}`),
  create: (data) => customProductAPI.post("/", data),
  update: (id, data) => customProductAPI.put(`/${id}`, data),
  delete: (id) => customProductAPI.delete(`/${id}`),
  addWithImage: (formData) => {
    // Gửi formData với multipart/form-data
    return customProductAPI.post("/admin", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAllCustomOrders: () => customOrderAPI.get("/all"),
  getCustomOrderDetail: (id) => customOrderAPI.get(`/detail/${id}`),
};

export default customProductService; 