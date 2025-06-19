import React, { useState } from 'react';
import BlogList from '../../components/feature/blogs/BlogList';
import CreateBlog from '../../components/feature/blogs/CreateBlog';
import UpdateBlog from '../../components/feature/blogs/UpdateBlog';
import DeleteBlog from '../../components/feature/blogs/DeleteBlog'
import './BlogPage.css';

const BlogPage = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Handlers for different actions
  const handleCreateNew = () => {
    setCurrentView('create');
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setCurrentView('edit');
  };

  const handleDelete = (blogId) => {
    setBlogToDelete(blogId);
    setCurrentView('delete');
  };

  const handleSuccess = () => {``
    setCurrentView('list');
    setSelectedBlog(null);
    setBlogToDelete(null);
    // Force refresh của BlogList
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedBlog(null);
    setBlogToDelete(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <CreateBlog
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        );
      
      case 'edit':
        return (
          <UpdateBlog
            blog={selectedBlog}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        );
      
      case 'delete':
        return (
          <DeleteBlog
            blogId={blogToDelete}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        );
      
      default:
        return (
          <BlogList
            key={refreshKey}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateNew={handleCreateNew}
          />
        );
    }
  };

  return (
    <div className="blog-page">
      <div className="blog-page-container">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default BlogPage;