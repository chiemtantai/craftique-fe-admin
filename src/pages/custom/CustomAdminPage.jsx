import React, { useState, useEffect } from 'react';
import './CustomAdminPage.css';
import { customProductService } from '../../services/customProductService';

const API_BASE_URL = "https://localhost:7218";

const initialOrders = [
  {
    id: 101,
    customer: 'Nguyễn Văn A',
    product: 'Ly Sứ Trắng',
    quantity: 2,
    total: 100000,
    status: 'Chờ xác nhận',
  },
  {
    id: 102,
    customer: 'Trần Thị B',
    product: 'TEST',
    quantity: 1,
    total: 50000,
    status: 'Đã xác nhận',
  },
];

function CustomAdminPage() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState(initialOrders);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productId: '',
    customName: '',
    description: '',
    price: '',
    imageFile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lấy danh sách sản phẩm custom từ API
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await customProductService.getAll();
      setProducts(
        (res.data || []).map(item => ({
          id: item.customProductId || item.customProductID,
          customName: item.customName,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
        }))
      );
    } catch (err) {
      setError('Không thể tải sản phẩm custom!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'products') fetchProducts();
    // eslint-disable-next-line
  }, [tab]);

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
      const formData = new FormData();
      formData.append('ProductID', newProduct.productId);
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
            className={`custom-admin-tab${tab === 'products' ? ' active' : ''}`}
            onClick={() => setTab('products')}
          >
            Quản lý sản phẩm custom
          </button>
          <button
            className={`custom-admin-tab${tab === 'orders' ? ' active' : ''}`}
            onClick={() => setTab('orders')}
          >
            Quản lý đơn hàng custom
          </button>
        </div>

        {/* Tab Quản lý sản phẩm custom */}
        {tab === 'products' && (
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
                <div style={{ width: 180 }}>
                  <label>Sản phẩm gốc (bắt buộc)</label>
                  <select
                    required
                    value={newProduct.productId}
                    onChange={e => setNewProduct({ ...newProduct, productId: e.target.value })}
                  >
                    <option value="">-- Chọn sản phẩm gốc --</option>
                    <option value="1">Bộ ly sứ in theo yêu cầu</option>
                    <option value="2">Ly sứ trắng in logo</option>
                    <option value="3">Ly sứ cao cấp viền vàng</option>
                    <option value="4">Chén cơm in tên</option>
                    <option value="5">Chén mini custom logo</option>
                    <option value="6">Đĩa tròn in ảnh gia đình</option>
                    <option value="7">Đĩa vuông nghệ thuật</option>
                  </select>
                </div>
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
        )}

        {/* Tab Quản lý đơn hàng custom */}
        {tab === 'orders' && (
          <>
            <h2 style={{ fontWeight: 700, fontSize: 28, color: '#b46b3d', marginBottom: 24 }}>Danh sách đơn hàng custom</h2>
            <div className="custom-orders-table-wrapper">
              <table className="custom-orders-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td>{order.quantity}</td>
                      <td>{order.total.toLocaleString()}đ</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CustomAdminPage;
