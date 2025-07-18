import React, { useState, useEffect } from 'react';
import './CustomAdminPage.css';
import { customProductService } from '../../services/customProductService';
import { useNavigate } from 'react-router-dom';

// const API_BASE_URL = 'https://localhost:7218';
const API_BASE_URL = "https://api-craftique.innosphere.io.vn";

function CustomAdminPage() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
    customName: '',
    description: '',
    price: '',
    imageFile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [maxProductId, setMaxProductId] = useState(0);

  // Lấy danh sách sản phẩm custom từ API
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await customProductService.getAll();
      const productList = (res.data || []).map(item => ({
        id: item.customProductId || item.customProductID,
        productId: item.productId || item.ProductID || 0,
        customName: item.customName,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
      }));
      setProducts(productList);
      // Tìm max ProductID
      const maxId = productList.reduce((max, p) => p.productId > max ? p.productId : max, 0);
      setMaxProductId(maxId);
    } catch (err) {
      setError('Không thể tải sản phẩm custom!');
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách đơn hàng custom từ API
  const fetchOrders = async () => {
    setLoadingOrders(true);
    setErrorOrders('');
    try {
      const res = await customProductService.getAllCustomOrders();
      setOrders((res.data || []).map(item => ({
        id: item.customProductFileID,
        fileUrl: item.fileUrl,
        customText: item.customText,
        uploadedAt: item.uploadedAt,
        quantity: item.quantity,
        customProductImageUrl: item.customProductImageUrl,
        customProductName: item.customProductName
      })));
    } catch (err) {
      setErrorOrders('Không thể tải đơn hàng custom!');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  // Khi mở form thêm sản phẩm, không cần set productId vào state nữa
  useEffect(() => {
    if (showAdd) {
      // setNewProduct(prev => ({ ...prev, productId: maxProductId + 1 })); // Bỏ dòng này
    }
    // eslint-disable-next-line
  }, [showAdd]);

  // Thêm sản phẩm custom qua API (bắt buộc có ảnh, đúng trường backend)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.customName || !newProduct.price || !newProduct.imageFile) {
      setError('Vui lòng nhập đầy đủ thông tin và chọn ảnh!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Sinh ProductID tự động
      const autoProductId = products.reduce((max, p) => p.productId > max ? p.productId : max, 0) + 1;
      const formData = new FormData();
      formData.append('ProductID', autoProductId);
      formData.append('CustomName', newProduct.customName);
      formData.append('Description', newProduct.description);
      formData.append('Price', newProduct.price);
      formData.append('Image', newProduct.imageFile);
      await customProductService.addWithImage(formData);
      setShowAdd(false);
      setNewProduct({ customName: '', description: '', price: '', imageFile: null });
      fetchProducts();
    } catch (err) {
      setError('Không thể thêm sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  // Xóa sản phẩm custom qua API
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return;
    setLoading(true);
    setError('');
    try {
      await customProductService.delete(id);
      fetchProducts();
    } catch (err) {
      setError('Không thể xóa sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy src ảnh đúng
  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/120x120?text=No+Image';
    if (imageUrl.startsWith('/')) return API_BASE_URL + imageUrl;
    return imageUrl;
  };

  return (
    <div className="custom-admin-wrapper">
      <div className="custom-admin-container">
        <div className="custom-admin-tabs">
          <button
            className={`custom-admin-tab active`}
            onClick={() => setTab('products')}
          >
            Quản lý sản phẩm custom
          </button>
        </div>

        {/* Tab Quản lý sản phẩm custom */}
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 28, color: '#b46b3d' }}>Danh sách sản phẩm custom</h2>
            <button className="add-button" onClick={() => setShowAdd(true)}>
              + Thêm sản phẩm
            </button>
          </div>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          {loading && <div style={{ color: '#b46b3d', marginBottom: 12 }}>Đang tải...</div>}
          {/* Form thêm sản phẩm */}
          {showAdd && (
            <form onSubmit={handleAddProduct} className="custom-admin-form">
              {/* Bỏ trường chọn sản phẩm gốc và ProductID */}
              <div style={{ flex: 1 }}>
                <label>Tên sản phẩm</label>
                <input required value={newProduct.customName} onChange={e => setNewProduct({ ...newProduct, customName: e.target.value })} />
              </div>
              <div style={{ flex: 2 }}>
                <label>Mô tả</label>
                <input value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
              </div>
              <div style={{ width: 120 }}>
                <label>Giá (VNĐ)</label>
                <input required type="number" min={0} value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
              </div>
              <div style={{ width: 180 }}>
                <label>Ảnh (bắt buộc)</label>
                <input required type="file" accept="image/*" onChange={e => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })} />
              </div>
              <button type="submit" className="save-btn">Lưu</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAdd(false)}>Hủy</button>
            </form>
          )}
          {/* Danh sách sản phẩm custom */}
          <div className="custom-product-grid">
            {products.map(product => (
              <div key={product.id} className="custom-product-card">
                <img src={getImageSrc(product.imageUrl)} alt={product.customName} />
                <div className="product-name">{product.customName}</div>
                <div className="product-desc">{product.description}</div>
                <div className="product-price">{product.price?.toLocaleString()}đ</div>
                <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>Xóa</button>
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
}

export default CustomAdminPage;
