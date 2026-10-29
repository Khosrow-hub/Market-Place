import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './AmazonLoginPage.css';

const AmazonLoginPage = () => {
  const { t } = useTranslation();
  const { amazonLogin } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    amazonToken: '',
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

    const result = await amazonLogin(formData);
    
    if (result.success) navigate('/');
    else setError(result.message);
    
    setLoading(false);
  };

  return (
    <div className="amazon-login-page">
      <div className="amazon-login-container">
        <div className="amazon-login-form-wrapper">
          <div className="amazon-header">
            <div className="amazon-logo">🐉</div>
            <h1>Login with Amazon</h1>
            <p>Access your Amazon account to continue</p>
          </div>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="amazon-login-form">
            <div className="form-group">
              <label htmlFor="amazonToken">Amazon Token *</label>
              <input
                type="password"
                id="amazonToken"
                name="amazonToken"
                value={formData.amazonToken}
                onChange={handleChange}
                required
                placeholder="Enter your Amazon token"
              />
              <small>Use a token issued by your Amazon OAuth connection.</small>
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
                className="btn btn-primary amazon-btn"
                disabled={loading}
              >
                {loading ? t('common.loading') : 'Continue with Amazon'}
              </button>
            </div>
          </form>

          <div className="amazon-info">
            <h3>How Amazon Login Works:</h3>
            <ol>
              <li>Provide your Amazon account token</li>
              <li>The production connector verifies your identity with Amazon</li>
              <li>Create or update your Dari Marketplace account</li>
              <li>Get instant access to your account</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmazonLoginPage;
