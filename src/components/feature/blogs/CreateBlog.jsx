import React, { useState } from 'react';
import { blogService } from '../../../services/blogService';

const CreateBlog = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    productId: 0,
    blogImages: []
  });
  
  const [imageUrls, setImageUrls] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'productId' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
    
    // Cập nhật formData
    const blogImages = newImageUrls
      .filter(url => url.trim() !== '')
      .map(url => ({ imageUrl: url.trim() }));
    
    setFormData(prev => ({
      ...prev,
      blogImages
    }));
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    if (imageUrls.length > 1) {
      const newImageUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newImageUrls);
      
      const blogImages = newImageUrls
        .filter(url => url.trim() !== '')
        .map(url => ({ imageUrl: url.trim() }));
      
      setFormData(prev => ({
        ...prev,
        blogImages
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Vui lòng nhập nội dung');
      return;
    }
    
    if (!formData.author.trim()) {
      setError('Vui lòng nhập tên tác giả');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await blogService.create(formData);
      onSuccess();
      
    } catch (err) {
      setError('Không thể tạo blog. Vui lòng thử lại.');
      console.error('Error creating blog:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-modal-overlay">
      <div className="create-blog-modal">
        <div className="create-blog-header">
          <h3>Tạo Blog Mới</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="create-blog-form">
          <div className="form-group">
            <label htmlFor="title">Tiêu đề *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Nhập tiêu đề blog"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Tác giả *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Nhập tên tác giả"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="productId">Product ID</label>
            <input
              type="number"
              id="productId"
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Nội dung *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Nhập nội dung blog"
              rows="8"
              required
            />
          </div>

          <div className="form-group">
            <label>Hình ảnh</label>
            {imageUrls.map((url, index) => (
              <div key={index} className="image-input-group">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="Nhập URL hình ảnh"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-remove"
                    onClick={() => removeImageUrl(index)}
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-add-image"
              onClick={addImageUrl}
            >
              Thêm hình ảnh
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang tạo...' : 'Tạo Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;