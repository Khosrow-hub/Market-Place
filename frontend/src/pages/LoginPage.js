import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleAmazonLogin = () => {
    navigate('/amazon-login');
  };

  const handleAlibabaLogin = () => {
    navigate('/alibaba-login');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-wrapper">
          <h1>{t('login.title')}</h1>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">{t('email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('email')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('password')}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder={t('password')}
              />
            </div>

            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('login.loginButton')}
              </button>
            </div>
          </form>

          <div className="social-login">
            <div className="divider">
              <span>OR</span>
            </div>
            
            <div className="social-buttons">
              <button 
                className="btn btn-secondary amazon-btn"
                onClick={handleAmazonLogin}
              >
                {t('login.amazonLogin')}
              </button>
              <button 
                className="btn btn-secondary alibaba-btn"
                onClick={handleAlibabaLogin}
              >
                {t('login.alibabaLogin')}
              </button>
            </div>
          </div>

          <div className="register-link">
            <p>
              {t('login.noAccount')} {' '}
              <Link to="/register">{t('login.registerLink')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
