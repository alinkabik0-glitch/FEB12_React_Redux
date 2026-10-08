import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProductsRequest } from '../../store/actions/productActions';
import { addToCartRequest } from '../../store/actions/cartActions';
import ProductCard from '../../components/ProductCard/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Debounced search
  useEffect(() => {
    const timerId = setTimeout(() => {
      dispatch(fetchProductsRequest({ search: searchTerm, sort: sortBy }));
    }, 500); // Ждем 500ms после последнего ввода
    
    return () => clearTimeout(timerId);
  }, [dispatch, searchTerm, sortBy]);

  const handleAddToCart = useCallback((productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCartRequest(productId, 1));
  }, [isAuthenticated, navigate, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home-page">
      <div className="controls">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          autoComplete="off"
        />
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)} 
          className="sort-select"
        >
          <option value="">Sort by</option>
          <option value="title-asc">Name (A-Z)</option>
          <option value="title-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;