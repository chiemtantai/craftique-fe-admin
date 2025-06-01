import React from 'react';
import './OrderPage.css';

const orders = [
  { id: '001', name: 'Nguyen Van A', phone: '0932986237', email: 'asdd@gmail.com', amount: '295.000 VND', status: 'Chờ xác nhận' },
  { id: '002', name: 'Lê Thanh Võ', phone: '0892748135', email: 'asdd@gmail.com', amount: '150.000 VND', status: 'Đang giao hàng' },
  { id: '003', name: 'Lê Quốc Tín', phone: '0917456234', email: 'asdd@gmail.com', amount: '50.000 VND', status: 'Hoàn thành' },
  // ... thêm các dòng khác tương tự
];

const OrderPage = () => {
  return (
    <div className="order-page">
      <h2>Danh sách đơn hàng</h2>
      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm theo tên, số điện thoại, mã đơn..." />
        <button>Tìm kiếm</button>
      </div>

      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Mã Đơn</th>
              <th>Khách hàng</th>
              <th>Số Điện Thoại</th>
              <th>Địa chỉ Email</th>
              <th>Tổng Tiền</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><input type="checkbox" /></td>
                <td>{order.id}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>{order.email}</td>
                <td>{order.amount}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="view-btn">Xem chi tiết đơn hàng</button>
    </div>
  );
};

export default OrderPage;
