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

  // Filter states
  const [productFilter, setProductFilter] = useState({
    year: '',
    month: '',
    day: '',
    top: ''
  });

  const [customerFilter, setCustomerFilter] = useState({
    year: '',
    month: '',
    day: '',
    top: ''
  });

  // Fetch data from APIs
  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

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
        manageService.getTopSellingProductItems(productFilter),
        manageService.getTopCustomers(customerFilter)
      ]);

      setDashboardData({
        totalUsers: totalUsersRes.data || 0,
        totalRevenue: totalRevenueRes.data.totalRevenue || 0,
        totalProducts: totalProductsRes.data.totalCount || 0,
        topProducts: topProductsRes.data.topProductItems || [],
        topCustomers: topCustomersRes.data.topCustomers || [],
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (!dashboardData.loading) {
      fetchDashboardData();
    }
  }, [productFilter, customerFilter]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Generate year options (current year and previous years)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  };

  // Generate top options
  const generateTopOptions = () => {
    return [5, 10, 15, 20, 25, 30, 50, 100];
  };

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

  const FilterComponent = ({ filter, setFilter, title }) => (
    <div className="filter-section">
      <h4>{title}</h4>
      <div className="filter-controls">
        <select 
          value={filter.year} 
          onChange={(e) => setFilter(prev => ({ ...prev, year: e.target.value }))}
        >
          <option value="">Tất cả năm</option>
          {generateYearOptions().map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <select 
          value={filter.month} 
          onChange={(e) => setFilter(prev => ({ ...prev, month: e.target.value }))}
        >
          <option value="">Tất cả tháng</option>
          {Array.from({length: 12}, (_, i) => (
            <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
          ))}
        </select>
        
        <input 
          type="date" 
          value={filter.day}
          onChange={(e) => setFilter(prev => ({ ...prev, day: e.target.value }))}
          placeholder="Chọn ngày"
        />
        
        <select 
          value={filter.top} 
          onChange={(e) => setFilter(prev => ({ ...prev, top: e.target.value }))}
        >
          <option value="">Tất cả</option>
          {generateTopOptions().map(num => (
            <option key={num} value={num}>Top {num}</option>
          ))}
        </select>
        
        <button 
          className="clear-filter-btn"
          onClick={() => setFilter({ year: '', month: '', day: '', top: '' })}
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );

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

  if (dashboardData.error) {
    return (
      <div className="manage-page">
        <div className="error-container">
          <div className="error-message">
            <h3>Có lỗi xảy ra</h3>
            <p>{dashboardData.error}</p>
            <button 
              className="retry-btn"
              onClick={fetchDashboardData}
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
          onClick={fetchDashboardData}
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

      {/* Top Products Section */}
      <div className="top-products-section">
        <div className="section-header">
          <h3>Top sản phẩm bán chạy</h3>
        </div>
        
        <FilterComponent 
          filter={productFilter} 
          setFilter={setProductFilter} 
          title="Lọc sản phẩm"
        />

        <div className="products-table">
          <div className="table-header">
            <div className="table-cell">Sản phẩm</div>
            <div className="table-cell">Giá</div>
            <div className="table-cell">Số lượng bán</div>
            <div className="table-cell">Thao tác</div>
          </div>
          {dashboardData.topProducts.length > 0 ? (
            dashboardData.topProducts.map((product, index) => (
              <div key={product.productItemId} className="table-row">
                <div className="table-cell">
                  <div className="product-info">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-name">{product.name}</div>
                  </div>
                </div>
                <div className="table-cell">
                  {formatCurrency(product.price)}
                </div>
                <div className="table-cell">
                  {product.totalSold}
                </div>
                <div className="table-cell">
                  <button className="action-btn view-btn">Xem</button>
                  <button className="action-btn edit-btn">Sửa</button>
                </div>
              </div>
            ))
          ) : (
            <div className="table-row">
              <div className="table-cell no-data" style={{ gridColumn: '1 / -1' }}>
                Không có dữ liệu sản phẩm
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Customers Section */}
      <div className="top-customers-section">
        <div className="section-header">
          <h3>Top khách hàng</h3>
        </div>
        
        <FilterComponent 
          filter={customerFilter} 
          setFilter={setCustomerFilter} 
          title="Lọc khách hàng"
        />

        <div className="customers-table">
          <div className="table-header">
            <div className="table-cell">Khách hàng</div>
            <div className="table-cell">Email</div>
            <div className="table-cell">Số đơn hàng</div>
            <div className="table-cell">Tổng chi tiêu</div>
          </div>
          {dashboardData.topCustomers.length > 0 ? (
            dashboardData.topCustomers.map((customer, index) => (
              <div key={customer.userID} className="table-row">
                <div className="table-cell">
                  <div className="customer-info">
                    <div className="customer-rank">#{index + 1}</div>
                    <div className="customer-name">{customer.customerName}</div>
                  </div>
                </div>
                <div className="table-cell">
                  {customer.customerEmail}
                </div>
                <div className="table-cell">
                  {customer.orderCount}
                </div>
                <div className="table-cell">
                  {formatCurrency(customer.totalSpent)}
                </div>
              </div>
            ))
          ) : (
            <div className="table-row">
              <div className="table-cell no-data" style={{ gridColumn: '1 / -1' }}>
                Không có dữ liệu khách hàng
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