import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', fullPage = false }) => {
  const sizeClass = `spinner-${size}`;
  const containerClass = fullPage ? 'loading-container full-page' : 'loading-container';

  return (
    <div className={containerClass}>
      <div className={`loading-spinner ${sizeClass}`}></div>
    </div>
  );
};

export default LoadingSpinner;