import React, { useState } from 'react';
import './ProductResults.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ProductResults({ results, uploadedImage, onSimilarProductsFound }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [minSimilarity, setMinSimilarity] = useState(0);
  const [sortBy, setSortBy] = useState('similarity'); // 'similarity' or 'price'
  const [loadingProductId, setLoadingProductId] = useState(null);

  const handleFindSimilar = async (productId) => {
    try {
      setLoadingProductId(productId);
      const response = await fetch(`${API_URL}/api/products/${productId}/similar`);
      
      if (!response.ok) {
        throw new Error('Failed to find similar products');
      }
      
      const data = await response.json();
      
      if (data.success && data.results.length > 0) {
        // Call the parent component's handler with the results
        onSimilarProductsFound(data.results, data.targetProduct);
      } else {
        alert('No similar products found');
      }
    } catch (error) {
      console.error('Error finding similar products:', error);
      alert('Error finding similar products. Please try again.');
    } finally {
      setLoadingProductId(null);
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(results.map(r => r.category))];

  // Filter and sort results
  const filteredResults = results
    .filter(r => {
      if (filterCategory !== 'all' && r.category !== filterCategory) return false;
      if (r.similarity < minSimilarity) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'similarity') {
        return b.similarity - a.similarity;
      } else {
        return a.price - b.price;
      }
    });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Handle paths that already have leading slash
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_URL}${path}`;
  };

  const getSimilarityColor = (similarity) => {
    if (similarity >= 70) return '#10b981'; // green
    if (similarity >= 50) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Search Results ({filteredResults.length} products found)</h2>
        
        <div className="uploaded-image-preview">
          <h3>Your Image:</h3>
          <img 
            src={getImageUrl(uploadedImage)} 
            alt="Uploaded" 
            className="uploaded-thumbnail"
          />
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="category-filter">
            <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Category:
          </label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="similarity-filter">
            <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Min Similarity: {minSimilarity}%
          </label>
          <input
            id="similarity-filter"
            type="range"
            min="0"
            max="100"
            value={minSimilarity}
            onChange={(e) => setMinSimilarity(Number(e.target.value))}
            className="similarity-slider"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="sort-by">
            <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Sort By:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="similarity">Similarity</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="no-results">
          <svg className="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No products match your filters</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredResults.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="product-image"
                />
                <div 
                  className="similarity-badge"
                  style={{ backgroundColor: getSimilarityColor(product.similarity) }}
                >
                  {product.similarity}% Match
                </div>
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                {product.subcategory && (
                  <p className="product-subcategory">{product.subcategory}</p>
                )}
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price}</span>
                  <div className="similarity-bar-container">
                    <div 
                      className="similarity-bar"
                      style={{ 
                        width: `${product.similarity}%`,
                        backgroundColor: getSimilarityColor(product.similarity)
                      }}
                    />
                  </div>
                  <button 
                    className="find-similar-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFindSimilar(product.id);
                    }}
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? (
                      <span className="button-spinner"></span>
                    ) : (
                      <>
                        <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Similar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductResults;
