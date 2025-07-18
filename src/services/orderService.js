import axios from 'axios';

// const API_BASE_URL = 'https://localhost:7218/api';
const API_BASE_URL = 'https://api-craftique.innosphere.io.vn/api';

const orderAPI = axios.create({
  baseURL: `${API_BASE_URL}/Order`,
  headers: {
    'Content-Type': 'application/json',
  },
});

orderAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const orderService = {

  getAll: () => orderAPI.get('/orders'),
  
  getById: (id) => orderAPI.get(`/${id}`),
  
  updateStatus: (orderId, statusData) => {
    const params = new URLSearchParams();
    
    if (statusData.NewStatus) {
      params.append('NewStatus', statusData.NewStatus);
    }
    if (statusData.ShipperId) {
      params.append('ShipperId', statusData.ShipperId);
    }
    if (statusData.RefundReason) {
      params.append('RefundReason', statusData.RefundReason);
    }
    if (statusData.isCancelledByCustomer !== undefined) {
      params.append('isCancelledByCustomer', statusData.isCancelledByCustomer);
    }
    
    return orderAPI.put(`/${orderId}/status?${params.toString()}`);
  },
  
  updateOrderStatus: (orderId, newStatus, shipperId = null, refundReason = null, isCancelledByCustomer = false) => {
    const statusData = {
      NewStatus: newStatus,
      ShipperId: shipperId,
      RefundReason: refundReason,
      isCancelledByCustomer: isCancelledByCustomer
    };
    
    return orderService.updateStatus(orderId, statusData);
  },

  processingOrder: (orderId) => {
    return orderService.updateOrderStatus(orderId, 'Processing');
  },
  
  shipOrder: (orderId, shipperId = null) => {
    return orderService.updateOrderStatus(orderId, 'Shipped', shipperId);
  },
  
  deliverOrder: (orderId) => {
    return orderService.updateOrderStatus(orderId, 'Delivered');
  },
  
  completeOrder: (orderId) => {
    return orderService.updateOrderStatus(orderId, 'Completed');
  },
  
  approveRefund: (orderId, refundReason = null) => {
    return orderService.updateOrderStatus(orderId, 'Refunded', null, refundReason);
  },

  canUpdateStatus: (currentStatus, newStatus) => {
    const allowedTransitions = {
      'Pending': ['Processing'],
      'Processing': ['Shipped'],
      'Shipped': ['Delivered'],
      'Delivered': ['Completed'],
      'RefundRequest': ['Refunded']
    };
    
    return allowedTransitions[currentStatus]?.includes(newStatus) || false;
  },

  getAvailableStatuses: (currentStatus) => {
    const allowedTransitions = {
      'Pending': ['Processing'],
      'Processing': ['Shipped'],
      'Shipped': ['Delivered'],
      'Delivered': ['Completed'],
      'RefundRequest': ['Refunded']
    };
    
    return allowedTransitions[currentStatus] || [];
  }
};