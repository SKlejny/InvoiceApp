// src/authConfig.js

export const msalConfig = {
  auth: {
    // Replace with your Azure AD Application (client) ID
    clientId: "6b93b79a-c6e2-4bd9-b3fb-dc5c04fcb61c", 
    
    // Replace with your Azure AD Tenant ID (directory ID) or "common" for multi-tenant apps
    // For single-tenant apps, it will be the ID of your organization's directory.
    authority: "https://login.microsoftonline.com/3bb4d7f8-7011-44c7-bb3b-e869a25ac707", 
    
    // The URI where Azure AD will redirect back to your app after authentication.
    // This MUST be registered in your Azure AD App Registration settings.
    // For local development, this is typically "http://localhost:3000" (or your dev server port).
    // For Codespaces, ensure it's the correct URL, e.g., the URL Codespaces gives you.
    redirectUri: "https://bug-free-waffle-696xwp49g4vh6r7-3000.app.github.dev/", // e.g., "http://localhost:3000"
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your app will store auth tokens.
    storeAuthStateInCookie: false, // Set to true to store auth state in cookies if needed.
  },
};

// Scopes required for your application.
// "User.Read" for basic user profile info.
// "Sites.ReadWrite.All" for comprehensive SharePoint access (modify files, lists, etc.).
// Ensure these are granted and admin-consented in your Azure AD app registration.
export const loginRequest = {
  scopes: ["User.Read", "Sites.ReadWrite.All"]
};

// You might define different scopes for different Graph API calls.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  // You would define other Graph API endpoints here, e.g., for SharePoint:
  // sharePointApiEndpoint: "https://graph.microsoft.com/v1.0/sites/{site-id}/drives/{drive-id}/root:/children"
};
