import axios from "axios";

const API_BASE_URL = "https://localhost:7218/api";

const workshopAPI = axios.create({
  baseURL: `${API_BASE_URL}/Workshop`,
  headers: {
    "Content-Type": "application/json",
  },
});

workshopAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const workshopService = {
  getAll: () => workshopAPI.get("/registrations"),

  sendEmail: (data) => workshopAPI.post("/send-email", data),

  sendEmailBulk: (data) => workshopAPI.post("/send-email-bulk", data),

  confirm: (id) => workshopAPI.post(`/confirm/${id}`),

  reject: (id, reason) => workshopAPI.post(`/reject/${id}?reason=${encodeURIComponent(reason)}`),
};
