// src/authConfig.js


export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID, 
    authority: process.env.REACT_APP_AUTHORITY,
    redirectUri: "/",
    postLogoutRedirectUri: "/" // <-- ADD THIS LINE
  },
  cache: {
    cacheLocation: "sessionStorage", 
    storeAuthStateInCookie: false, 
  },
};

export const loginRequest = {
  scopes: ["User.Read", "Sites.ReadWrite.All"]
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};