// src/components/ExcelChoiceModal.js

import React from 'react';
import { X, Globe, Laptop } from 'lucide-react'; // Icons for close, web, desktop

const ExcelChoiceModal = ({ isOpen, onClose, fileName, onOpenWeb, onOpenDesktop }) => {
  if (!isOpen) return null;

  return (
    // Modal Overlay: Consistent with LoadingSpinner and SettingsModal overlays
    <div className="fixed inset-0 bg-dark-bg-canvas-start bg-opacity-70 flex items-center justify-center z-[9999]">
      {/* Modal Content Card: Consistent with login card and settings modal */}
      <div className="bg-light-bg-card p-8 rounded-xl shadow-2xl text-center max-w-md w-full 
                      border-t-4 border-brand-orange-light 
                      dark:bg-dark-bg-card dark:border-brand-orange-dark 
                      dark:shadow-xl"> {/* Added dark:shadow-xl for consistency */}
        
        <div className="flex justify-end">
          {/* Close Button (X icon): Consistent text-secondary colors and hover effect */}
          <button 
            onClick={onClose} 
            className="text-text-secondary-light hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:text-text-primary-dark transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Title: Uses text-primary colors and bold font */}
        <h2 className="text-2xl font-bold text-text-primary-light mb-4 dark:text-text-primary-dark">
          Open "{fileName}"
        </h2>
        
        {/* Description: Uses text-secondary colors for readability */}
        <p className="text-text-secondary-light mb-8 dark:text-text-secondary-dark">
          How would you like to open this Excel file?
        </p>
        
        <div className="flex flex-col gap-4">
          {/* "Open in Excel Online" Button: Uses ui-blue with transparency for a general action */}
          <button
            onClick={onOpenWeb}
            className="flex items-center justify-center px-6 py-3 bg-ui-blue-light/10 text-ui-blue-light rounded-lg shadow-md 
                       hover:bg-ui-blue-light/20 transition-colors duration-300 font-medium 
                       dark:bg-ui-blue-dark/10 dark:text-ui-blue-dark dark:hover:bg-ui-blue-dark/20"
            aria-label="Open in Excel Online"
          >
            <Globe size={20} className="mr-2" /> Open in Excel Online
          </button>
          
          {/* "Open in Excel App" Button: Uses brand-orange with transparency for a prominent alternative */}
          <button
            onClick={onOpenDesktop}
            className="flex items-center justify-center px-6 py-3 bg-brand-orange-light/10 text-brand-orange-light rounded-lg shadow-md 
                       hover:bg-brand-orange-light/20 transition-colors duration-300 font-medium 
                       dark:bg-brand-orange-dark/10 dark:text-brand-orange-dark dark:hover:bg-brand-orange-dark/20"
            aria-label="Open in Excel App"
          >
            <Laptop size={20} className="mr-2" /> Open in Excel App
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelChoiceModal;