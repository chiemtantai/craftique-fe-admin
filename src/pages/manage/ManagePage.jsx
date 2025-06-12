import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import './ManagePage.css';

const ManagePage = () => {
  // Sample data for charts - replace with API data later
  const statisticsData = [
    { title: 'Tổng sản phẩm', value: '2,847', change: '+12%', color: '#8884d8', icon: '📦' },
    { title: 'Đơn hàng hôm nay', value: '156', change: '+8.2%', color: '#82ca9d', icon: '🛒' },
    { title: 'Doanh thu/tháng', value: '45.2M', change: '+15.8%', color: '#ffc658', icon: '💰' },
    { title: 'Khách hàng mới', value: '89', change: '+5.4%', color: '#ff7c7c', icon: '👥' }
  ];

  const revenueData = [
    { month: 'T1', revenue: 120, orders: 89 },
    { month: 'T2', revenue: 190, orders: 156 },
    { month: 'T3', revenue: 150, orders: 134 },
    { month: 'T4', revenue: 280, orders: 201 },
    { month: 'T5', revenue: 320, orders: 267 },
    { month: 'T6', revenue: 250, orders: 198 }
  ];

  const productCategoryData = [
    { name: 'Chén bát', value: 35, color: '#8884d8' },
    { name: 'Bình hoa', value: 25, color: '#82ca9d' },
    { name: 'Đĩa', value: 20, color: '#ffc658' },
    { name: 'Ấm trà', value: 15, color: '#ff7c7c' },
    { name: 'Khác', value: 5, color: '#8dd1e1' }
  ];

  const topProductsData = [
    { name: 'Chén sứ trắng', sales: 245, revenue: '12.5M' },
    { name: 'Bình hoa gốm', sales: 189, revenue: '9.8M' },
    { name: 'Đĩa sứ hoa', sales: 156, revenue: '8.2M' },
    { name: 'Ấm trà gốm', sales: 134, revenue: '7.1M' },
    { name: 'Chén cà phê', sales: 98, revenue: '5.4M' }
  ];

  return (
    <div className="manage-page">
      <div className="page-header">
        <h1>Dashboard Quản lý</h1>
      </div>

      {/* Statistics Cards */}
      <div className="statistics-grid">
        {statisticsData.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderColor: stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-change" style={{ color: stat.color }}>
                <span className="change-arrow">↗</span>
                {stat.change} so với tháng trước
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Revenue Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Doanh thu & Đơn hàng theo tháng</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#8884d8' }}></span>
                Doanh thu (Triệu VND)
              </span>
              <span className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#82ca9d' }}></span>
                Số đơn hàng
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Category Pie Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Phân loại sản phẩm</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {productCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="top-products-section">
        <div className="section-header">
          <h3>Top 5 sản phẩm bán chạy</h3>
        </div>
        <div className="products-table">
          <div className="table-header">
            <div className="table-cell">Sản phẩm</div>
            <div className="table-cell">Số lượng bán</div>
            <div className="table-cell">Doanh thu</div>
            <div className="table-cell">Thao tác</div>
          </div>
          {topProductsData.map((product, index) => (
            <div key={index} className="table-row">
              <div className="table-cell">
                <div className="product-info">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-name">{product.name}</div>
                </div>
              </div>
              <div className="table-cell">{product.sales}</div>
              <div className="table-cell">{product.revenue}</div>
              <div className="table-cell">
                <button className="action-btn view-btn">Xem</button>
                <button className="action-btn edit-btn">Sửa</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <div className="section-header">
          <h3>Hoạt động gần đây</h3>
        </div>
        <div className="activities-list">
          <div className="activity-item">
            <div className="activity-icon">🛒</div>
            <div className="activity-content">
              <div className="activity-text">Đơn hàng #DH001 đã được đặt</div>
              <div className="activity-time">5 phút trước</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📦</div>
            <div className="activity-content">
              <div className="activity-text">Sản phẩm "Chén sứ trắng" đã hết hàng</div>
              <div className="activity-time">15 phút trước</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👥</div>
            <div className="activity-content">
              <div className="activity-text">Khách hàng mới đăng ký tài khoản</div>
              <div className="activity-time">30 phút trước</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💰</div>
            <div className="activity-content">
              <div className="activity-text">Thanh toán đơn hàng #DH002 thành công</div>
              <div className="activity-time">1 giờ trước</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePage;