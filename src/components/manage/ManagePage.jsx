import React from 'react';
import './ManagePage.css';

// Chart Component
const Chart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Doanh thu</h3>
        <div className="chart-controls">
          <div className="legend">
            <div className="legend-item">
              <span className="legend-color revenue"></span>
              <span>Revenue</span>
            </div>
            <div className="legend-item">
              <span className="legend-color profit"></span>
              <span>Profit</span>
            </div>
          </div>
          <select className="time-filter">
            <option>Year to date</option>
            <option>Last month</option>
            <option>Last 3 months</option>
          </select>
        </div>
      </div>
      <div className="chart-area">
        <div className="chart-y-axis">
          {[200, 150, 100, 50, 0].map(val => (
            <div key={val} className="y-axis-label">{val}</div>
          ))}
        </div>
        <div className="chart-plot">
          <svg viewBox="0 0 400 200" className="chart-svg">
            {/* Revenue line (blue) */}
            <path
              d="M 0,180 Q 40,100 80,120 T 160,140 Q 200,130 240,135 Q 280,140 320,145 Q 360,150 400,155"
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
            />
            {/* Profit line (red) */}
            <path
              d="M 0,190 Q 40,185 80,180 T 160,175 Q 200,170 240,168 Q 280,165 320,163 Q 360,160 400,158"
              stroke="#ef4444"
              strokeWidth="2"
              fill="none"
            />
            {/* Area under revenue curve */}
            <path
              d="M 0,180 Q 40,100 80,120 T 160,140 Q 200,130 240,135 Q 280,140 320,145 Q 360,150 400,155 L 400,200 L 0,200 Z"
              fill="rgba(59, 130, 246, 0.1)"
            />
          </svg>
        </div>
        <div className="chart-x-axis">
          {months.map(month => (
            <div key={month} className="x-axis-label">{month}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Products Table Component
const ProductsTable = () => {
  const products = [
    { id: 1, name: 'Ly sứ uống nước trà/ cà phê', category: 'Ly', sold: 253, likes: 141, reviews: 17 },
    { id: 2, name: 'Ly sứ uống nước/ trà/ soda', category: 'Ly', sold: 172, likes: 133, reviews: 19 },
    { id: 3, name: 'Tua hoa bằng đông yến', category: 'Dĩa', sold: 87, likes: 149, reviews: 14 },
    { id: 4, name: 'Chăn hoa quả đất Hoàng', category: 'Dĩa', sold: 145, likes: 135, reviews: 16 },
    { id: 5, name: 'Tô kiểm cao loe', category: 'Dĩa', sold: 125, likes: 83, reviews: 38 },
    { id: 6, name: 'Ly trà sứ nâng cao', category: 'Dĩa', sold: 108, likes: 50, reviews: 26 },
    { id: 7, name: 'Chén trà uống cần vốt', category: 'Chén', sold: 104, likes: 74, reviews: 30 },
    { id: 8, name: 'Chén trần cạn cần', category: 'Chén', sold: 87, likes: 40, reviews: 28 },
    { id: 9, name: 'Dĩa trầm cạn vốt', category: 'Dĩa', sold: 63, likes: 42, reviews: 21 },
    { id: 10, name: 'Dĩa trầm cao gần tầm', category: 'Dĩa', sold: 47, likes: 17, reviews: 13 }
  ];

  return (
    <div className="products-section">
      <div className="section-header">
        <h3>Bán chạy - Những sản phẩm bán chạy</h3>
        <div className="filter-controls">
          <span className="top-filter">Top 10</span>
          <button className="filter-btn">▼</button>
        </div>
      </div>
      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input type="checkbox" />
              </th>
              <th>No</th>
              <th>Sản phẩm</th>
              <th>Loại sản phẩm</th>
              <th>Lượt Bán</th>
              <th>Lượt Thích</th>
              <th>Lượt Đánh Giá</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className={index < 3 ? 'top-product' : ''}>
                <td className="checkbox-col">
                  <input type="checkbox" />
                </td>
                <td className="number-col">{index + 1}</td>
                <td className="product-name">{product.name}</td>
                <td>{product.category}</td>
                <td className="number-col">{product.sold}</td>
                <td className="number-col">{product.likes}</td>
                <td className="number-col">{product.reviews}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Manage Page Component
const ManagePage = () => {
  return (
    <div className="manage-page">
      <Chart />
      <ProductsTable />
    </div>
  );
};

export default ManagePage;