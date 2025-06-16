
import React from 'react';
import OrderList from '../../components/feature/orders/OrderList';
import './OrderPage.css';

const OrderPage = () => {
  return (
    <div className="order-page">
      <div className="order-page-header">
        <h1>Quản lý đơn hàng</h1>
      </div>
      
      <OrderList />
    </div>
  );
};

export default OrderPage;