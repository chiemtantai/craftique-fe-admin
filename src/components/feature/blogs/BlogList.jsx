import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { blogService } from '../../../services/blogService'; 

const BlogList = ({ onEdit, onDelete, onCreateNew }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAll();
      setBlogs(response.data);
    } catch (err) {
      setError('Không thể tải danh sách blog');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const handleViewDetail = (blogID) => {
    navigate(`/blog/${blogID}`);
  };

  return (
    <div className="blog-list">
      <div className="blog-list-header">
        <h2>Danh sách Blog</h2>
        <button className="btn btn-primary" onClick={onCreateNew}>
          Tạo Blog Mới
        </button>
      </div>

      <div className="blog-grid">
        {blogs.map((blog) => (
          <div key={blog.blogID} className="blog-card" onClick={() => handleViewDetail(blog.blogID)}>
            <div className="blog-image">
              {blog.blogImages && blog.blogImages.length > 0 ? (
                <img 
                  src={blog.blogImages[0].imageUrl} 
                  alt={blog.title}
                  onError={(e) => {
                    e.target.src = '/default-blog-image.jpg';
                  }}
                />
              ) : (
                <div className="no-image">Không có ảnh</div>
              )}
            </div>
            
            <div className="blog-content">
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-author">Tác giả: {blog.author}</p>
              <p className="blog-date">
                Ngày đăng: {formatDate(blog.uploadDate)}
              </p>
              <div className="blog-stats">
                <span>👁 {blog.view}</span>
                <span>❤ {blog.like}</span>
              </div>
              <div className="blog-content-preview">
                {blog.content && blog.content.length > 100 
                  ? `${blog.content.substring(0, 100)}...`
                  : blog.content
                }
              </div>
            </div>

            <div className="blog-actions">
              <button 
                className="btn btn-edit"
                onClick={() => onEdit(blog)}
              >
                Sửa
              </button>
              <button 
                className="btn btn-delete"
                onClick={() => onDelete(blog.blogID)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="empty-state">
          <p>Chưa có blog nào được tạo</p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            Tạo Blog Đầu Tiên
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;