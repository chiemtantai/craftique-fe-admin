import { useState } from 'react';
import { workshopService } from '../../../services/workshopService';

export const useConfirmEmail = () => {
  const [loading, setLoading] = useState(false);

  const confirmRegistration = async (id) => {
    try {
      setLoading(true);
      await workshopService.confirm(id);
      return { success: true, message: 'Đã xác nhận đăng ký thành công!' };
    } catch (error) {
      console.error('Error confirming registration:', error);
      return { success: false, message: 'Không thể xác nhận đăng ký. Vui lòng thử lại.' };
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmRegistration,
    loading
  };
};