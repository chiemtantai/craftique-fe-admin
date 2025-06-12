import { Mail, Phone, Calendar, User, Check, X } from "lucide-react";
import { Button } from "../../components/ui/button/Button"; // ✅ dùng đường dẫn tương đối
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import "./WorkshopPage.css";

const WorkshopPage = () => {
  const registrations = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "nguyenvanan@gmail.com",
      phone: "0901234567",
      registeredDate: "15.03.2025",
      status: "confirmed",
      workshop: "Lễ hội hoa gốm"
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "tranthibinh@gmail.com",
      phone: "0912345678",
      registeredDate: "16.03.2025",
      status: "pending",
      workshop: "Lễ hội hoa gốm"
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      email: "levancuong@gmail.com",
      phone: "0923456789",
      registeredDate: "17.03.2025",
      status: "confirmed",
      workshop: "Sự kiện tri ân"
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "phamthidung@gmail.com",
      phone: "0934567890",
      registeredDate: "18.03.2025",
      status: "cancelled",
      workshop: "Sự kiện tri ân"
    },
    {
      id: 5,
      name: "Hoàng Văn Em",
      email: "hoangvanem@gmail.com",
      phone: "0945678901",
      registeredDate: "19.03.2025",
      status: "pending",
      workshop: "Lễ hội hoa gốm"
    }
  ];

  const handleSendEmail = (registration: any) => {
    alert(`Đã gửi email xác nhận cho ${registration.name}!`);
  };

  const handleSendBulkEmail = () => {
    alert("Đã gửi email cho tất cả người đăng ký!");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { text: "Đã xác nhận", class: "status-confirmed" },
      pending: { text: "Chờ xác nhận", class: "status-pending" },
      cancelled: { text: "Đã hủy", class: "status-cancelled" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const stats = {
    total: registrations.length,
    confirmed: registrations.filter(r => r.status === "confirmed").length,
    pending: registrations.filter(r => r.status === "pending").length,
    cancelled: registrations.filter(r => r.status === "cancelled").length
  };

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
          <Button onClick={handleSendBulkEmail} className="bulk-email-button">
            <Mail className="w-4 h-4 mr-2" />
            Gửi email hàng loạt
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
                  {registrations.map((registration, index) => (
                    <TableRow key={registration.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{registration.name}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.phone}</TableCell>
                      <TableCell>{registration.workshop}</TableCell>
                      <TableCell>{registration.registeredDate}</TableCell>
                      <TableCell>{getStatusBadge(registration.status)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendEmail(registration)}
                          className="send-email-btn"
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Gửi mail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WorkshopPage;
