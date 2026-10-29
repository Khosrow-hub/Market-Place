import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './AlibabaLoginPage.css';

const AlibabaLoginPage = () => {
  const { t } = useTranslation();
  const { alibabaLogin } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    alibabaToken: '',
    email: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    const result = await alibabaLogin(formData);
    
    if (result.success) navigate('/');
    else setError(result.message);
    
    setLoading(false);
  };

  return (
    <div className="alibaba-login-page">
      <div className="alibaba-login-container">
        <div className="alibaba-login-form-wrapper">
          <div className="alibaba-header">
            <div className="alibaba-logo">🎀</div>
            <h1>Login with Alibaba</h1>
            <p>Access your Alibaba account to continue</p>
          </div>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="alibaba-login-form">
            <div className="form-group">
              <label htmlFor="alibabaToken">Alibaba Token *</label>
              <input
                type="password"
                id="alibabaToken"
                name="alibabaToken"
                value={formData.alibabaToken}
                onChange={handleChange}
                required
                placeholder="Enter your Alibaba token"
              />
              <small>Use a token issued by your Alibaba OAuth connection.</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Full Name (Optional)</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary alibaba-btn"
                disabled={loading}
              >
                {loading ? t('common.loading') : 'Continue with Alibaba'}
              </button>
            </div>
          </form>

          <div className="alibaba-info">
            <h3>How Alibaba Login Works:</h3>
            <ol>
              <li>Provide your Alibaba account token</li>
              <li>The production connector verifies your identity with Alibaba</li>
              <li>Create or update your Dari Marketplace account</li>
              <li>Get instant access to your account</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlibabaLoginPage;
