// src/components/Header.js
import React from 'react';
import { LogOut, RefreshCw, Settings } from 'lucide-react';

const Header = ({ onLogout, onRefresh, onSettingsClick, setCurrentPage, currentPage }) => {
  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  return (
    <header className="bg-light-bg-card dark:bg-dark-bg-card shadow-md sticky top-0 z-40 p-3 sm:p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 
          className="text-xl sm:text-2xl font-bold text-brand-orange-light dark:text-brand-orange-dark cursor-pointer"
          onClick={navigateToDashboard}
        >
          Invoice Processing
        </h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button onClick={onRefresh} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label="Refresh Files">
            <RefreshCw size={20} />
          </button>
          <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label="Settings">
            <Settings size={20} />
          </button>
          <button onClick={onLogout} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;