import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderAPI } from '../services/api';
import './AccountPages.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadOrder = () => orderAPI.getById(id)
    .then(response => setOrder(response.data.data.order))
    .catch(requestError => setError(requestError.response?.data?.message || 'Could not load this order.'));

  useEffect(() => { loadOrder(); }, [id]);

  const cancel = async () => {
    setUpdating(true);
    try { await orderAPI.cancel(id); await loadOrder(); } catch (requestError) { setError(requestError.response?.data?.message || 'Could not cancel this order.'); } finally { setUpdating(false); }
  };

  if (error && !order) return <div className="account-page"><div className="account-container"><div className="account-card"><p className="form-error">{error}</p><Link to="/orders">Back to orders</Link></div></div></div>;
  if (!order) return <div className="account-page"><div className="account-container"><div className="account-card">Loading order…</div></div></div>;

  const cancellable = ['pending', 'confirmed'].includes(order.orderStatus);
  return <div className="account-page"><div className="account-container"><div className="account-card">
    <Link to="/orders">← Back to orders</Link><h1>Order {order.orderNumber}</h1><p><span className="status-pill">{order.orderStatus}</span> · Payment: {order.paymentStatus}</p>
    <div className="order-items">{order.products.map(item => <div className="order-line" key={item._id || item.product?._id || item.product}><span>{item.name} × {item.quantity}</span><strong>{item.currency} {(item.price * item.quantity).toFixed(2)}</strong></div>)}</div>
    <p>Subtotal: {order.currency} {order.subtotal.toFixed(2)}<br />Tax: {order.currency} {order.tax.toFixed(2)}<br />Shipping: {order.currency} {order.shippingCost.toFixed(2)}<br /><strong>Total: {order.currency} {order.total.toFixed(2)}</strong></p>
    <h2>Delivery address</h2><p>{order.shippingAddress.fullName}<br />{order.shippingAddress.address.street}, {order.shippingAddress.address.city}<br />{order.shippingAddress.address.country}</p>
    {cancellable && <button className="danger-action" disabled={updating} onClick={cancel}>{updating ? 'Cancelling…' : 'Cancel order'}</button>}{error && <p className="form-error">{error}</p>}
  </div></div></div>;
};

export default OrderDetailPage;
