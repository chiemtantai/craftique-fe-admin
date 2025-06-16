import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../../services/orderService";
import { Button } from "../../ui/button/Button";
import UpdateOrderStatus from "./UpdateOrderStatus";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAll();
      setOrders(response.data.orders || []);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // Lọc đơn hàng theo tìm kiếm và trạng thái
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderID.toString().includes(searchTerm) ||
      order.userID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Lấy class CSS cho trạng thái
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Processing":
        return "status-processing";
      case "Shipped":
        return "status-shipped";
      case "Delivered":
        return "status-delivered";
      case "Completed":
        return "status-completed";
      case "Cancelled":
        return "status-cancelled";
      case "RefundRequest":
        return "status-refund-request";
      case "Refunded":
        return "status-refunded";
      default:
        return "";
    }
  };

  // Lấy text hiển thị cho trạng thái
  const getStatusText = (status) => {
    switch (status) {
      case "Pending":
        return "Chờ xử lý";
      case "Processing":
        return "Đang xử lý";
      case "Shipped":
        return "Đã giao cho shipper";
      case "Delivered":
        return "Đã giao hàng";
      case "Completed":
        return "Hoàn thành";
      case "Cancelled":
        return "Đã hủy";
      case "RefundRequest":
        return "Yêu cầu hoàn tiền";
      case "Refunded":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setShowUpdateModal(true);
  };

  const handleStatusUpdated = () => {
    fetchOrders(); // Reload danh sách
    setShowUpdateModal(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Button onClick={fetchOrders}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="order-list">
      {/* Header với tìm kiếm và lọc */}
      <div className="order-list-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng, địa chỉ..."
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
            <option value="Pending">Chờ xử lý</option>
            <option value="Processing">Đang xử lý</option>
            <option value="Shipped">Đã giao cho shipper</option>
            <option value="Delivered">Đã giao hàng</option>
            <option value="Completed">Hoàn thành</option>
            <option value="Cancelled">Đã hủy</option>
            <option value="RefundRequest">Yêu cầu hoàn tiền</option>
            <option value="Refunded">Đã hoàn tiền</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách đơn hàng */}
      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Ngày đặt</th>
              <th>Địa chỉ giao hàng</th>
              <th>Phương thức thanh toán</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr
                  key={order.orderID}
                  onClick={() => handleViewDetail(order.orderID)}
                  style={{ cursor: "pointer" }}
                  className="order-row-clickable"
                >
                  <td className="order-id">#{order.orderID}</td>
                  <td className="order-date">{formatDate(order.orderDate)}</td>
                  <td className="order-address">{order.address}</td>
                  <td className="payment-method">{order.paymentMethod}</td>
                  <td className="order-total">{formatPrice(order.total)}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusText(order.orderStatus)}
                    </span>
                  </td>
                  <td
                    className="order-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {orderService.getAvailableStatuses(order.orderStatus)
                      .length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(order)}
                        className="update-status-btn"
                      >
                        Cập nhật
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
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

      {/* Thống kê */}
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

      {/* Modal cập nhật trạng thái */}
      {showUpdateModal && selectedOrder && (
        <UpdateOrderStatus
          order={selectedOrder}
          onClose={() => setShowUpdateModal(false)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};

export default OrderList;
