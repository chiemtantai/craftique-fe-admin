import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customProductService } from '../../services/customProductService';
import './CustomAdminDetail.css';

const API_BASE_URL = "https://localhost:7218";

function CustomAdminDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const getImageSrc = (url) => {
    if (!url) return 'https://via.placeholder.com/120x120?text=No+Image';
    if (url.startsWith('/')) return API_BASE_URL + url;
    return url;
  };

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
          <img src={getImageSrc(detail.fileUrl)} alt="file" className="custom-admin-detail-img" />
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
    </div>
  );
}

export default CustomAdminDetail; 