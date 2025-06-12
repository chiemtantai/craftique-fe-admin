import React, { useState } from 'react';
import { Button } from '../../components/ui/button/Button';
import './OrderPage.css';

const OrderPage = () => {
  // Sample data - thay thế bằng dữ liệu thực từ API
  const [orders] = useState([
    {
      id: 'KC025418',
      customerName: 'Nguyễn Văn A',
      date: '24/03/2024 04:26 PM',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      email: 'nguyenvana@gmail.com',
      status: 'shipped',
      total: 1125000
    },
    {
      id: 'KC025419',
      customerName: 'Trần Thị B',
      date: '24/03/2024 04:26 PM',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      email: 'tranthib@gmail.com',
      status: 'processing',
      total: 899000
    },
    {
      id: 'KC025420',
      customerName: 'Lê Văn C',
      date: '24/03/2024 04:26 PM',
      address: '789 Đường DEF, Quận 7, TP.HCM',
      email: 'levanc@gmail.com',
      status: 'pending',
      total: 750000
    },
    {
      id: 'KC025421',
      customerName: 'Phạm Thị D',
      date: '24/03/2024 04:26 PM',
      address: '321 Đường GHI, Quận 5, TP.HCM',
      email: 'phamthid@gmail.com',
      status: 'cancelled',
      total: 2100000
    },
    {
      id: 'KC025422',
      customerName: 'Hoàng Văn E',
      date: '24/03/2024 04:26 PM',
      address: '654 Đường JKL, Quận 10, TP.HCM',
      email: 'hoangvane@gmail.com',
      status: 'shipped',
      total: 1450000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Lọc đơn hàng theo tìm kiếm và trạng thái
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Hàm format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Hàm lấy class CSS cho trạng thái
  const getStatusClass = (status) => {
    switch (status) {
      case 'shipped': return 'status-shipped';
      case 'processing': return 'status-processing';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  // Hàm lấy text hiển thị cho trạng thái
  const getStatusText = (status) => {
    switch (status) {
      case 'shipped': return 'Đã giao';
      case 'processing': return 'Đang xử lý';
      case 'pending': return 'Chờ xử lý';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const handleViewDetails = (orderId) => {
    // Logic để xem chi tiết đơn hàng
    console.log('View details for order:', orderId);
    // Có thể navigate đến trang chi tiết hoặc mở modal
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="order-page">
      <div className="order-page-header">
        <h1>Quản lý đơn hàng</h1>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Tên khách hàng</th>
              <th>Ngày đặt hàng</th>
              <th>Địa chỉ</th>
              <th>Email</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                  <td className="customer-name">{order.customerName}</td>
                  <td className="order-date">{order.date}</td>
                  <td className="order-address">{order.address}</td>
                  <td className="order-email">{order.email}</td>
                  <td className="order-total">{formatPrice(order.total)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                   <td className="order-actions">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(order.id)}
                      className="view-details-btn"
                    >
                      Xem chi tiết
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className="page-btn"
              >
                {page}
              </Button>
            );
          })}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Thông tin thống kê */}
      <div className="order-stats">
        <div className="stat-item">
          <span className="stat-label">Tổng đơn hàng:</span>
          <span className="stat-value">{orders.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Hiển thị:</span>
          <span className="stat-value">{filteredOrders.length}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;