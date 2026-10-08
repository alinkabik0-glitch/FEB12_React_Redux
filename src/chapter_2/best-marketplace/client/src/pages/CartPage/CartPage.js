import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCartRequest, updateCartItem, removeFromCart } from '../../store/actions/cartActions';
import { createOrderRequest } from '../../store/actions/orderActions';
import CartItem from '../../components/CartItem/CartItem';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCartRequest());
  }, [dispatch]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateCartItem(productId, quantity));
    }
  };

  const handleCreateOrder = () => {
    dispatch(createOrderRequest({ items, total }));
    navigate('/my-orders');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <p>Product count: {totalCount}</p>
            <p>Total price: {total} ₽</p>
            <button onClick={handleCreateOrder} className="create-order-btn">
              Create order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;