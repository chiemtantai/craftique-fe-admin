import React, { useState } from 'react';
import { Plus, Package, Grid, Layers } from 'lucide-react';
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

  const tabs = [
    { id: 'categories', label: 'Danh mục', icon: Layers },
    { id: 'products', label: 'Sản phẩm chính', icon: Package },
    { id: 'productItems', label: 'Biến thể sản phẩm', icon: Grid }
  ];

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
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">{getTabTitle()}</h1>
          <button 
            className="add-button"
            onClick={handleAddNew}
          >
            <Plus size={20} />
            {getAddButtonText()}
          </button>
        </div>
        
        <div className="tabs-container">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="page-content">
        <ProductList
          key={refreshTrigger}
          activeTab={activeTab}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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