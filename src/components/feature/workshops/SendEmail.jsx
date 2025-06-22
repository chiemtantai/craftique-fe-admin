import { useState } from 'react';
import { workshopService } from '../../../services/workshopService';

export const useSendEmail = () => {
  const [loading, setLoading] = useState(false);

  const sendSingleEmail = async (registrationId, subject, body) => {
    try {
      setLoading(true);
      const data = {
        registrationId,
        subject,
        body
      };
      
      await workshopService.sendEmail(data);
      return { success: true, message: 'Email đã được gửi thành công!' };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, message: 'Không thể gửi email. Vui lòng thử lại.' };
    } finally {
      setLoading(false);
    }
  };

  const sendBulkEmail = async (registrationIds, subject, body) => {
    try {
      setLoading(true);
      const data = {
        registrationIds,
        subject,
        body
      };
      
      await workshopService.sendEmailBulk(data);
      return { success: true, message: `Email đã được gửi cho ${registrationIds.length} người đăng ký!` };
    } catch (error) {
      console.error('Error sending bulk email:', error);
      return { success: false, message: 'Không thể gửi email hàng loạt. Vui lòng thử lại.' };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendSingleEmail,
    sendBulkEmail,
    loading
  };
};