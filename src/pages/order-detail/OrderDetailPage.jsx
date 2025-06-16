import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { productItemService } from '../../services/productItemService';
import { Button } from '../../components/ui/button/Button'
import UpdateOrderStatus from '../../components/feature/orders/UpdateOrderStatus'
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { orderID } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [productItems, setProductItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    if (orderID) {
      fetchOrderDetail();
    }
  }, [orderID]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await orderService.getById(orderID);
      const orderData = response.data;
      setOrder(orderData);
      
      // Fetch product item details for each order detail
      if (orderData.orderDetails && orderData.orderDetails.length > 0) {
        await fetchProductItems(orderData.orderDetails);
      }
      
      setError(null);
    } catch (err) {
      setError('Không thể tải chi tiết đơn hàng');
      console.error('Error fetching order detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductItems = async (orderDetails) => {
    try {
      const productItemsData = {};
      
      // Fetch all product items concurrently
      const fetchPromises = orderDetails.map(async (detail) => {
        try {
          const response = await productItemService.getById(detail.productItemID);
          productItemsData[detail.productItemID] = response.data;
        } catch (error) {
          console.error(`Error fetching product item ${detail.productItemID}:`, error);
          // Set fallback data if fetch fails
          productItemsData[detail.productItemID] = {
            productItemID: detail.productItemID,
            productName: 'Không thể tải thông tin sản phẩm',
            sku: 'N/A',
            image: null,
            price: detail.price
          };
        }
      });

      await Promise.all(fetchPromises);
      setProductItems(productItemsData);
    } catch (error) {
      console.error('Error fetching product items:', error);
    }
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Lấy class CSS cho trạng thái
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Processing': return 'status-processing';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      case 'RefundRequest': return 'status-refund-request';
      case 'Refunded': return 'status-refunded';
      default: return '';
    }
  };

  // Lấy text hiển thị cho trạng thái
  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return 'Chờ xử lý';
      case 'Processing': return 'Đang xử lý';
      case 'Shipped': return 'Đã giao cho shipper';
      case 'Delivered': return 'Đã giao hàng';
      case 'Completed': return 'Hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      case 'RefundRequest': return 'Yêu cầu hoàn tiền';
      case 'Refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  const handleUpdateStatus = () => {
    setShowUpdateModal(true);
  };

  const handleStatusUpdated = () => {
    fetchOrderDetail(); // Reload chi tiết đơn hàng
    setShowUpdateModal(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="order-detail-loading">
        <div className="loading-spinner">Đang tải chi tiết đơn hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-error">
        <div className="error-message">{error}</div>
        <div className="error-actions">
          <Button onClick={fetchOrderDetail}>Thử lại</Button>
          <Button variant="outline" onClick={handleGoBack}>Quay lại</Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-not-found">
        <div className="not-found-message">Không tìm thấy đơn hàng</div>
        <Button variant="outline" onClick={handleGoBack}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      {/* Header */}
      <div className="order-detail-header">
        <div className="header-left">
          <Button variant="outline" onClick={handleGoBack} className="back-btn">
            ← Quay lại
          </Button>
          <h1>Chi tiết đơn hàng #{order.orderID}</h1>
        </div>
        <div className="header-right">
          {orderService.getAvailableStatuses(order.orderStatus).length > 0 && (
            <Button onClick={handleUpdateStatus} className="update-status-btn">
              Cập nhật trạng thái
            </Button>
          )}
        </div>
      </div>

      {/* Order Information */}
      <div className="order-detail-content">
        <div className="order-info-section">
          <h2>Thông tin đơn hàng</h2>
          <div className="order-info-grid">
            <div className="info-item">
              <label>Mã đơn hàng:</label>
              <span>#{order.orderID}</span>
            </div>
            <div className="info-item">
              <label>Ngày đặt hàng:</label>
              <span>{formatDate(order.orderDate)}</span>
            </div>
            <div className="info-item">
              <label>Mã khách hàng:</label>
              <span>{order.userID}</span>
            </div>
            <div className="info-item">
              <label>Mã shipper:</label>
              <span>{order.shipperID || 'Chưa phân công'}</span>
            </div>
            <div className="info-item">
              <label>Địa chỉ giao hàng:</label>
              <span>{order.address}</span>
            </div>
            <div className="info-item">
              <label>Phương thức thanh toán:</label>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="info-item">
              <label>Phương thức vận chuyển:</label>
              <span>ID: {order.shippingMethodID}</span>
            </div>
            <div className="info-item">
              <label>Mã voucher:</label>
              <span>{order.voucherID || 'Không có'}</span>
            </div>
            <div className="info-item">
              <label>Trạng thái:</label>
              <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                {getStatusText(order.orderStatus)}
              </span>
            </div>
            <div className="info-item">
              <label>Tổng tiền:</label>
              <span className="total-amount">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="order-details-section">
          <h2>Chi tiết sản phẩm</h2>
          <div className="order-details-table">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Mã sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                  <th>Tổng cộng</th>
                </tr>
              </thead>
              <tbody>
                {order.orderDetails && order.orderDetails.length > 0 ? (
                  order.orderDetails.map((detail, index) => {
                    const productItem = productItems[detail.productItemID];
                    return (
                      <tr key={detail.orderDetailID}>
                        <td>{index + 1}</td>
                        <td>
                          {productItem?.image ? (
                            <img 
                              src={productItem.image} 
                              alt={productItem.name || 'Product'}
                              className="product-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="no-image">
                              <span>Không có ảnh</span>
                            </div>
                          )}
                        </td>
                        <td className="product-name">
                          {productItem?.name || 'Đang tải...'}
                        </td>
                        <td>{productItem?.sku || 'N/A'}</td>
                        <td>#{detail.productItemID}</td>
                        <td className="quantity">{detail.quantity}</td>
                        <td>{formatPrice(detail.price)}</td>
                        <td className="subtotal">{formatPrice(detail.price * detail.quantity)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      Không có chi tiết sản phẩm
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-section">
          <div className="summary-content">
            <div className="summary-row">
              <span>Tổng số lượng:</span>
              <span>
                {order.orderDetails ? 
                  order.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0) : 0
                } sản phẩm
              </span>
            </div>
            <div className="summary-row">
              <span>Tổng số mặt hàng:</span>
              <span>{order.orderDetails ? order.orderDetails.length : 0} mặt hàng</span>
            </div>
            <div className="summary-row total-row">
              <span>Tổng tiền:</span>
              <span className="total-amount">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal cập nhật trạng thái */}
      {showUpdateModal && (
        <UpdateOrderStatus
          order={order}
          onClose={() => setShowUpdateModal(false)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};

export default OrderDetailPage;