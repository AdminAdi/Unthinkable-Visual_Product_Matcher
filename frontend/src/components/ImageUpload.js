import React, { useState, useRef } from 'react';
import axios from 'axios';
import './ImageUpload.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ImageUpload({ onSearchStart, onSearchComplete, onSearchError, onReset, loading }) {
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'url'
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onSearchError('File size must be less than 5MB');
        return;
      }

      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        onSearchError('Only JPEG, PNG, and WebP images are supported');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    if (e.target.value) {
      setPreviewUrl(e.target.value);
    }
  };

  const handleSearch = async () => {
    if (uploadMethod === 'file' && !selectedFile) {
      onSearchError('Please select an image file');
      return;
    }

    if (uploadMethod === 'url' && !imageUrl) {
      onSearchError('Please enter an image URL');
      return;
    }

    onSearchStart();

    try {
      const formData = new FormData();

      if (uploadMethod === 'file') {
        formData.append('image', selectedFile);
      } else {
        formData.append('imageUrl', imageUrl);
      }

      const response = await axios.post(`${API_URL}/api/search`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 second timeout
      });

      if (response.data.success) {
        onSearchComplete(response.data.results, response.data.uploadedImage);
      } else {
        onSearchError(response.data.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      if (error.response) {
        onSearchError(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        onSearchError('No response from server. Please check if the backend is running.');
      } else {
        onSearchError('Error: ' + error.message);
      }
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onReset();
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>Upload an Image to Find Similar Products</h2>
        
        <div className="upload-method-tabs">
          <button
            className={`tab-button ${uploadMethod === 'file' ? 'active' : ''}`}
            onClick={() => {
              setUploadMethod('file');
              setImageUrl('');
              setPreviewUrl(null);
            }}
          >
            <svg className="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload File
          </button>
          <button
            className={`tab-button ${uploadMethod === 'url' ? 'active' : ''}`}
            onClick={() => {
              setUploadMethod('url');
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
          >
            <svg className="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Image URL
          </button>
        </div>

        {uploadMethod === 'file' ? (
          <div className="file-upload-section">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input" className="file-upload-label">
              <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="upload-text">
                {selectedFile ? selectedFile.name : 'Click to select an image'}
              </span>
              <span className="upload-hint">JPEG, PNG, or WebP (max 5MB)</span>
            </label>
          </div>
        ) : (
          <div className="url-upload-section">
            <input
              type="url"
              placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              value={imageUrl}
              onChange={handleUrlChange}
              className="url-input"
            />
          </div>
        )}

        {previewUrl && (
          <div className="preview-section">
            <h3>Preview:</h3>
            <div className="preview-image-container">
              <img src={previewUrl} alt="Preview" className="preview-image" />
            </div>
          </div>
        )}

        <div className="button-group">
          <button
            onClick={handleSearch}
            disabled={loading || (!selectedFile && !imageUrl)}
            className="search-button"
          >
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Searching...
              </>
            ) : (
              <>
                <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find Similar Products
              </>
            )}
          </button>

          {(selectedFile || imageUrl || previewUrl) && (
            <button onClick={handleReset} className="reset-button" disabled={loading}>
              <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
