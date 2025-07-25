import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customProductService } from '../../services/customProductService';
import './CustomAdminDetail.css';


function CustomAdminDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) fetchDetail();
    // eslint-disable-next-line
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await customProductService.getCustomOrderDetail(id);
      setDetail(res.data);
    } catch (err) {
      setError('Không thể tải chi tiết đơn hàng custom!');
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (url) => url;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <div className="custom-admin-detail-wrapper">Đang tải chi tiết...</div>;
  if (error) return <div className="custom-admin-detail-wrapper" style={{ color: 'red' }}>{error}</div>;
  if (!detail) return <div className="custom-admin-detail-wrapper">Không tìm thấy đơn hàng custom</div>;

  return (
    <div className="custom-admin-detail-wrapper">
      <button onClick={() => navigate(-1)} className="custom-admin-detail-back">← Quay lại</button>
      <h1 className="custom-admin-detail-title">Chi tiết đơn hàng custom #{detail.customProductFileID}</h1>
      <div className="custom-admin-detail-main">
        {/* Ảnh khách muốn in lên */}
        <div className="custom-admin-detail-col">
          <span className="custom-admin-detail-label">Ảnh khách muốn in lên</span>
          <img
            src={getImageSrc(detail.fileUrl)}
            alt="Ảnh khách tải lên"
            className="customer-image"
            style={{ cursor: 'pointer' }}
            onClick={openModal}
          />
        </div>
        {/* Ảnh sản phẩm gốc */}
        <div className="custom-admin-detail-col">
          <span className="custom-admin-detail-label">Sản phẩm gốc</span>
          <img src={getImageSrc(detail.customProductImageUrl)} alt="product" className="custom-admin-detail-img" />
          <div className="custom-admin-detail-product-name">{detail.customProductName}</div>
        </div>
      </div>
      <div className="custom-admin-detail-info-box">
        <div className="custom-admin-detail-info-row">
          <span className="custom-admin-detail-info-label">Nội dung custom:</span> <b>{detail.customText || '(Không có)'}</b>
        </div>
        <div className="custom-admin-detail-info-row">
          <span className="custom-admin-detail-info-label">Số lượng:</span> <b>{detail.quantity}</b>
        </div>
        <div className="custom-admin-detail-info-row">
          <span className="custom-admin-detail-info-label">Ngày upload:</span> <b>{detail.uploadedAt ? new Date(detail.uploadedAt).toLocaleString() : ''}</b>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={getImageSrc(detail.fileUrl)} alt="Ảnh lớn" style={{ maxWidth: '90vw', maxHeight: '80vh' }} />
            <a
              href={getImageSrc(detail.fileUrl)}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="download-btn"
            >
              Tải về
            </a>
            <button onClick={closeModal} className="close-btn">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomAdminDetail; 