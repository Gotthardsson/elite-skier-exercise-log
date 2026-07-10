import axios from "axios";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalInstance } from "../auth/msalInstance";
import { loginRequest } from "../auth/authConfig";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    return config;
  }

  try {
    const result = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });
    config.headers.Authorization = `Bearer ${result.accessToken}`;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect(loginRequest);
    } else {
      throw error;
    }
  }

  return config;
});

export default apiClient;
