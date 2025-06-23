import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { manageService } from '../../services/manageService';
import './ManagePage.css';

const ManagePage = () => {
  // State for API data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalProducts: 0,
    topProducts: [],
    topCustomers: [],
    loading: true,
    error: null
  });

  // Fetch data from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch all data concurrently
        const [
          totalUsersRes,
          totalRevenueRes,
          totalProductsRes,
          topProductsRes,
          topCustomersRes
        ] = await Promise.all([
          manageService.getTotalUsers(),
          manageService.getTotalRevenue(),
          manageService.getTotalProducts(),
          manageService.getTopSellingProductItems(),
          manageService.getTopCustomers()
        ]);

        setDashboardData({
          totalUsers: totalUsersRes.data || 0,
          totalRevenue: totalRevenueRes.data.totalRevenue || 0,
          totalProducts: totalProductsRes.data.totalCount || 0,
          topProducts: topProductsRes.data || [],
          topCustomers: topCustomersRes.data || [],
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: 'Không thể tải dữ liệu. Vui lòng thử lại sau.'
        }));
      }
    };

    fetchDashboardData();
  }, []);

  // Format number for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Calculate statistics from API data
  const statisticsData = [
    { 
      title: 'Tổng sản phẩm', 
      value: formatNumber(dashboardData.totalProducts), 
      change: '+12%', 
      color: '#8884d8', 
      icon: '📦' 
    },
    { 
      title: 'Tổng khách hàng', 
      value: formatNumber(dashboardData.totalUsers), 
      change: '+8.2%', 
      color: '#82ca9d', 
      icon: '👥' 
    },
    { 
      title: 'Tổng doanh thu', 
      value: formatNumber(dashboardData.totalRevenue), 
      change: '+15.8%', 
      color: '#ffc658', 
      icon: '💰' 
    },
    { 
      title: 'Đơn hàng hôm nay', 
      value: '20', 
      change: '+5.4%', 
      color: '#ff7c7c', 
      icon: '🛒' 
    }
  ];

  // Sample data for charts - you can replace this with real API data when available
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

  // Loading state
  if (dashboardData.loading) {
    return (
      <div className="manage-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardData.error) {
    return (
      <div className="manage-page">
        <div className="error-container">
          <div className="error-message">
            <h3>Có lỗi xảy ra</h3>
            <p>{dashboardData.error}</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-page">
      <div className="page-header">
        <h1>Dashboard Quản lý</h1>
        <button 
          className="refresh-btn"
          onClick={() => window.location.reload()}
          title="Làm mới dữ liệu"
        >
          🔄
        </button>
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
          <h3>Top sản phẩm bán chạy</h3>
        </div>
        <div className="products-table">
          <div className="table-header">
            <div className="table-cell">Sản phẩm</div>
            <div className="table-cell">Số lượng bán</div>
            <div className="table-cell">Doanh thu</div>
            <div className="table-cell">Thao tác</div>
          </div>
          {dashboardData.topProducts.length > 0 ? (
            dashboardData.topProducts.map((product, index) => (
              <div key={index} className="table-row">
                <div className="table-cell">
                  <div className="product-info">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-name">
                      {product.productName || product.name || `Sản phẩm ${index + 1}`}
                    </div>
                  </div>
                </div>
                <div className="table-cell">
                  {product.totalQuantitySold || product.sales || 0}
                </div>
                <div className="table-cell">
                  {formatNumber(product.totalRevenue || product.revenue || 0)}
                </div>
                <div className="table-cell">
                  <button className="action-btn view-btn">Xem</button>
                  <button className="action-btn edit-btn">Sửa</button>
                </div>
              </div>
            ))
          ) : (
            <div className="table-row">
              <div className="table-cell" colSpan="4">
                <div className="no-data">Không có dữ liệu sản phẩm</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Customers Table */}
      <div className="top-customers-section">
        <div className="section-header">
          <h3>Top khách hàng</h3>
        </div>
        <div className="customers-table">
          <div className="table-header">
            <div className="table-cell">Khách hàng</div>
            <div className="table-cell">Email</div>
            <div className="table-cell">Tổng đơn hàng</div>
            <div className="table-cell">Tổng chi tiêu</div>
          </div>
          {dashboardData.topCustomers.length > 0 ? (
            dashboardData.topCustomers.map((customer, index) => (
              <div key={index} className="table-row">
                <div className="table-cell">
                  <div className="customer-info">
                    <div className="customer-rank">#{index + 1}</div>
                    <div className="customer-name">
                      {customer.fullName || customer.name || `Khách hàng ${index + 1}`}
                    </div>
                  </div>
                </div>
                <div className="table-cell">
                  {customer.email || 'N/A'}
                </div>
                <div className="table-cell">
                  {customer.totalOrders || 0}
                </div>
                <div className="table-cell">
                  {formatNumber(customer.totalSpent || customer.totalRevenue || 0)}
                </div>
              </div>
            ))
          ) : (
            <div className="table-row">
              <div className="table-cell" colSpan="4">
                <div className="no-data">Không có dữ liệu khách hàng</div>
              </div>
            </div>
          )}
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