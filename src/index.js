// index.js (Your original index.js, which is now correct with the updated authConfig.js)
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Assuming this is at src/index.css

// Import MSAL.js libraries
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

// Import your MSAL configuration
import { msalConfig } from './authConfig'; // This will now correctly import msalConfig from src/authConfig.js

// Initialize the PublicClientApplication instance
const msalInstance = new PublicClientApplication(msalConfig);

// Optional: Add a callback for account changes to handle token acquisition silently
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.ACCOUNT_ADDED || event.eventType === EventType.ACCOUNT_REMOVED) {
    if (event.payload.account) {
      msalInstance.setActiveAccount(event.payload.account);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        {/* Wrap your App with MsalProvider to make the MSAL instance available */}
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>
    );
  } else {
    console.error("Root element not found to render the React app.");
  }
});