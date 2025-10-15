import React, { useState } from 'react';
import './App.css';
import ImageUpload from './components/ImageUpload';
import ProductResults from './components/ProductResults';
import Header from './components/Header';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearchComplete = (results, uploadedImg) => {
    setSearchResults(results);
    setUploadedImage(uploadedImg);
    setLoading(false);
    setError(null);
    
    // Add to search history
    setSearchHistory(prev => [
      { results, uploadedImage: uploadedImg, timestamp: new Date() },
      ...prev.slice(0, 4) // Keep only the last 5 searches
    ]);
  };

  const handleSearchStart = () => {
    setLoading(true);
    setError(null);
  };

  const handleSearchError = (errorMsg) => {
    setError(errorMsg);
    setLoading(false);
    setSearchResults([]);
  };

  const handleReset = () => {
    setSearchResults(null);
    setUploadedImage(null);
    setError(null);
    setLoading(false);
  };

  const handleSimilarProductsFound = (results, targetProduct) => {
    setSearchResults(results);
    setUploadedImage(targetProduct.image);
    setError(null);
    
    // Add to search history
    setSearchHistory(prev => [
      { results, uploadedImage: targetProduct.image, timestamp: new Date() },
      ...prev.slice(0, 4) // Keep only the last 5 searches
    ]);
    
    // Scroll to results
    window.scrollTo({
      top: document.querySelector('.results-container')?.offsetTop - 20 || 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="App">
      <Header />
      
      <main className="main-content">
        <ImageUpload 
          onSearchStart={handleSearchStart}
          onSearchComplete={handleSearchComplete}
          onSearchError={handleSearchError}
          onReset={handleReset}
          loading={loading}
        />

        {error && (
          <div className="error-message">
            <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Analyzing image and finding similar products...</p>
          </div>
        )}

        {searchResults && (
          <ProductResults 
            results={searchResults} 
            uploadedImage={uploadedImage}
            onSimilarProductsFound={handleSimilarProductsFound}
          />
        )}
      </main>

      <footer className="footer">
        <p>Made By <span>Aditya</span> 🚀</p>
      </footer>
    </div>
  );
}

export default App;
