import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductRequest } from '../../store/actions/productActions';
import { addToCartRequest } from '../../store/actions/cartActions';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchProductRequest(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsAdding(true);
    dispatch(addToCartRequest(parseInt(id), 1));
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-page">
      <h1>{product.title}</h1>
      <div className="product-content">
        <div className="product-photo-large">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.title}
              className="product-image"
            />
          ) : (
            <div className="no-image">No image available</div>
          )}
        </div>
        <div className="product-description">
          <p>{product.description}</p>
        </div>
      </div>
      <div className="product-footer">
        <div className="vendor-info">
          <h3>{product.vendor}</h3>
        </div>
        <div className="product-price-section">
          <p className="price">Цена: {product.price} ₽</p>
          <button 
            onClick={handleAddToCart} 
            className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
            disabled={isAdding}
          >
            {isAdding ? '✓ Добавлено' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;