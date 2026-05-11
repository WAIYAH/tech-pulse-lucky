import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const COOKIE_CONSENT_KEY = "tpi_cookie_consent";

const syncConsent = (value: string | null) => {
  (window as Window & { __TPI_COOKIE_CONSENT__?: string | null }).__TPI_COOKIE_CONSENT__ =
    value;
};

try {
  syncConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY));
  window.addEventListener("tpi:cookie-consent-updated", (event: Event) => {
    const consentEvent = event as CustomEvent<{ consent?: string }>;
    syncConsent(consentEvent.detail?.consent ?? null);
  });
} catch {
  syncConsent(null);
}

createRoot(document.getElementById("root")!).render(<App />);
