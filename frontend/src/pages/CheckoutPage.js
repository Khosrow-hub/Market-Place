import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useCart } from '../hooks/useCart';
import './AccountPages.css';

const blankAddress = { fullName: '', phoneNumber: '', street: '', city: '', state: '', country: '', postalCode: '' };

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(blankAddress);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const shippingCost = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.1;
  const total = useMemo(() => subtotal + tax + shippingCost, [subtotal, tax, shippingCost]);

  if (!items.length) {
    return <div className="account-page"><div className="account-container"><div className="account-card"><h1>Your cart is empty</h1><button className="primary-action" onClick={() => navigate('/products')}>Browse products</button></div></div></div>;
  }

  const change = event => setAddress(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const formattedAddress = {
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          country: address.country,
          postalCode: address.postalCode
        }
      };
      const sourceSet = new Set(items.map(item => item.source));
      const response = await orderAPI.create({
        products: items.map(item => ({ product: item.id, quantity: item.quantity })),
        shippingAddress: formattedAddress,
        billingAddress: formattedAddress,
        paymentMethod,
        source: sourceSet.size === 1 ? [...sourceSet][0] : 'both'
      });
      clearCart();
      navigate(`/orders/${response.data.data.order._id || response.data.data.order.id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="account-page"><div className="account-container">
      <div className="account-card">
        <h1>Checkout</h1>
        <div className="checkout-summary"><strong>Order total: ${total.toFixed(2)}</strong><ul>{items.map(item => <li key={item.id}>{item.name} × {item.quantity}</li>)}</ul></div>
        <form onSubmit={submit} className="account-form-grid">
          <label>Full name<input required name="fullName" value={address.fullName} onChange={change} /></label>
          <label>Phone number<input required name="phoneNumber" value={address.phoneNumber} onChange={change} /></label>
          <label className="full-width">Street address<input required name="street" value={address.street} onChange={change} /></label>
          <label>City<input required name="city" value={address.city} onChange={change} /></label>
          <label>Province / State<input name="state" value={address.state} onChange={change} /></label>
          <label>Country<input required name="country" value={address.country} onChange={change} /></label>
          <label>Postal code<input required name="postalCode" value={address.postalCode} onChange={change} /></label>
          <label className="full-width">Payment method<select value={paymentMethod} onChange={event => setPaymentMethod(event.target.value)}><option value="cod">Cash on delivery</option><option value="bank_transfer">Bank transfer</option><option value="credit_card">Credit card</option><option value="paypal">PayPal</option></select></label>
          <div className="full-width"><button className="primary-action" disabled={submitting}>{submitting ? 'Placing order…' : 'Place order'}</button>{error && <p className="form-error">{error}</p>}</div>
        </form>
      </div>
    </div></div>
  );
};

export default CheckoutPage;
