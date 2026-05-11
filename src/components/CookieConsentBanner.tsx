import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type ConsentState = "accepted" | "declined" | null;

const COOKIE_CONSENT_KEY = "tpi_cookie_consent";

const CookieConsentBanner = () => {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (saved === "accepted" || saved === "declined") {
      setConsent(saved);
    } else {
      setConsent(null);
    }
    setIsHydrated(true);
  }, []);

  const isVisible = useMemo(
    () => isHydrated && consent === null,
    [consent, isHydrated],
  );

  useEffect(() => {
    const className = "has-cookie-consent-banner";
    if (isVisible) {
      document.body.classList.add(className);
      return;
    }

    document.body.classList.remove(className);
  }, [isVisible]);

  const setPreference = (value: Exclude<ConsentState, null>) => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setConsent(value);

    window.dispatchEvent(
      new CustomEvent("tpi:cookie-consent-updated", {
        detail: { consent: value },
      }),
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-card/95 px-4 py-4 backdrop-blur-md"
    >
      <div className="container mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-3xl text-sm text-muted-foreground">
          We use cookies to improve user experience, analytics, and learning progress tracking.
          You can accept or decline non-essential cookies at any time.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="hero"
            className="min-w-[150px]"
            onClick={() => setPreference("accepted")}
          >
            Accept Cookies
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-w-[110px]"
            onClick={() => setPreference("declined")}
          >
            Decline
          </Button>
          <Button type="button" variant="ghost" asChild>
            <Link to="/privacy-policy">Learn More</Link>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsentBanner;
