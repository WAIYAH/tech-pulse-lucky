import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ACTIVITY_STORAGE_KEY = "lms_security_last_activity_at";
const FORCE_LOGOUT_STORAGE_KEY = "lms_security_force_logout_at";
const DEFAULT_IDLE_TIMEOUT_MINUTES = 45;
const IDLE_CHECK_INTERVAL_MS = 20_000;
const ACTIVITY_WRITE_THROTTLE_MS = 10_000;
const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "mousemove",
];

const getIdleTimeoutMs = (): number => {
  const raw = Number(import.meta.env.VITE_SESSION_IDLE_TIMEOUT_MINUTES ?? DEFAULT_IDLE_TIMEOUT_MINUTES);
  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_IDLE_TIMEOUT_MINUTES * 60_000;
  }

  return raw * 60_000;
};

const SessionSecurityGuard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const hasAutoLoggedOut = useRef(false);
  const logoutRef = useRef(logout);
  const toastRef = useRef(toast);
  const lastActivityWriteAtRef = useRef(0);

  const idleTimeoutMs = useMemo(() => getIdleTimeoutMs(), []);

  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      hasAutoLoggedOut.current = false;
      return;
    }

    const touchActivity = () => {
      const now = Date.now();
      if (now - lastActivityWriteAtRef.current < ACTIVITY_WRITE_THROTTLE_MS) {
        return;
      }

      lastActivityWriteAtRef.current = now;
      window.localStorage.setItem(ACTIVITY_STORAGE_KEY, Date.now().toString());
    };

    const doLogout = async (reason: "idle" | "sync") => {
      if (hasAutoLoggedOut.current) return;
      hasAutoLoggedOut.current = true;
      await logoutRef.current();
      toastRef.current({
        title: "Session ended",
        description:
          reason === "idle"
            ? "You were logged out after inactivity for your account security."
            : "Your session changed in another tab. Please login again.",
      });
    };

    const checkIdle = () => {
      const raw = window.localStorage.getItem(ACTIVITY_STORAGE_KEY);
      const lastSeen = raw ? Number(raw) : Date.now();
      const safeLastSeen = Number.isFinite(lastSeen) ? lastSeen : Date.now();
      const idleForMs = Date.now() - safeLastSeen;

      if (idleForMs < idleTimeoutMs) return;

      window.localStorage.setItem(FORCE_LOGOUT_STORAGE_KEY, Date.now().toString());
      void doLogout("idle");
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== FORCE_LOGOUT_STORAGE_KEY || !event.newValue) return;
      void doLogout("sync");
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") return;
      checkIdle();
      touchActivity();
    };

    const onActivity = () => {
      touchActivity();
    };

    touchActivity();
    const intervalId = window.setInterval(checkIdle, IDLE_CHECK_INTERVAL_MS);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibilityChange);
    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, onActivity, { passive: true });
    });

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, onActivity);
      });
    };
  }, [idleTimeoutMs, isAuthenticated, user]);

  return null;
};

export default SessionSecurityGuard;
