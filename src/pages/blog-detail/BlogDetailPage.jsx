import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import './BlogDetailPage.css';

const BlogDetailPage = () => {
  const { blogID } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchBlogDetail();
  }, [blogID]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await blogService.getById(blogID);
      setBlog(response.data);
    } catch (err) {
      setError('Không thể tải chi tiết blog');
      console.error('Error fetching blog detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleImageNavigation = (direction) => {
    if (!blog.blogImages || blog.blogImages.length === 0) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === blog.blogImages.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? blog.blogImages.length - 1 : prev - 1
      );
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="blog-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải chi tiết blog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-detail-container">
        <div className="error-message">
          <h2>Có lỗi xảy ra</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={goBack}>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-container">
        <div className="not-found">
          <h2>Không tìm thấy blog</h2>
          <p>Blog bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button className="btn btn-primary" onClick={goBack}>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      <div className="blog-detail-header">
        <button className="back-button" onClick={goBack}>
          ← Quay lại
        </button>
      </div>

      <article className="blog-detail">
        <header className="blog-header">
          <h1 className="blog-title">{blog.title}</h1>
          <div className="blog-meta">
            <div className="blog-author">
              <span className="author-label">Tác giả:</span>
              <span className="author-name">{blog.author}</span>
            </div>
            <div className="blog-dates">
              <div className="upload-date">
                <span className="date-label">Ngày đăng:</span>
                <span className="date-value">{formatDate(blog.uploadDate)}</span>
              </div>
              {blog.updateDate !== blog.uploadDate && (
                <div className="update-date">
                  <span className="date-label">Cập nhật:</span>
                  <span className="date-value">{formatDate(blog.updateDate)}</span>
                </div>
              )}
            </div>
            <div className="blog-stats">
              <div className="stat-item">
                <span className="stat-icon">👁</span>
                <span className="stat-value">{blog.view}</span>
                <span className="stat-label">lượt xem</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">❤</span>
                <span className="stat-value">{blog.like}</span>
                <span className="stat-label">lượt thích</span>
              </div>
            </div>
          </div>
        </header>

        {blog.blogImages && blog.blogImages.length > 0 && (
          <div className="blog-images">
            <div className="image-gallery">
              <div className="main-image">
                <img 
                  src={blog.blogImages[currentImageIndex].imageUrl} 
                  alt={`${blog.title} - Hình ${currentImageIndex + 1}`}
                  onError={(e) => {
                    e.target.src = '/default-blog-image.jpg';
                  }}
                />
                {blog.blogImages.length > 1 && (
                  <>
                    <button 
                      className="image-nav prev" 
                      onClick={() => handleImageNavigation('prev')}
                    >
                      ‹
                    </button>
                    <button 
                      className="image-nav next" 
                      onClick={() => handleImageNavigation('next')}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              
              {blog.blogImages.length > 1 && (
                <div className="image-thumbnails">
                  {blog.blogImages.map((image, index) => (
                    <img
                      key={image.blogImageID}
                      src={image.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      onError={(e) => {
                        e.target.src = '/default-blog-image.jpg';
                      }}
                    />
                  ))}
                </div>
              )}
              
              <div className="image-counter">
                {currentImageIndex + 1} / {blog.blogImages.length}
              </div>
            </div>
          </div>
        )}

        <div className="blog-content">
          <div className="content-text">
            {blog.content ? (
              blog.content.split('\n').map((paragraph, index) => (
                <p key={index} className="content-paragraph">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="no-content">Không có nội dung</p>
            )}
          </div>
        </div>

        {blog.productId && blog.productId !== 0 && (
          <div className="related-product">
            <h3>Sản phẩm liên quan</h3>
            <p>Product ID: {blog.productId}</p>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetailPage;