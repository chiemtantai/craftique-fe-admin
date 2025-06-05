import { Upload, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/Card";
import "./BlogPage.css"; // 👈 đổi tên file CSS

const BlogPage = () => {
  return (
    <div className="blog-page">

      {/* Main content */}
      <main className="main-container">
        <h1 className="page-title">Chuyện của gốm</h1>

        {/* Form đăng bài */}
        <Card className="upload-card">
          <CardContent className="upload-content">
            <div className="upload-layout">
              <div className="upload-area">
                <div className="upload-zone">
                  <Upload className="upload-icon" />
                  <p className="upload-text">Ảnh</p>
                </div>
              </div>

              <div className="upload-form">
                <div className="form-group">
                  <label className="form-label">Tiêu đề</label>
                  <input type="text" className="form-input" placeholder="Nhập tiêu đề..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Nội dung</label>
                  <textarea rows={4} className="form-textarea" placeholder="Nhập nội dung..." />
                </div>
                <Button className="submit-button">Đăng bài</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danh sách bài viết */}
        <div className="blog-posts">
          <Card className="blog-post-card">
            <CardContent className="p-0">
              <div className="blog-post-layout">
                <div className="blog-post-image-container">
                  <img 
                    src="/lovable-uploads/fee905f8-31b6-4e50-8d17-b141add4df44.png" 
                    alt="Pottery workshop" 
                    className="blog-post-image"
                  />
                </div>
                <div className="blog-post-content">
                  <h2 className="blog-post-title">
                    LỄ HỘI HOA GỐM - KHÁM PHÁ NGHỆ THUẬT TRUYỀN THỐNG VỚI DI SẢN THỦ CÔNG
                  </h2>
                  <div className="blog-post-meta">
                    <Calendar className="blog-post-meta-icon" />
                    <span>15.03.2025</span>
                  </div>
                  <p className="blog-post-description">
                    🏺 Hòa mình vào không gian sáng tạo với hàng trăm tác phẩm gốm nghệ thuật, 
                    cùng cơ hội tự tay chế tác những sản phẩm mang dấu ấn riêng.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="blog-post-card">
            <CardContent className="p-0">
              <div className="blog-post-layout">
                <div className="blog-post-image-container">
                  <div className="grand-opening-image">
                    <div className="grand-opening-text">
                      <h3 className="grand-opening-title">GRAND</h3>
                      <h3 className="grand-opening-title">OPENING</h3>
                    </div>
                    <div className="grand-opening-overlay"></div>
                    <div className="grand-opening-gradient"></div>
                  </div>
                </div>
                <div className="blog-post-content">
                  <h2 className="blog-post-title">
                    SỰ KIỆN TRI ÂN - NHẬN NGAY QUÀ TẶNG GỐM THỦ CÔNG ĐỘC QUYỀN
                  </h2>
                  <div className="blog-post-meta">
                    <Calendar className="blog-post-meta-icon" />
                    <span>05.04.2025</span>
                  </div>
                  <p className="blog-post-description">
                    🎁 Tuần lễ tri ân khách hàng chính thức bắt đầu! Đến ngay Vườn 
                    Nhà Gốm để nhận quà tặng đặc biệt và tham gia các hoạt động 
                    vui chơi hấp dẫn!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
