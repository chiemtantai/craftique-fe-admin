import React, { useState } from 'react';
import { blogService } from '../../../services/blogService';

const DeleteBlog = ({ blogId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await blogService.delete(blogId);
      
      // Gọi callback success
      onSuccess();
      
    } catch (err) {
      setError('Không thể xóa blog. Vui lòng thử lại.');
      console.error('Error deleting blog:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h3>Xác nhận xóa blog</h3>
        </div>
        
        <div className="delete-modal-body">
          <p>Bạn có chắc chắn muốn xóa blog này không?</p>
          <p className="warning">Hành động này không thể hoàn tác!</p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
        
        <div className="delete-modal-actions">
          <button 
            className="btn btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </button>
          <button 
            className="btn btn-delete"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBlog;