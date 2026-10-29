import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productAPI } from '../services/api';
import { useCart } from '../hooks/useCart';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(productId);
      setProduct(response.data.data.product);
      setError(null);
    } catch (err) {
      setError(t('error.productNotFound'));
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addItem(product, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>{t('error.productNotFound')}</h2>
        <p>{t('error.productNotFound')}</p>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <button onClick={() => navigate('/products')} className="back-btn">
          ← {t('common.back')}
        </button>

        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              <img src={product.images[0]} alt={product.name} />
            </div>
            {product.images.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((image, index) => (
                  <img key={image} src={image} alt={`${product.name} ${index + 1}`} />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>
            
            {product.nameDari && (
              <h2 className="product-name-dari">{product.nameDari}</h2>
            )}

            <div className="product-meta">
              <div className="product-price">
                {product.currency} {product.price.toFixed(2)}
              </div>
              <div className="product-source">
                <span className={`source-badge ${product.source}`}>{product.source}</span>
              </div>
              {product.stock > 0 && (
                <div className="product-stock">
                  <span className="stock-available">{t('productDetail.inStock')}</span>
                  ({product.stock} {t('productDetail.available')})
                </div>
              )}
              {product.stock <= 0 && (
                <div className="product-stock">
                  <span className="stock-out">{t('productDetail.outOfStock')}</span>
                </div>
              )}
            </div>

            <div className="product-description">
              <h3>{t('productDetail.description')}</h3>
              <p>{product.description}</p>
              {product.descriptionDari && (
                <div>
                  <h3>{t('productDetail.description')}</h3>
                  <p>{product.descriptionDari}</p>
                </div>
              )}
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="product-specifications">
                <h3>{t('productDetail.specifications')}</h3>
                <div className="specs-grid">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-key">{key}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="product-actions">
              <div className="quantity-selector">
                <label>{t('productDetail.quantity')}:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  className="btn btn-primary add-to-cart"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  {t('productDetail.addToCart')}
                </button>
                <button 
                  className="btn btn-secondary buy-now"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  {t('productDetail.buyNow')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
