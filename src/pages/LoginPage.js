// src/pages/LoginPage.js

import React from 'react';
import { LogIn } from 'lucide-react';

// Import your local logo files
import LightModeLogo from '../assets/eam-logo-light.png'; // Make sure this path is correct based on where you save it
import DarkModeLogo from '../assets/eam-logo-dark.png';   // Make sure this path is correct based on where you save it

const LoginPage = ({ onLogin }) => {
  return (
    // Overall page background container: relative for absolute logo positioning
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 
                    bg-gradient-to-br from-light-bg-canvas to-blue-50 
                    dark:from-dark-bg-canvas-start dark:via-dark-bg-canvas-via dark:to-dark-bg-canvas-end">
      
      {/* Background Logo - Light Mode Version */}
      <img
        // Positioning:
        // - `top-[10%]` - Places the top edge of the image at 10% down from the screen's top.
        // - `left-1/2 -translate-x-1/2` - Centers the image horizontally.
        // - `translate-x-[-5px]` - Shifts the centered image 5px to the LEFT (adjust this if needed).
        // Opacity set to 20% for a subtle background effect.
        // Size scale-125 for background presence.
        className="absolute top-[10%] left-1/2 -translate-x-1/2 translate-x-[-95px]
                   w-auto h-auto max-w-full max-h-full object-contain 
                   scale-125 opacity-100 pointer-events-none z-0
                   block dark:hidden" 
        src={LightModeLogo} 
        alt="Company Logo Background Light"
      />

      {/* Background Logo - Dark Mode Version */}
      <img
        // Same positioning and styling as light mode version, just toggled for dark mode.
        className="absolute top-[10%] left-1/2 -translate-x-1/2 translate-x-[-95px]
                   w-auto h-auto max-w-full max-h-full object-contain 
                   scale-125 opacity-100 pointer-events-none z-0
                   hidden dark:block" 
        src={DarkModeLogo} 
        alt="Company Logo Background Dark"
      />

      <div 
        // Main Login Card Container:
        // z-10 ensures it's above the background logo.
        className="bg-light-bg-card p-8 rounded-xl shadow-2xl text-center max-w-md w-full 
                   border-t-4 border-brand-orange-light 
                   dark:bg-dark-bg-card dark:border-brand-orange-dark 
                   dark:shadow-xl z-10" 
      >
        <h2 className="text-3xl font-bold text-text-primary-light mb-6 dark:text-text-primary-dark">Welcome to Invoice System</h2>
        <p className="text-text-secondary-light mb-8 dark:text-text-secondary-dark">Please log in with your Microsoft account to continue.</p>
        
        <button
          onClick={onLogin}
          className="bg-brand-orange-light text-white font-bold py-3 px-6 rounded-lg shadow-lg 
                     hover:bg-brand-orange-dark transition-all duration-300 transform hover:scale-105 
                     flex items-center justify-center mx-auto
                     dark:bg-brand-orange-dark dark:hover:bg-brand-orange-light" 
          aria-label="Login with Microsoft"
        >
          <LogIn className="w-5 h-5 mr-3" />
          Login with Microsoft
        </button>
      </div>
    </div>
  );
};

export default LoginPage;