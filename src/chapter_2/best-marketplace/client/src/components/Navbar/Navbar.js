import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/actions/authActions';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.items) || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          BestMarketPlace
        </Link>
        
        {isAuthenticated && (
          <div className="navbar-icons">
            <Link to="/my-orders" className="navbar-icon" title="My Orders">
              📋 Orders
            </Link>
            <Link to="/cart" className="navbar-icon cart-icon" title="Cart">
               Cart
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </Link>
            <button onClick={handleLogout} className="navbar-icon logout-btn" title="Logout">
               Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;