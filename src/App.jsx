import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import LoginPage from './pages/login/LoginPage';
import Layout from './components/layout/Layout';
import ManagePage from './pages/manage/ManagePage';
import OrderPage from './pages/order/OrderPage';
import OrderDetailPage from './pages/order-detail/OrderDetailPage';
import ProductPage from './pages/products/ProductPage';
import WorkshopPage from './pages/workshop/WorkshopPage'
import BlogPage from './pages/blog/BlogPage';
import BlogDetailPage from './pages/blog-detail/BlogDetailPage';
import CustomAdminPage from './pages/custom/CustomAdminPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route cho login (không có Layout) */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Các route khác có Layout */}
        <Route path="/manage" element={<Layout><ManagePage /></Layout>} />
        <Route path="/order" element={<Layout><OrderPage /></Layout>} />
        <Route path="/order/:orderID" element={<Layout><OrderDetailPage /></Layout>} />
        <Route path="/products" element={<Layout><ProductPage /></Layout>} />
        <Route path="/workshop" element={<Layout><WorkshopPage /></Layout>} />
        <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
        <Route path="/blog/:blogID" element={<Layout><BlogDetailPage /></Layout>} />
        <Route path="/custom" element={<Layout><CustomAdminPage /></Layout>} />
        
        {/* Default route */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;