import type { Configuration } from "@azure/msal-browser";

const authority = import.meta.env.VITE_ENTRA_AUTHORITY;

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID,
    authority,
    // CIAM-domänen (ciamlogin.com) är inte en av MSAL:s inbyggt kända authorities,
    // så den måste vitlistas explicit annars kastar MSAL endpoints_resolution_error.
    knownAuthorities: [new URL(authority).hostname],
    redirectUri: "/",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const loginRequest = {
  scopes: [import.meta.env.VITE_API_SCOPE],
};
