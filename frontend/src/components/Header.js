import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          <div className="logo-text">
            <h1>Visual Product Matcher</h1>
            <p className="tagline">Find Similar Products with AI Magic ✨</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
