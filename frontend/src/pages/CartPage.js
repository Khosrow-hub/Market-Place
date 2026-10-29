import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import './CartPage.css';

const CartPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items: cartItems, updateQuantity, removeItem, subtotal } = useCart();
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.1;
  const total = subtotal + tax + shipping;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="page-header">
          <h1>{t('cart.title')}</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-content">
              <span className="empty-cart-icon">🛒</span>
              <h2>{t('cart.emptyCart')}</h2>
              <p>{t('cart.continueShopping')}</p>
              <button 
                onClick={() => navigate('/products')} 
                className="btn btn-primary"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-info">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">{item.currency} {item.price}</p>
                  </div>
                  <div className="item-quantity">
                    <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                  </div>
                  <div className="item-total">
                    <span className="item-total-price">{item.currency} {(item.price * item.quantity).toFixed(2)}</span>
                    <button className="remove-btn" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>{t('cart.orderSummary')}</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>USD {subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{shipping ? `USD ${shipping.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>USD {total.toFixed(2)}</span>
                </div>
              </div>
              <button className="btn btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
                {t('cart.checkout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
