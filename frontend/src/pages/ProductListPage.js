import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { productAPI } from '../services/api';
import { Link } from 'react-router-dom';
import './ProductListPage.css';

const ProductListPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;
      if (searchQuery) {
        response = await productAPI.search(searchQuery);
      } else {
        response = await productAPI.getAll({ page: currentPage, limit: 12 });
      }
      setProducts(response.data.data.products);
      setTotalPages(response.data.pagination?.pages || 1);
      setError(null);
    } catch (err) {
      setError(t('error.networkError'));
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, currentPage]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="product-list-page">
      <div className="product-list-container">
        <div className="page-header">
          <h1>{t('products.title')}</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder={t('products.searchPlaceholder')}
              value={searchQuery}
              onChange={handleSearch}
            />
            <span>🔍</span>
          </div>
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchProducts} className="btn btn-primary">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="products-grid">
            {products.map((product) => (
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
                  <Link className="btn btn-primary btn-sm" to={`/products/${product.id || product._id}`}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length === 0 && !loading && !error && (
          <div className="no-products">
            <p>{t('products.noProductsFound')}</p>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
