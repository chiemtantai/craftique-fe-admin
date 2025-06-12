import axios from 'axios';

const API_BASE_URL = 'https://localhost:7218/api';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const accountService = {
  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/Account/Login', {
        email,
        password
      });
      
      const { accessToken, userID, userName, name } = response.data;
      
      // Lưu thông tin user vào localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userID', userID);
      localStorage.setItem('userName', userName);
      localStorage.setItem('name', name);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Đăng nhập thất bại' };
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userID');
    localStorage.removeItem('userName');
    localStorage.removeItem('name');
  },

  // Kiểm tra user đã đăng nhập
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    return {
      userID: localStorage.getItem('userID'),
      userName: localStorage.getItem('userName'),
      name: localStorage.getItem('name'),
      accessToken: localStorage.getItem('accessToken')
    };
  },

  // Kiểm tra quyền Admin hoặc Staff
  hasAdminAccess: () => {
    const userName = localStorage.getItem('userName');
    return userName === 'admin' || userName === 'staff';
  }
};

export default accountService;