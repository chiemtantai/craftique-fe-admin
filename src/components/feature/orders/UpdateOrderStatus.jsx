import React, { useState, useEffect } from 'react';
import { shipperService } from '../../../services/shipperService';
import { orderService } from '../../../services/orderService';
import { Button } from '../../ui/button/Button'

const UpdateOrderStatus = ({ order, onClose, onStatusUpdated }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedShipper, setSelectedShipper] = useState('');
  const [shippers, setShippers] = useState([]);
  const [refundReason, setRefundReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingShippers, setLoadingShippers] = useState(false);
  const [error, setError] = useState('');

  const availableStatuses = orderService.getAvailableStatuses(order.orderStatus);
  const needsShipper = order.orderStatus === 'Processing'; // Cần chọn shipper khi chuyển từ Processing sang Shipped
  const needsRefundReason = order.orderStatus === 'RefundRequest'; // Cần lý do hoàn tiền

  useEffect(() => {
    if (needsShipper) {
      fetchShippers();
    }
  }, [needsShipper]);

  const fetchShippers = async () => {
    try {
      setLoadingShippers(true);
      const response = await shipperService.getAll();
      setShippers(response.data || []);
    } catch (err) {
      console.error('Error fetching shippers:', err);
      setError('Không thể tải danh sách shipper');
    } finally {
      setLoadingShippers(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Processing': return 'Đang xử lý';
      case 'Shipped': return 'Đã giao cho shipper';
      case 'Delivered': return 'Đã giao hàng';
      case 'Completed': return 'Hoàn thành';
      case 'Refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStatus) {
      setError('Vui lòng chọn trạng thái mới');
      return;
    }

    if (needsShipper && !selectedShipper) {
      setError('Vui lòng chọn shipper để giao hàng');
      return;
    }

    if (needsRefundReason && !refundReason.trim()) {
      setError('Vui lòng nhập lý do hoàn tiền');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Gọi API tương ứng dựa trên trạng thái
      switch (selectedStatus) {
        case 'Processing':
          await orderService.processingOrder(order.orderID);
          break;
        case 'Shipped':
          await orderService.shipOrder(order.orderID, selectedShipper);
          break;
        case 'Delivered':
          await orderService.deliverOrder(order.orderID);
          break;
        case 'Completed':
          await orderService.completeOrder(order.orderID);
          break;
        case 'Refunded':
          await orderService.approveRefund(order.orderID, refundReason);
          break;
        default:
          throw new Error('Trạng thái không hợp lệ');
      }

      onStatusUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      console.error('Error updating order status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Cập nhật trạng thái đơn hàng #{order.orderID}</h3>
          <button 
            className="modal-close"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="order-info">
            <p><strong>Trạng thái hiện tại:</strong> {getStatusText(order.orderStatus)}</p>
            <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(order.total)}</p>
            <p><strong>Địa chỉ:</strong> {order.address}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Chọn trạng thái mới */}
            <div className="form-group">
              <label htmlFor="status">Trạng thái mới:</label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={loading}
                required
              >
                <option value="">-- Chọn trạng thái --</option>
                {availableStatuses.map(status => (
                  <option key={status} value={status}>
                    {getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn shipper nếu cần */}
            {needsShipper && selectedStatus === 'Shipped' && (
              <div className="form-group">
                <label htmlFor="shipper">Chọn shipper:</label>
                {loadingShippers ? (
                  <div className="loading-text">Đang tải danh sách shipper...</div>
                ) : (
                  <select
                    id="shipper"
                    value={selectedShipper}
                    onChange={(e) => setSelectedShipper(e.target.value)}
                    disabled={loading}
                    required
                  >
                    <option value="">-- Chọn shipper --</option>
                    {shippers.map(shipper => (
                      <option key={shipper.id} value={shipper.id}>
                        {shipper.name} ({shipper.pendingOrdersCount} đơn đang giao)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Nhập lý do hoàn tiền nếu cần */}
            {needsRefundReason && selectedStatus === 'Refunded' && (
              <div className="form-group">
                <label htmlFor="refundReason">Lý do hoàn tiền:</label>
                <textarea
                  id="refundReason"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Nhập lý do hoàn tiền..."
                  disabled={loading}
                  required
                  rows={3}
                />
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="modal-actions">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading || !selectedStatus}
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;