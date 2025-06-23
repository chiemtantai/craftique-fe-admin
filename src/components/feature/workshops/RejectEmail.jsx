import { useState } from 'react';
import { workshopService } from '../../../services/workshopService';

export const useRejectEmail = () => {
  const [loading, setLoading] = useState(false);

  const rejectRegistration = async (id, reason) => {
    try {
      setLoading(true);
      const response = await workshopService.reject(id, reason);
      console.log('Reject response:', response); // Debug log
      return { success: true, message: 'Đã từ chối đăng ký thành công!' };
    } catch (error) {
      console.error('Error rejecting registration:', error);
      console.error('Error response:', error.response?.data); // Chi tiết lỗi
      return { 
        success: false, 
        message: error.response?.data?.message || 'Không thể từ chối đăng ký. Vui lòng thử lại.' 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    rejectRegistration,
    loading
  };
};