import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import "./index.css";
import App from "./App.tsx";
import { msalInstance } from "./auth/msalInstance";

msalInstance.addEventCallback((event) => {
  if (
    event.eventType === EventType.LOGIN_SUCCESS &&
    event.payload &&
    "account" in event.payload &&
    event.payload.account
  ) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});

await msalInstance.initialize();

// Slutför en ev. pågående redirect-inloggning och se till att ett konto alltid
// är "aktivt" - annars hittar apiClient.ts interceptor inget konto att hämta
// token för efter en vanlig sidladdning (bara addEventCallback räcker inte).
const redirectResponse = await msalInstance.handleRedirectPromise();
if (redirectResponse?.account) {
  msalInstance.setActiveAccount(redirectResponse.account);
} else if (!msalInstance.getActiveAccount()) {
  const [firstAccount] = msalInstance.getAllAccounts();
  if (firstAccount) {
    msalInstance.setActiveAccount(firstAccount);
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </StrictMode>
);
