import React, { useState } from 'react';
import { Plus, Package, Grid, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductList from '../../components/feature/products/ProductList'
import AddProduct from '../../components/feature/products/AddProduct';
import RemoveProduct from '../../components/feature/products/RemoveProduct';
import Button from '../../components/ui/button/Button'
import './ProductPage.css';

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Pagination states for ProductItems only
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const tabs = [
    { id: 'categories', label: 'Danh mục', icon: Layers },
    { id: 'products', label: 'Sản phẩm chính', icon: Package },
    { id: 'productItems', label: 'Biến thể sản phẩm', icon: Grid }
  ];

  // Reset pagination when switching tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'productItems') {
      setCurrentPage(1);
    }
  };

  const handleAddNew = () => {
    setEditData(null);
    setShowAddModal(true);
  };

  const handleEdit = (type, data) => {
    setEditData(data);
    setShowAddModal(true);
  };

  const handleDelete = async (type, id) => {
    try {
      const result = await RemoveProduct.delete(type, id);
      
      if (result.success) {
        alert(result.message);
        triggerRefresh();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Có lỗi xảy ra khi xóa');
    }
  };

  const handleSuccess = () => {
    triggerRefresh();
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePaginationData = (paginationInfo) => {
    setTotalItems(paginationInfo.totalItems);
    setTotalPages(paginationInfo.totalPages);
    setHasNextPage(paginationInfo.hasNextPage);
    setHasPreviousPage(paginationInfo.hasPreviousPage);
  };

  const renderPagination = () => {
    if (activeTab !== 'productItems' || totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="modern-pagination">
        <div className="modern-pagination-info">
          Hiển thị {Math.min((currentPage - 1) * pageSize + 1, totalItems)} - {Math.min(currentPage * pageSize, totalItems)} của {totalItems} kết quả
        </div>
        <div className="modern-pagination-controls">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            className="modern-pagination-btn"
          >
            <ChevronLeft size={16} />
            Trước
          </Button>
          
          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                className="modern-pagination-number"
              >
                1
              </Button>
              {startPage > 2 && <span className="modern-pagination-ellipsis">...</span>}
            </>
          )}
          
          {pageNumbers.map(page => (
            <Button
              key={page}
              variant={page === currentPage ? "primary" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className={`modern-pagination-number${page === currentPage ? ' active' : ''}`}
            >
              {page}
            </Button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="modern-pagination-ellipsis">...</span>}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                className="modern-pagination-number"
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="modern-pagination-btn"
          >
            Sau
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'categories':
        return 'Quản lý danh mục';
      case 'products':
        return 'Quản lý sản phẩm chính';
      case 'productItems':
        return 'Quản lý biến thể sản phẩm';
      default:
        return 'Quản lý sản phẩm';
    }
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case 'categories':
        return 'Thêm danh mục mới';
      case 'products':
        return 'Thêm sản phẩm mới';
      case 'productItems':
        return 'Thêm biến thể mới';
      default:
        return 'Thêm mới';
    }
  };

  return (
    <div className="product-page">
      <div className="modern-header">
        <div className="header-content">
          <h1 className="modern-title">{getTabTitle()}</h1>
          <button 
            className="modern-add-btn"
            onClick={handleAddNew}
          >
            <Plus size={22} />
            {getAddButtonText()}
          </button>
        </div>
        <div className="modern-tabs">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`modern-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <IconComponent size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="modern-content">
        <ProductList
          key={refreshTrigger}
          activeTab={activeTab}
          onEdit={handleEdit}
          onDelete={handleDelete}
          // Pagination props for ProductItems only
          currentPage={activeTab === 'productItems' ? currentPage : 1}
          pageSize={pageSize}
          onPaginationData={handlePaginationData}
        />
        {renderPagination()}
      </div>
      <AddProduct
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        type={activeTab === 'categories' ? 'category' : 
              activeTab === 'products' ? 'product' : 'productItem'}
        onSuccess={handleSuccess}
        editData={editData}
      />
    </div>
  );
};

export default ProductPage;