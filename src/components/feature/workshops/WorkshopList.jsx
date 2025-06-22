import { useState, useEffect } from 'react';
import { workshopService } from '../../../services/workshopService';

export const useWorkshopList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await workshopService.getAll();
      setWorkshops(response.data || []);
    } catch (err) {
      setError('Không thể tải danh sách workshop');
      console.error('Error fetching workshops:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const refreshData = () => {
    fetchWorkshops();
  };

  return { 
    workshops, 
    loading, 
    error, 
    refreshData 
  };
};