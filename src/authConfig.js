// src/authConfig.js


export const msalConfig = {
  auth: {
    clientId: "6b93b79a-c6e2-4bd9-b3fb-dc5c04fcb61c", 
    authority: "https://login.microsoftonline.com/3bb4d7f8-7011-44c7-bb3b-e869a25ac707",
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