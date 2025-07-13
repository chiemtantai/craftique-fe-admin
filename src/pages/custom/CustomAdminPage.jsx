import React, { useState, useEffect } from 'react';
import './CustomAdminPage.css';
import { customProductService } from '../../services/customProductService';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "https://localhost:7218";

function CustomAdminPage() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState('');
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
  const navigate = useNavigate();

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
    if (tab === 'products') fetchProducts();
    if (tab === 'orders') fetchOrders();
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
            {errorOrders && <div style={{ color: 'red', marginBottom: 12 }}>{errorOrders}</div>}
            {loadingOrders && <div style={{ color: '#b46b3d', marginBottom: 12 }}>Đang tải...</div>}
            <div className="custom-orders-table-wrapper">
              <table className="custom-orders-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ảnh file</th>
                    <th>Sản phẩm gốc</th>
                    <th>Nội dung custom</th>
                    <th>Số lượng</th>
                    <th>Ngày upload</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr
                      key={order.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/custom/detail/${order.id}`)}
                      onKeyDown={e => { if (e.key === 'Enter') navigate(`/custom/detail/${order.id}`) }}
                      tabIndex={0}
                      className="custom-order-row"
                    >
                      <td>{order.id}</td>
                      <td>
                        {order.fileUrl && (
                          <img src={API_BASE_URL + order.fileUrl} alt="file" style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', background: '#faf7f4'}} />
                        )}
                      </td>
                      <td>
                        {order.customProductImageUrl && (
                          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                            <img src={API_BASE_URL + order.customProductImageUrl} alt="sp goc" style={{width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', background: '#faf7f4'}} />
                            <span style={{fontWeight: 500, color: '#b46b3d', fontSize: 15}}>{order.customProductName}</span>
                          </div>
                        )}
                      </td>
                      <td>{order.customText || ''}</td>
                      <td>{order.quantity}</td>
                      <td>{order.uploadedAt ? new Date(order.uploadedAt).toLocaleString() : ''}</td>
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
