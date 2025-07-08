// src/components/SettingsModal.js

import React from 'react';
import { X, Settings as SettingsIcon, Sun, Moon } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, currentExcelPreference, onPreferenceChange, isDarkMode, toggleDarkMode }) => {
  if (!isOpen) return null;

  const handleRadioChange = (event) => {
    onPreferenceChange(event.target.value);
  };

  // Refined toggle handler to prevent double-clicks
  const handleThemeToggleClick = (event) => {
    // IMPORTANT: Stop propagation and prevent default on the *visual toggle element*
    // This stops the click event from bubbling up to the parent <label>,
    // which would otherwise trigger an implicit click on the hidden checkbox.
    event.stopPropagation(); 
    event.preventDefault(); 

    console.log('Theme Toggle Clicked! Current mode:', isDarkMode); // Debugging log
    toggleDarkMode(); // This is the state-flipping function from App.js
  };

  return (
    <div className="fixed inset-0 bg-dark-bg-canvas-start bg-opacity-70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-light-bg-card p-8 rounded-xl shadow-2xl text-center max-w-md w-full 
                      border-t-4 border-brand-orange-light 
                      dark:bg-dark-bg-card dark:border-brand-orange-dark 
                      dark:shadow-xl 
                      transform scale-100 opacity-100 transition-all duration-300 ease-out">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center">
            <SettingsIcon size={24} className="mr-3 text-ui-blue-light dark:text-ui-blue-dark" />
            Settings
          </h2>
          <button 
            onClick={onClose} 
            className="text-text-secondary-light hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:text-text-primary-dark transition-colors"
            aria-label="Close settings"
          >
            <X size={24} />
          </button>
        </div>

        {/* Excel Opening Preference Section (unchanged) */}
        <div className="text-left bg-border-subtle-light/30 dark:bg-border-subtle-dark/30 p-5 rounded-lg mb-6 shadow-inner">
          <h3 className="text-lg font-semibold text-text-primary-light mb-4 dark:text-text-primary-dark">
            How to open Excel files:
          </h3>
          <div className="flex flex-col space-y-3">
            {['ask', 'web', 'desktop'].map((option) => (
              <label 
                key={option}
                className="inline-flex items-center text-text-secondary-light dark:text-text-secondary-dark 
                           cursor-pointer p-2 rounded-md hover:bg-ui-blue-light/10 dark:hover:bg-ui-blue-dark/10 transition-colors" 
              >
                <input
                  type="radio"
                  className="hidden peer"
                  name="excelOpeningPreference"
                  value={option}
                  checked={currentExcelPreference === option}
                  onChange={handleRadioChange}
                />
                <div className="w-5 h-5 rounded-full border-2 border-text-secondary-light 
                                peer-checked:border-brand-orange-light dark:border-text-secondary-dark 
                                dark:peer-checked:border-brand-orange-dark flex items-center justify-center 
                                transition-all duration-200 flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-orange-light opacity-0 
                                  peer-checked:opacity-100 dark:bg-brand-orange-dark transition-opacity duration-200"></div>
                </div>
                <span className="ml-3 font-medium">
                  {option === 'ask' && 'Always ask me (default)'}
                  {option === 'web' && 'Always open in Excel Online'}
                  {option === 'desktop' && 'Always open in Excel App (if installed)'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Dark Mode Toggle Section */}
        <div className="text-left bg-border-subtle-light/30 dark:bg-border-subtle-dark/30 p-5 rounded-lg mb-6 shadow-inner">
          <h3 className="text-lg font-semibold text-text-primary-light mb-4 dark:text-text-primary-dark">
            App Theme:
          </h3>
          <label className="flex items-center cursor-pointer justify-between">
            <span className="text-text-secondary-light font-medium dark:text-text-secondary-dark flex items-center">
              {isDarkMode ? <Moon size={20} className="mr-2 text-ui-blue-dark" /> : <Sun size={20} className="mr-2 text-ui-blue-light" />}
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            {/* Toggle Switch Visuals - onClick is now on this div, with stopPropagation/preventDefault */}
            <div className="relative w-12 h-6 rounded-full transition-all duration-300
                            bg-text-secondary-light peer-checked:bg-status-approved-light
                            dark:bg-text-secondary-dark dark:peer-checked:bg-status-approved-dark"
                 onClick={handleThemeToggleClick} // <-- IMPORTANT: onClick moved here
                 aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                 role="switch"
                 aria-checked={isDarkMode}
            >
              {/* The hidden checkbox input. Its 'checked' state is controlled by 'isDarkMode'. */}
              {/* onChange is provided but does nothing directly, as clicks are handled on the parent div */}
              <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={() => {}} />
              {/* The visual thumb */}
              <div className="absolute left-1 top-1 w-4 h-4 rounded-full transition-all duration-300
                              bg-brand-orange-light transform peer-checked:translate-x-6
                              dark:bg-brand-orange-dark"></div>
            </div>
          </label>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="px-6 py-2 bg-ui-blue-light/10 text-ui-blue-light rounded-lg shadow-md 
                     hover:bg-ui-blue-light/20 transition-colors duration-300 font-medium 
                     dark:bg-ui-blue-dark/10 dark:text-ui-blue-dark dark:hover:bg-ui-blue-dark/20"
          aria-label="Close settings"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;