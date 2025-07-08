// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    // Overlay background: Uses dark-bg-canvas-start with increased opacity for a consistent overlay
    <div className="fixed inset-0 bg-dark-bg-canvas-start bg-opacity-70 flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2">
          {/* Spinner dots: Now use brand-orange-light */}
          <div className="w-4 h-4 bg-brand-orange-light rounded-full animate-bounce-dot" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 bg-brand-orange-light rounded-full animate-bounce-dot" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-brand-orange-light rounded-full animate-bounce-dot" style={{ animationDelay: '0.4s' }}></div>
        </div>
        {/* Loading text: Uses text-primary-dark for readability on dark overlay */}
        <p className="text-text-primary-dark text-lg mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;