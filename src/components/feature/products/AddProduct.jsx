import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { categoryService } from '../../../services/categoryService'
import { productService } from '../../../services/productService';
import { productItemService } from '../../../services/productItemService';
import ProductImg from './ProductImg'

const AddProduct = ({ isOpen, onClose, type, onSuccess, editData }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [imageData, setImageData] = useState([]); // For new product items
  const [imageEditData, setImageEditData] = useState({ updatedProductImgs: [], removeImageIds: [] }); // For editing
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  const [productForm, setProductForm] = useState({
    categoryID: '',
    name: '',
    description: ''
  });

  const [productItemForm, setProductItemForm] = useState({
    productID: '',
    name: '',
    description: '',
    quantity: 0,
    price: 0
  });

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
      
      // Populate form if editing
      if (editData) {
        populateEditForm();
      }
    }
  }, [isOpen, editData, type]);

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        categoryService.getAll(),
        productService.getAll()
      ]);
      setCategories(categoriesRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const populateEditForm = () => {
    if (type === 'category' && editData) {
      setCategoryForm({
        name: editData.name || '',
        description: editData.description || ''
      });
    } else if (type === 'product' && editData) {
      setProductForm({
        categoryID: editData.categoryID || '',
        name: editData.name || '',
        description: editData.description || ''
      });
    } else if (type === 'productItem' && editData) {
      setProductItemForm({
        productID: editData.productID || '',
        name: editData.name || '',
        description: editData.description || '',
        quantity: editData.quantity || 0,
        price: editData.price || 0
      });
      
      // Initialize image edit data
      setImageEditData({ updatedProductImgs: [], removeImageIds: [] });
    }
  };

  const resetForms = () => {
    setCategoryForm({ name: '', description: '' });
    setProductForm({ categoryID: '', name: '', description: '' });
    setProductItemForm({ 
      productID: '', name: '', description: '', 
      quantity: 0, price: 0
    });
    setImageData([]);
    setImageEditData({ updatedProductImgs: [], removeImageIds: [] });
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      if (type === 'category') {
        await handleCategorySubmit();
      } else if (type === 'product') {
        await handleProductSubmit();
      } else if (type === 'productItem') {
        await handleProductItemSubmit();
      }
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async () => {
    if (!categoryForm.name.trim()) {
      alert('Vui lòng nhập tên danh mục');
      return;
    }

    if (editData) {
      await categoryService.update(editData.categoryID, categoryForm);
    } else {
      await categoryService.create(categoryForm);
    }
  };

  const handleProductSubmit = async () => {
    if (!productForm.name.trim() || !productForm.categoryID) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const data = {
      ...productForm,
      categoryID: parseInt(productForm.categoryID)
    };

    if (editData) {
      await productService.update(editData.productID, data);
    } else {
      await productService.create(data);
    }
  };

  const handleProductItemSubmit = async () => {
    if (!productItemForm.name.trim() || !productItemForm.productID) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (editData) {
      // Edit mode - use edit data structure
      const data = {
        productID: parseInt(productItemForm.productID),
        name: productItemForm.name,
        description: productItemForm.description,
        quantity: parseInt(productItemForm.quantity),
        price: parseFloat(productItemForm.price),
        updatedProductImgs: imageEditData.updatedProductImgs,
        removeImageIds: imageEditData.removeImageIds
      };

      await productItemService.update(editData.productItemID, data);
    } else {
      // Create mode - use create data structure
      const data = {
        productID: parseInt(productItemForm.productID),
        name: productItemForm.name,
        description: productItemForm.description,
        quantity: parseInt(productItemForm.quantity),
        price: parseFloat(productItemForm.price),
        imageUrls: imageData // This should be array of strings
      };

      await productItemService.create(data);
    }
  };

  const handleImagesChange = (newImageData) => {
    if (editData) {
      // For editing, expect object with updatedProductImgs and removeImageIds
      setImageEditData(newImageData);
    } else {
      // For new items, expect array of image URLs
      setImageData(newImageData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {editData ? 'Chỉnh sửa' : 'Thêm mới'} {' '}
            {type === 'category' && 'danh mục'}
            {type === 'product' && 'sản phẩm'}
            {type === 'productItem' && 'biến thể sản phẩm'}
          </h3>
          <button onClick={handleClose} className="modal-close">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content">
          {type === 'category' && (
            <div className="form-fields">
              <div className="form-field">
                <label className="form-label">Tên danh mục *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  placeholder="Ví dụ: Ly, Chén, Đĩa..."
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Mô tả</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  placeholder="Mô tả về danh mục..."
                  className="form-input"
                  rows="3"
                />
              </div>
            </div>
          )}

          {type === 'product' && (
            <div className="form-fields">
              <div className="form-field">
                <label className="form-label">Danh mục *</label>
                <select
                  value={productForm.categoryID}
                  onChange={(e) => setProductForm({...productForm, categoryID: e.target.value})}
                  className="form-select"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category.categoryID} value={category.categoryID}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  placeholder="Ví dụ: Ly hoa xuất xứ từ Nhật"
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Mô tả</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  placeholder="Mô tả về sản phẩm..."
                  className="form-input"
                  rows="3"
                />
              </div>
            </div>
          )}

          {type === 'productItem' && (
            <div className="form-fields">
              <div className="form-field">
                <label className="form-label">Sản phẩm chính *</label>
                <select
                  value={productItemForm.productID}
                  onChange={(e) => setProductItemForm({...productItemForm, productID: e.target.value})}
                  className="form-select"
                >
                  <option value="">Chọn sản phẩm chính</option>
                  {products.map(product => (
                    <option key={product.productID} value={product.productID}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Tên biến thể *</label>
                <input
                  type="text"
                  value={productItemForm.name}
                  onChange={(e) => setProductItemForm({...productItemForm, name: e.target.value})}
                  placeholder="Ví dụ: Ly hoa màu đỏ"
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Mô tả</label>
                <textarea
                  value={productItemForm.description}
                  onChange={(e) => setProductItemForm({...productItemForm, description: e.target.value})}
                  placeholder="Mô tả về biến thể..."
                  className="form-input"
                  rows="2"
                />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Giá tiền (VND) *</label>
                  <input
                    type="number"
                    value={productItemForm.price}
                    onChange={(e) => setProductItemForm({...productItemForm, price: e.target.value})}
                    placeholder="100000"
                    className="form-input"
                    min="0"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Số lượng *</label>
                  <input
                    type="number"
                    value={productItemForm.quantity}
                    onChange={(e) => setProductItemForm({...productItemForm, quantity: e.target.value})}
                    placeholder="100"
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>
              
              {/* Product Images Component */}
              <div className="form-field">
                <label className="form-label">Hình ảnh sản phẩm</label>
                <ProductImg
                  images={editData ? [] : imageData} // For new items, pass current imageData
                  onImagesChange={handleImagesChange}
                  productItemId={editData?.productItemID}
                  isEditing={!!editData} // Pass editing mode flag
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            onClick={handleClose}
            className="modal-button cancel"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="modal-button confirm"
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : (editData ? 'Cập nhật' : 'Thêm mới')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;