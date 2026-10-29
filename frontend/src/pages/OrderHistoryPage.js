import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import './AccountPages.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderAPI.getAll()
      .then(response => setOrders(response.data.data.orders))
      .catch(requestError => setError(requestError.response?.data?.message || 'Could not load your orders.'))
      .finally(() => setLoading(false));
  }, []);

  return <div className="account-page"><div className="account-container">
    <div className="account-card"><h1>Your orders</h1>{loading && <p>Loading orders…</p>}{error && <p className="form-error">{error}</p>}
      {!loading && !error && (orders.length ? <div className="order-list">{orders.map(order => <article key={order._id || order.id} className="order-card"><div><h2>{order.orderNumber}</h2><p>{new Date(order.createdAt).toLocaleDateString()} · {order.products.length} item(s)</p><strong>{order.currency} {order.total.toFixed(2)}</strong></div><div><span className="status-pill">{order.orderStatus}</span><br /><Link className="secondary-action" to={`/orders/${order._id || order.id}`}>View order</Link></div></article>)}</div> : <p>You have not placed an order yet.</p>)}</div>
  </div></div>;
};

export default OrderHistoryPage;
