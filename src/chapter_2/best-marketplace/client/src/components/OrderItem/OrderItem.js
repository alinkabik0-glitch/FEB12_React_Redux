import React from 'react';
import './OrderItem.css';

const OrderItem = ({ order }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  return (
    <div className="order-item">
      <div className="order-info">
        <h3>Order ID: {order.id}</h3>
        <p>Delivery address: {order.deliveryAddress || 'Not specified'}</p>
        <p>Delivery date: {order.deliveryDate ? formatDate(order.deliveryDate) : 'Pending'}</p>
        <p>Order date: {formatDate(order.createdAt)}</p>
      </div>
      <div className="order-products">
        {order.items && order.items.map((item, index) => (
          <div key={index} className="order-product-photo">
            {item.image ? (
              <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
            ) : (
              <span>product photo</span>
            )}
          </div>
        ))}
      </div>
      <div className="order-status">
        <p>Status: {order.status}</p>
        <p className="order-cost">Order cost: {order.total} ₽</p>
      </div>
    </div>
  );
};

export default OrderItem;