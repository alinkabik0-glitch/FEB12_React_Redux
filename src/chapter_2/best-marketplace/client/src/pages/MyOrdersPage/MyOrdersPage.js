import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrdersRequest, setOrdersSort } from '../../store/actions/orderActions';
import OrderItem from '../../components/OrderItem/OrderItem';

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    dispatch(fetchOrdersRequest({ sort: sortBy }));
  }, [dispatch, sortBy]);

  const handleSort = (e) => {
    setSortBy(e.target.value);
    dispatch(setOrdersSort(e.target.value));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="controls">
        <select value={sortBy} onChange={handleSort}>
          <option value="">Sort by</option>
          <option value="date-asc">Date (Oldest first)</option>
          <option value="date-desc">Date (Newest first)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;