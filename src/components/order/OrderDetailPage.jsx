import React from 'react';
import './OrderDetailPage.css';

const order = {
  id: '001',
  customer: {
    name: 'Nguyen Van A',
    phone: '0923695237',
    email: 'asdd@gmail.com',
    address: '21 đường XYZ phường XX Quận Y'
  },
  products: [
    {
      id: 'p1',
      name: 'Ly gốm sứ nhật không quai 2hand Nhật',
      price: 25000,
      quantity: 1,
      image: 'https://via.placeholder.com/60'
    },
    {
      id: 'p2',
      name: 'Ly cốc sứ có nắp đậy capybara 450ml',
      price: 120000,
      quantity: 2,
      image: 'https://via.placeholder.com/60'
    }
  ],
  shipping: 30000,
  paymentMethod: 'Trả tiền mặt sau khi nhận hàng'
};

const OrderDetailPage = () => {
  const total = order.products.reduce((sum, p) => sum + p.price * p.quantity, 0) + order.shipping;

  return (
    <div className="order-detail-page">
      <h2 className="order-title">Chi tiết đơn hàng #{order.id}</h2>

      <div className="customer-section">
        <div><strong>👤 Khách hàng:</strong> {order.customer.name}</div>
        <div><strong>📞 Điện thoại:</strong> {order.customer.phone}</div>
        <div><strong>📧 Email:</strong> {order.customer.email}</div>
      </div>

      <div className="product-list">
        {order.products.map((p) => (
          <div key={p.id} className="product-item">
            <img src={p.image} alt={p.name} />
            <div className="product-meta">
              <h4>{p.name}</h4>
              <p>Giá: {p.price.toLocaleString()} VND</p>
              <p>Số lượng: {p.quantity}</p>
              <p><strong>Thành tiền: {(p.price * p.quantity).toLocaleString()} VND</strong></p>
            </div>
          </div>
        ))}
      </div>

      <div className="summary-section">
        <div className="row">
          <span>🚚 Phí vận chuyển:</span>
          <span>{order.shipping.toLocaleString()} VND</span>
        </div>
        <div className="row total">
          <span><strong>Tổng cộng:</strong></span>
          <span><strong>{total.toLocaleString()} VND</strong></span>
        </div>
      </div>

      <div className="footer-info">
        <p><strong>💳 Thanh toán:</strong> {order.paymentMethod}</p>
        <p><strong>📍 Địa chỉ giao hàng:</strong> {order.customer.address}</p>
      </div>
    </div>
  );
};

export default OrderDetailPage;
