import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, isAuthenticated }) => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsAdding(true);
    onAddToCart(product.id);
    
    // Сбрасываем состояние через 1 секунду
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-photo">
          <img 
            src={product.image} 
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <h3>{product.title}</h3>
        <p className="price">{product.price} ₽</p>
      </Link>
      <button 
        onClick={handleAddToCart} 
        className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
        disabled={isAdding}
      >
        {isAdding ? '✓ Добавлено' : 'Add to cart'}
      </button>
    </div>
  );
};

export default ProductCard;