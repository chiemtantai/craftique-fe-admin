import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package, Tag, Image, X } from 'lucide-react';
import {Button} from '../../components/ui/button/Button'
import './ProductPage.css';

const ProductPage = () => {
  // State quản lý dữ liệu
  const [categories, setCategories] = useState([
    { id: 1, name: 'Ly', origin: 'Nhật' },
    { id: 2, name: 'Chén', origin: 'Trung Quốc' }
  ]);

  const [mainProducts, setMainProducts] = useState([
    { id: 1, name: 'Ly hoa xuất xứ từ Nhật', categoryId: 1 },
    { id: 2, name: 'Chén rồng xuất xứ từ Trung Quốc', categoryId: 2 }
  ]);

  const [productVariants, setProductVariants] = useState([
    { 
      id: 1, 
      mainProductId: 1, 
      color: 'Đỏ', 
      price: 100000, 
      quantity: 100, 
      image: 'https://via.placeholder.com/150?text=Ly+Hoa+Do' 
    },
    { 
      id: 2, 
      mainProductId: 1, 
      color: 'Xanh', 
      price: 120000, 
      quantity: 50, 
      image: 'https://via.placeholder.com/150?text=Ly+Hoa+Xanh' 
    }
  ]);

  // State cho modal và tab
  const [activeTab, setActiveTab] = useState('categories');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Form states
  const [categoryForm, setCategoryForm] = useState({ name: '', origin: '' });
  const [mainProductForm, setMainProductForm] = useState({ name: '', categoryId: '' });
  const [variantForm, setVariantForm] = useState({ 
    mainProductId: '', color: '', price: '', quantity: '', image: ''
  });

  // Xử lý modal
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCategoryForm({ name: '', origin: '' });
    setMainProductForm({ name: '', categoryId: '' });
    setVariantForm({ mainProductId: '', color: '', price: '', quantity: '', image: '' });
  };

  // Thêm dữ liệu
  const handleAdd = () => {
    if (modalType === 'category' && categoryForm.name && categoryForm.origin) {
      setCategories([...categories, { id: Date.now(), ...categoryForm }]);
    } else if (modalType === 'mainProduct' && mainProductForm.name && mainProductForm.categoryId) {
      setMainProducts([...mainProducts, { id: Date.now(), ...mainProductForm, categoryId: parseInt(mainProductForm.categoryId) }]);
    } else if (modalType === 'variant' && variantForm.mainProductId && variantForm.color && variantForm.price && variantForm.quantity) {
      setProductVariants([...productVariants, { 
        id: Date.now(), 
        ...variantForm,
        mainProductId: parseInt(variantForm.mainProductId),
        price: parseInt(variantForm.price),
        quantity: parseInt(variantForm.quantity),
        image: variantForm.image || 'https://via.placeholder.com/150?text=No+Image'
      }]);
    }
    closeModal();
  };

  // Xóa dữ liệu
  const handleDelete = (type, id) => {
    if (type === 'category') {
      setCategories(categories.filter(cat => cat.id !== id));
    } else if (type === 'mainProduct') {
      setMainProducts(mainProducts.filter(product => product.id !== id));
      setProductVariants(productVariants.filter(variant => variant.mainProductId !== id));
    } else if (type === 'variant') {
      setProductVariants(productVariants.filter(variant => variant.id !== id));
    }
  };

  // Helper functions
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? `${category.name} (${category.origin})` : 'Không xác định';
  };

  const getMainProductName = (mainProductId) => {
    const product = mainProducts.find(p => p.id === mainProductId);
    return product ? product.name : 'Không xác định';
  };

  const tabs = [
    { id: 'categories', label: 'Danh mục sản phẩm', icon: Tag },
    { id: 'mainProducts', label: 'Sản phẩm chính', icon: Package },
    { id: 'variants', label: 'Biến thể sản phẩm', icon: Image }
  ];

  return (
    <div className="product-page">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1 className="title">Quản lý sản phẩm</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-container">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="content">
        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="tab-content">
            <div className="section-header">
              <h2 className="section-title">Danh mục sản phẩm</h2>
              <button
                onClick={() => openModal('category')}
                className="add-button"
              >
                <Plus size={20} />
                Thêm danh mục
              </button>
            </div>
            
            <div className="cards-grid">
              {categories.map(category => (
                <div key={category.id} className="card">
                  <div className="card-content">
                    <div className="card-info">
                      <h3 className="card-title">{category.name}</h3>
                      <p className="card-subtitle">Xuất xứ: {category.origin}</p>
                    </div>
                    <div className="card-actions">
                      <Button variant="edit" size="sm">
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="delete" 
                        size="sm"
                        onClick={() => handleDelete('category', category.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Products Tab */}
        {activeTab === 'mainProducts' && (
          <div className="tab-content">
            <div className="section-header">
              <h2 className="section-title">Sản phẩm chính</h2>
              <button
                onClick={() => openModal('mainProduct')}
                className="add-button"
              >
                <Plus size={20} />
                Thêm sản phẩm
              </button>
            </div>
            
            <div className="cards-grid">
              {mainProducts.map(product => (
                <div key={product.id} className="card">
                  <div className="card-content">
                    <div className="card-info">
                      <h3 className="card-title">{product.name}</h3>
                      <p className="card-subtitle">Danh mục: {getCategoryName(product.categoryId)}</p>
                      <p className="card-meta">Số biến thể: {productVariants.filter(v => v.mainProductId === product.id).length}</p>
                    </div>
                    <div className="card-actions">
                      <Button variant="edit" size="sm">
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="delete" 
                        size="sm"
                        onClick={() => handleDelete('mainProduct', product.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Variants Tab */}
        {activeTab === 'variants' && (
          <div className="tab-content">
            <div className="section-header">
              <h2 className="section-title">Biến thể sản phẩm</h2>
              <button
                onClick={() => openModal('variant')}
                className="add-button"
              >
                <Plus size={20} />
                Thêm biến thể
              </button>
            </div>
            
            <div className="variant-grid">
              {productVariants.map(variant => (
                <div key={variant.id} className="variant-card">
                  <div className="variant-content">
                    <div className="variant-image">
                      <img src={variant.image} alt="Product" />
                    </div>
                    <div className="variant-info">
                      <h3 className="variant-title">{getMainProductName(variant.mainProductId)}</h3>
                      <p className="variant-color">Màu sắc: {variant.color}</p>
                      <p className="variant-price">{variant.price.toLocaleString()}₫</p>
                      <p className="variant-quantity">Số lượng: {variant.quantity}</p>
                    </div>
                    <div className="variant-actions">
                      <Button variant="edit" size="sm">
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="delete" 
                        size="sm"
                        onClick={() => handleDelete('variant', variant.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalType === 'category' && 'Thêm danh mục mới'}
                {modalType === 'mainProduct' && 'Thêm sản phẩm mới'}
                {modalType === 'variant' && 'Thêm biến thể sản phẩm'}
              </h3>
              <button
                onClick={closeModal}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              {modalType === 'category' && (
                <div className="form-fields">
                  <div className="form-field">
                    <label className="form-label">Tên danh mục</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      placeholder="Ví dụ: Ly, Chén, Đĩa..."
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Xuất xứ</label>
                    <input
                      type="text"
                      value={categoryForm.origin}
                      onChange={(e) => setCategoryForm({...categoryForm, origin: e.target.value})}
                      placeholder="Ví dụ: Nhật, Trung Quốc, Việt Nam..."
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              {modalType === 'mainProduct' && (
                <div className="form-fields">
                  <div className="form-field">
                    <label className="form-label">Tên sản phẩm</label>
                    <input
                      type="text"
                      value={mainProductForm.name}
                      onChange={(e) => setMainProductForm({...mainProductForm, name: e.target.value})}
                      placeholder="Ví dụ: Ly hoa xuất xứ từ Nhật"
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Danh mục</label>
                    <select
                      value={mainProductForm.categoryId}
                      onChange={(e) => setMainProductForm({...mainProductForm, categoryId: e.target.value})}
                      className="form-select"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.origin})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {modalType === 'variant' && (
                <div className="form-fields">
                  <div className="form-field">
                    <label className="form-label">Sản phẩm chính</label>
                    <select
                      value={variantForm.mainProductId}
                      onChange={(e) => setVariantForm({...variantForm, mainProductId: e.target.value})}
                      className="form-select"
                    >
                      <option value="">Chọn sản phẩm chính</option>
                      {mainProducts.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">Màu sắc</label>
                      <input
                        type="text"
                        value={variantForm.color}
                        onChange={(e) => setVariantForm({...variantForm, color: e.target.value})}
                        placeholder="Đỏ, Xanh..."
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Số lượng</label>
                      <input
                        type="number"
                        value={variantForm.quantity}
                        onChange={(e) => setVariantForm({...variantForm, quantity: e.target.value})}
                        placeholder="100"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Giá tiền (VND)</label>
                    <input
                      type="number"
                      value={variantForm.price}
                      onChange={(e) => setVariantForm({...variantForm, price: e.target.value})}
                      placeholder="100000"
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Hình ảnh (URL)</label>
                    <input
                      type="url"
                      value={variantForm.image}
                      onChange={(e) => setVariantForm({...variantForm, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                      className="form-input"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={closeModal}
                className="modal-button cancel"
              >
                Hủy
              </button>
              <button
                onClick={handleAdd}
                className="modal-button confirm"
              >
                {modalType === 'category' && 'Thêm danh mục'}
                {modalType === 'mainProduct' && 'Thêm sản phẩm'}
                {modalType === 'variant' && 'Thêm biến thể'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;