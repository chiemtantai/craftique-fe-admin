import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import LoginPage from './components/login/LoginPage';
import Layout from './components/layout/Layout';
import ManagePage from './components/manage/ManagePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route cho login (không có Layout) */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Các route khác có Layout */}
        <Route path="/manage" element={<Layout><ManagePage /></Layout>} />
        {/* <Route path="/order" element={<Layout><OrderPage /></Layout>} />
        <Route path="/products" element={<Layout><ProductPage /></Layout>} />
        <Route path="/workshop" element={<Layout><WorkshopPage /></Layout>} />
        <Route path="/blog" element={<Layout><BlogPage /></Layout>} /> */}
        
        {/* Default route */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;