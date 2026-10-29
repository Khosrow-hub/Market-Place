import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../services/api';
import { useCart } from '../hooks/useCart';
import './Navigation.css';

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">Dari Marketplace</span>
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">{t('navigation.home')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link">{t('navigation.shop')}</Link>
          </li>
          {user && (
            <li className="nav-item">
              <Link to="/orders" className="nav-link">{t('navigation.orders')}</Link>
            </li>
          )}
          {user && (
            <li className="nav-item">
              <Link to="/cart" className="nav-link">{t('navigation.cart')} {items.length ? `(${items.length})` : ''}</Link>
            </li>
          )}
          {user && (
            <li className="nav-item">
              <Link to="/profile" className="nav-link">{t('navigation.profile')}</Link>
            </li>
          )}
          {user && (user.role === ROLES.ADMIN || user.role === ROLES.OWNER) && (
            <li className="nav-item">
              <Link to="/admin" className="nav-link">{t('navigation.admin')}</Link>
            </li>
          )}
        </ul>

        <div className="nav-auth">
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">
                {t('welcomeBack')}, {user.fullName}!
              </span>
              <button onClick={handleLogout} className="logout-btn">
                {t('logout')}
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">{t('navigation.login')}</Link>
              <Link to="/register" className="register-btn">{t('navigation.register')}</Link>
            </div>
          )}

          <div className="language-selector">
            <button 
              onClick={() => changeLanguage('dari')}
              className={i18n.language === 'dari' ? 'active' : ''}
            >
              DA
            </button>
            <button 
              onClick={() => changeLanguage('ps')}
              className={i18n.language === 'ps' ? 'active' : ''}
            >
              PS
            </button>
            <button 
              onClick={() => changeLanguage('en')}
              className={i18n.language === 'en' ? 'active' : ''}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
