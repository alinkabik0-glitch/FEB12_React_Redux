import React from 'react';
import './CartItem.css';

const CartItem = ({ item, onQuantityChange }) => {
  return (
    <div className="cart-item">
      <div className="cart-item-photo">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.title || `Product ${item.productId}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span>product photo</span>
        )}
      </div>
      <div className="cart-item-info">
        <h3>{item.title || `Product ${item.productId}`}</h3>
        <p>{item.description || 'Small description'}</p>
      </div>
      <div className="cart-item-price">
        <p>{item.price} ₽</p>
        <div className="quantity-controls">
          <button onClick={() => onQuantityChange(item.productId, item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onQuantityChange(item.productId, item.quantity + 1)}>+</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;