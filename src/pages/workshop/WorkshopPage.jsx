import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, User, Check, X } from "lucide-react";
import { Button } from "../../components/ui/button/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table/Table";
import { useWorkshopList } from "../../components/feature/workshops/workshopList";
import { useSendEmail } from "../../components/feature/workshops/SendEmail";
import { useConfirmEmail } from "../../components/feature/workshops/ConfirmEmail";
import { useRejectEmail } from "../../components/feature/workshops/RejectEmail";
import "./WorkshopPage.css";

// Email Modal Component
const EmailModal = ({
  isOpen,
  onClose,
  onSend,
  registration,
  defaultSubject,
  defaultBody,
  loading,
}) => {
  const [subject, setSubject] = useState(defaultSubject || "");
  const [body, setBody] = useState(defaultBody || "");

  // Update state when props change
  useEffect(() => {
    if (isOpen && defaultSubject) {
      setSubject(defaultSubject);
    }
  }, [isOpen, defaultSubject]);

  useEffect(() => {
    if (isOpen && defaultBody) {
      setBody(defaultBody);
    }
  }, [isOpen, defaultBody]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(subject, body);
  };

  const handleClose = () => {
    // Reset form when closing
    setSubject("");
    setBody("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Gửi email cho {registration?.fullName}</h3>
          <button onClick={handleClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="subject">Tiêu đề email:</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Nhập tiêu đề email"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="body">Nội dung email:</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Nhập nội dung email"
              required
              rows={8}
              className="form-textarea"
            />
          </div>

          <div className="modal-actions">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi email"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RejectModal = ({ isOpen, onClose, onReject, registration, loading }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onReject(reason);
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Từ chối đăng ký của {registration?.fullName}</h3>
          <button onClick={handleClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="reason">Lý do từ chối:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do từ chối đăng ký"
              required
              rows={4}
              className="form-textarea"
            />
          </div>
          
          <div className="modal-actions">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="reject-btn">
              {loading ? "Đang xử lý..." : "Từ chối"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Bulk Email Modal Component
const BulkEmailModal = ({
  isOpen,
  onClose,
  onSend,
  confirmedCount,
  loading,
}) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // Set default values when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubject("Thông báo Workshop");
      setBody(
        "Xin chào,\n\nChúng tôi xin thông báo về workshop sắp tới.\n\nTrân trọng,\nBan tổ chức"
      );
    }
  }, [isOpen]);


  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(subject, body);
  };

  const handleClose = () => {
    // Reset form when closing
    setSubject("");
    setBody("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Gửi email hàng loạt ({confirmedCount} người)</h3>
          <button onClick={handleClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="bulk-subject">Tiêu đề email:</label>
            <input
              id="bulk-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Nhập tiêu đề email"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bulk-body">Nội dung email:</label>
            <textarea
              id="bulk-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Nhập nội dung email"
              required
              rows={8}
              className="form-textarea"
            />
          </div>

          <div className="modal-actions">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Đang gửi..."
                : `Gửi email cho ${confirmedCount} người`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const WorkshopPage = () => {
  const { workshops, loading, error, refreshData } = useWorkshopList();
  const {
    sendSingleEmail,
    sendBulkEmail,
    loading: emailLoading,
  } = useSendEmail();
  const { confirmRegistration, loading: confirmLoading } = useConfirmEmail();
  const { rejectRegistration, loading: rejectLoading } = useRejectEmail();

  // Modal states
  const [emailModal, setEmailModal] = useState({
    isOpen: false,
    registration: null,
  });

  const [bulkEmailModal, setBulkEmailModal] = useState(false);

  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    registration: null,
  });

  const handleSendEmail = (registration) => {
    const defaultSubject = "Thông báo về Workshop";
    const defaultBody = `Xin chào ${registration.fullName},\n\nCảm ơn bạn đã đăng ký tham gia ${registration.workshopName}.\n\nTrân trọng,\nĐội ngũ Craftique`;

    setEmailModal({
      isOpen: true,
      registration,
      defaultSubject,
      defaultBody,
    });
  };

  const handleSendSingleEmail = async (subject, body) => {
    const result = await sendSingleEmail(
      emailModal.registration.id,
      subject,
      body
    );
    alert(result.message);
    if (result.success) {
      setEmailModal({ isOpen: false, registration: null });
    }
  };

  const handleOpenBulkEmail = () => {
    const confirmedCount = workshops.filter(
      (w) => w.status === "ĐÃ XÁC NHẬN"
    ).length;

    if (confirmedCount === 0) {
      alert("Không có người đăng ký nào được xác nhận để gửi email!");
      return;
    }

    setBulkEmailModal(true);
  };

  const handleSendBulkEmail = async (subject, body) => {
    const confirmedIds = workshops
      .filter((w) => w.status === "ĐÃ XÁC NHẬN")
      .map((w) => w.id);

    const result = await sendBulkEmail(confirmedIds, subject, body);
    alert(result.message);
    if (result.success) {
      setBulkEmailModal(false);
    }
  };

  const handleConfirm = async (id) => {
    const result = await confirmRegistration(id);
    alert(result.message);
    if (result.success) {
      refreshData();
    }
  };

  const handleReject = (registration) => {
    setRejectModal({ isOpen: true, registration });
  };

  const handleConfirmReject = async (reason) => {
    const result = await rejectRegistration(
      rejectModal.registration.id,
      reason
    );
    alert(result.message);
    if (result.success) {
      setRejectModal({ isOpen: false, registration: null });
      refreshData();
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "ĐÃ XÁC NHẬN": { text: "Đã xác nhận", class: "status-confirmed" },
      "CHỜ XÁC NHẬN": { text: "Chờ xác nhận", class: "status-pending" },
      "ĐÃ HỦY": { text: "Đã hủy", class: "status-cancelled" },
    };

    const config = statusConfig[status] || statusConfig["CHỜ XÁC NHẬN"];
    return (
      <span className={`status-badge ${config.class}`}>{config.text}</span>
    );
  };

  const stats = {
    total: workshops.length,
    confirmed: workshops.filter((r) => r.status === "ĐÃ XÁC NHẬN").length,
    pending: workshops.filter((r) => r.status === "CHỜ XÁC NHẬN").length,
    cancelled: workshops.filter((r) => r.status === "ĐÃ HỦY").length,
  };

  if (loading)
    return (
      <div className="workshop-page">
        <div className="workshop-main-container">Đang tải...</div>
      </div>
    );
  if (error)
    return (
      <div className="workshop-page">
        <div className="workshop-main-container">Lỗi: {error}</div>
      </div>
    );

  return (
    <div className="workshop-page">
      <main className="workshop-main-container">
        <div className="workshop-header-section">
          <h1 className="workshop-page-title">Quản lý Workshop</h1>

          <div className="stats-grid">
            <Card className="stat-card">
              <CardContent className="stat-card-content">
                <div className="stat-info">
                  <div className="stat-number">{stats.total}</div>
                  <div className="stat-label">Tổng đăng ký</div>
                </div>
                <User className="stat-icon" />
              </CardContent>
            </Card>

            <Card className="stat-card confirmed">
              <CardContent className="stat-card-content">
                <div className="stat-info">
                  <div className="stat-number">{stats.confirmed}</div>
                  <div className="stat-label">Đã xác nhận</div>
                </div>
                <Check className="stat-icon" />
              </CardContent>
            </Card>

            <Card className="stat-card pending">
              <CardContent className="stat-card-content">
                <div className="stat-info">
                  <div className="stat-number">{stats.pending}</div>
                  <div className="stat-label">Chờ xác nhận</div>
                </div>
                <Calendar className="stat-icon" />
              </CardContent>
            </Card>

            <Card className="stat-card cancelled">
              <CardContent className="stat-card-content">
                <div className="stat-info">
                  <div className="stat-number">{stats.cancelled}</div>
                  <div className="stat-label">Đã hủy</div>
                </div>
                <X className="stat-icon" />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="actions-section">
          <Button
            onClick={handleOpenBulkEmail}
            className="bulk-email-button"
            disabled={emailLoading}
          >
            <Mail className="w-4 h-4 mr-2" />
            {emailLoading ? "Đang gửi..." : "Gửi email hàng loạt"}
          </Button>
        </div>

        <Card className="registrations-card">
          <CardHeader>
            <CardTitle>Danh sách đăng ký Workshop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Workshop</TableHead>
                    <TableHead>Ngày đăng ký</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workshops.map((registration, index) => (
                    <TableRow key={registration.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {registration.fullName}
                      </TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.phoneNumber}</TableCell>
                      <TableCell>{registration.workshopName}</TableCell>
                      <TableCell>
                        {new Date(
                          registration.registeredDate
                        ).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(registration.status)}
                      </TableCell>
                      <TableCell>
                        <div className="action-buttons">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendEmail(registration)}
                            className="send-email-btn"
                            disabled={emailLoading}
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Gửi mail
                          </Button>
                          {registration.status === "CHỜ XÁC NHẬN" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleConfirm(registration.id)}
                                disabled={confirmLoading}
                                style={{ marginLeft: "0.5rem" }}
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Xác nhận
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(registration)}
                                disabled={rejectLoading}
                                className="reject-btn"
                                style={{ marginLeft: "0.5rem" }}
                              >
                                <X className="w-3 h-3 mr-1" />
                                Từ chối
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Email Modals */}
      <EmailModal
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal({ isOpen: false, registration: null })}
        onSend={handleSendSingleEmail}
        registration={emailModal.registration}
        defaultSubject={emailModal.defaultSubject}
        defaultBody={emailModal.defaultBody}
        loading={emailLoading}
      />

      <BulkEmailModal
        isOpen={bulkEmailModal}
        onClose={() => setBulkEmailModal(false)}
        onSend={handleSendBulkEmail}
        confirmedCount={stats.confirmed}
        loading={emailLoading}
      />

      <RejectModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, registration: null })}
        onReject={handleConfirmReject}
        registration={rejectModal.registration}
        loading={rejectLoading}
      />
    </div>
  );
};

export default WorkshopPage;
