import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { productAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getFeatured();
      setFeaturedProducts(response.data.data.products);
      setError(null);
    } catch (err) {
      setError(t('error.networkError'));
      console.error('Error fetching featured products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">{t('home.title')}</h1>
          <p className="hero-subtitle">{t('home.subtitle')}</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              {t('home.shopNow')}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/products')}>
              {t('home.viewAllProducts')}
            </button>
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>{t('home.secureShopping')}</h3>
            <p>Your data is protected with enterprise-grade security</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>{t('home.worldwideDelivery')}</h3>
            <p>Free shipping on orders over $100</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🕐</div>
            <h3>{t('home.customerSupport')}</h3>
            <p>24/7 customer support in Dari and English</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>{t('home.bestPrices')}</h3>
            <p>Price matching guaranteed on all products</p>
          </div>
        </div>
      </div>

      <div className="home-products-section">
        <div className="section-header">
          <h2>{t('home.featuredProducts')}</h2>
          <p>Discover our most popular products from Amazon and Alibaba</p>
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchFeaturedProducts} className="btn btn-primary">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id || product._id} className="product-card">
                <div className="product-image">
                  <img src={product.images[0]} alt={product.name} />
                  {product.isFeatured && (
                    <span className="featured-badge">Featured</span>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <div className="product-price">
                      {product.currency} {product.price.toFixed(2)}
                    </div>
                    <div className="product-source">
                      <span className={`source-badge ${product.source}`}>{product.source}</span>
                    </div>
                  </div>
                </div>
                <div className="product-actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/products/${product.id || product._id}`)}
                  >
                    View Details
                  </button>
                  {user && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        addItem(product);
                        navigate('/cart');
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {featuredProducts.length === 0 && !loading && !error && (
          <div className="no-products">
            <p>No featured products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
