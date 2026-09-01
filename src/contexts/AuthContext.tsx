import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { LmsProfile, LmsRole } from "@/types/lms";

interface RegisterInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthActionResult {
  success: boolean;
  message: string;
  user?: LmsProfile | null;
}

type OAuthProvider = "google" | "github";

interface AuthContextValue {
  user: LmsProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authMode: "supabase" | "local";
  register: (input: RegisterInput) => Promise<AuthActionResult>;
  login: (input: LoginInput) => Promise<AuthActionResult>;
  signInWithOAuth: (
    provider: OAuthProvider,
    redirectPath?: string,
  ) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<AuthActionResult>;
  hasRole: (...roles: LmsRole[]) => boolean;
}

interface LocalAuthUserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Exclude<LmsRole, "guest">;
  dateJoined: string;
  passwordHash: string;
}

interface LocalSessionRecord {
  userId: string;
  lastActivityAt?: string;
}

const LOCAL_USERS_KEY = "lms_auth_users";
const LOCAL_SESSION_KEY = "lms_auth_session";
const LOCAL_LOGIN_ATTEMPTS_KEY = "lms_auth_login_attempts_v1";
const LOCAL_LOGIN_MAX_ATTEMPTS = 5;
const LOCAL_LOGIN_LOCKOUT_MS = 15 * 60 * 1000;

interface LocalLoginAttemptEntry {
  count: number;
  lockUntil?: string;
  lastFailureAt: string;
}

type LocalLoginAttemptMap = Record<string, LocalLoginAttemptEntry>;

const LOCAL_BOOTSTRAP_ADMIN: LocalAuthUserRecord = {
  id: "local-admin-bootstrap",
  fullName: "Lucky LMS Admin",
  email: "admin@nakolaexpertsystems.com",
  phone: "+254715674828",
  role: "admin",
  dateJoined: "2026-05-09T00:00:00.000Z",
  // SHA-256("tech-pulse-insider-local-auth-v1:LuckyAdmin@2026!")
  passwordHash: "8aeb41ca6bb2b346d4737956e001876f4de2f1dbe5acaa904fb5519bd35b8692",
};

const LOCAL_BOOTSTRAP_STUDENT: LocalAuthUserRecord = {
  id: "local-student-bootstrap",
  fullName: "Lucky LMS Learner",
  email: "student@nakolaexpertsystems.com",
  phone: "+254700000001",
  role: "student",
  dateJoined: "2026-05-12T00:00:00.000Z",
  // SHA-256("tech-pulse-insider-local-auth-v1:LuckyStudent@2026!")
  passwordHash: "6b9748bffd8419dcb65db2fb8fd0ce31a1e1f97dfe3d0ed4ea566955b2f9a273",
};

const SUPPORTED_ROLES: LmsRole[] = ["guest", "student", "admin"];

const AUTH_MODE: "supabase" | "local" =
  import.meta.env.VITE_ENABLE_SUPABASE_AUTH === "true" ? "supabase" : "local";

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean);

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const isAdminEmail = (email: string): boolean =>
  adminEmails.includes(normalizeEmail(email));

const resolveUserRole = (roleCandidate: unknown, email: string): LmsRole => {
  if (
    typeof roleCandidate === "string" &&
    SUPPORTED_ROLES.includes(roleCandidate as LmsRole)
  ) {
    return roleCandidate as LmsRole;
  }

  return isAdminEmail(email) ? "admin" : "student";
};

const userToProfile = (user: User): LmsProfile => {
  const email = user.email ?? "";
  const metadata = user.user_metadata ?? {};
  const fullName =
    metadata.full_name ??
    metadata.name ??
    email.split("@")[0] ??
    "Learner";

  return {
    id: user.id,
    fullName,
    email,
    phone: metadata.phone ?? "",
    role: resolveUserRole(metadata.role, email),
    dateJoined: user.created_at ?? new Date().toISOString(),
    avatarUrl: metadata.avatar_url || undefined,
  };
};

const safeJsonParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const loadLocalUsers = (): LocalAuthUserRecord[] => {
  const raw = window.localStorage.getItem(LOCAL_USERS_KEY);
  return safeJsonParse<LocalAuthUserRecord[]>(raw, []);
};

const saveLocalUsers = (users: LocalAuthUserRecord[]): void => {
  window.localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const loadLocalSession = (): LocalSessionRecord | null => {
  const raw = window.localStorage.getItem(LOCAL_SESSION_KEY);
  return safeJsonParse<LocalSessionRecord | null>(raw, null);
};

const saveLocalSession = (session: LocalSessionRecord): void => {
  window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
};

const clearLocalSession = (): void => {
  window.localStorage.removeItem(LOCAL_SESSION_KEY);
};

const loadLoginAttempts = (): LocalLoginAttemptMap => {
  const raw = window.localStorage.getItem(LOCAL_LOGIN_ATTEMPTS_KEY);
  return safeJsonParse<LocalLoginAttemptMap>(raw, {});
};

const saveLoginAttempts = (attempts: LocalLoginAttemptMap): void => {
  window.localStorage.setItem(LOCAL_LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
};

const clearExpiredLoginLocks = (attempts: LocalLoginAttemptMap): LocalLoginAttemptMap => {
  const now = Date.now();
  const next: LocalLoginAttemptMap = {};

  Object.entries(attempts).forEach(([email, entry]) => {
    if (!entry?.lockUntil) {
      next[email] = entry;
      return;
    }

    const lockUntilMs = Date.parse(entry.lockUntil);
    if (Number.isNaN(lockUntilMs) || lockUntilMs <= now) {
      return;
    }

    next[email] = entry;
  });

  return next;
};

const getLoginLockRemainingMs = (email: string): number => {
  const attempts = clearExpiredLoginLocks(loadLoginAttempts());
  saveLoginAttempts(attempts);

  const entry = attempts[email];
  if (!entry?.lockUntil) return 0;

  const lockUntilMs = Date.parse(entry.lockUntil);
  if (Number.isNaN(lockUntilMs)) return 0;

  const remainingMs = lockUntilMs - Date.now();
  return remainingMs > 0 ? remainingMs : 0;
};

const registerFailedLoginAttempt = (email: string): void => {
  const attempts = clearExpiredLoginLocks(loadLoginAttempts());
  const previous = attempts[email];
  const nextCount = (previous?.count ?? 0) + 1;
  const nowIso = new Date().toISOString();

  attempts[email] = {
    count: nextCount,
    lastFailureAt: nowIso,
    lockUntil:
      nextCount >= LOCAL_LOGIN_MAX_ATTEMPTS
        ? new Date(Date.now() + LOCAL_LOGIN_LOCKOUT_MS).toISOString()
        : undefined,
  };

  saveLoginAttempts(attempts);
};

const clearLoginAttempts = (email: string): void => {
  const attempts = clearExpiredLoginLocks(loadLoginAttempts());
  if (!(email in attempts)) return;
  delete attempts[email];
  saveLoginAttempts(attempts);
};

const ensureLocalBootstrapUsers = (): void => {
  const users = loadLocalUsers();
  const bootstraps = [LOCAL_BOOTSTRAP_ADMIN, LOCAL_BOOTSTRAP_STUDENT];
  let hasChanges = false;

  bootstraps.forEach((bootstrapUser) => {
    const exists = users.some((item) => item.email === bootstrapUser.email);
    if (exists) return;
    users.push(bootstrapUser);
    hasChanges = true;
  });

  if (hasChanges) {
    saveLocalUsers(users);
  }
};

const randomId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const passwordToHash = async (password: string): Promise<string> => {
  const salt = "tech-pulse-insider-local-auth-v1";

  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(`${salt}:${password}`);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    const hashArray = Array.from(new Uint8Array(digest));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  return btoa(`${salt}:${password}`);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LmsProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (AUTH_MODE === "supabase") {
      const initSupabaseSession = async () => {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ? userToProfile(data.session.user) : null);
        setIsLoading(false);
      };

      initSupabaseSession();

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ? userToProfile(session.user) : null);
      });

      return () => {
        subscription.unsubscribe();
      };
    }

    const session = loadLocalSession();
    ensureLocalBootstrapUsers();
    if (!session) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const localUsers = loadLocalUsers();
    const localUser = localUsers.find((item) => item.id === session.userId);
    if (!localUser) {
      clearLocalSession();
      setUser(null);
      setIsLoading(false);
      return;
    }

    setUser({
      id: localUser.id,
      fullName: localUser.fullName,
      email: localUser.email,
      phone: localUser.phone,
      role: localUser.role,
      dateJoined: localUser.dateJoined,
    });
    setIsLoading(false);
  }, []);

  const register = async (input: RegisterInput): Promise<AuthActionResult> => {
    const normalizedEmail = normalizeEmail(input.email);
    const role = resolveUserRole("student", normalizedEmail);

    if (AUTH_MODE === "supabase") {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
            phone: input.phone,
            role,
          },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.session?.user) {
        const profile = userToProfile(data.session.user);
        setUser(profile);
        return {
          success: true,
          message: "Account created successfully.",
          user: profile,
        };
      }

      return {
        success: true,
        message:
          "Account created. Please check your email to confirm your account before logging in.",
        user: null,
      };
    }

    const users = loadLocalUsers();
    const existing = users.find((item) => item.email === normalizedEmail);
    if (existing) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const passwordHash = await passwordToHash(input.password);
    const localUser: LocalAuthUserRecord = {
      id: randomId(),
      fullName: input.fullName.trim(),
      email: normalizedEmail,
      phone: input.phone.trim(),
      role: role === "guest" ? "student" : role,
      dateJoined: new Date().toISOString(),
      passwordHash,
    };

    users.push(localUser);
    saveLocalUsers(users);
    saveLocalSession({ userId: localUser.id });
    clearLoginAttempts(normalizedEmail);

    const profile: LmsProfile = {
      id: localUser.id,
      fullName: localUser.fullName,
      email: localUser.email,
      phone: localUser.phone,
      role: localUser.role,
      dateJoined: localUser.dateJoined,
    };

    setUser(profile);
    return {
      success: true,
      message: "Account created successfully.",
      user: profile,
    };
  };

  const login = async (input: LoginInput): Promise<AuthActionResult> => {
    const normalizedEmail = normalizeEmail(input.email);

    if (AUTH_MODE === "supabase") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: input.password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (!data.user) {
        return {
          success: false,
          message: "Unable to start your session. Please try again.",
        };
      }

      const profile = userToProfile(data.user);
      setUser(profile);
      return {
        success: true,
        message: "Logged in successfully.",
        user: profile,
      };
    }

    const lockRemainingMs = getLoginLockRemainingMs(normalizedEmail);
    if (lockRemainingMs > 0) {
      const lockMinutes = Math.ceil(lockRemainingMs / 60000);
      return {
        success: false,
        message: `Too many failed attempts. Try again in ${lockMinutes} minute${
          lockMinutes === 1 ? "" : "s"
        }.`,
      };
    }

    const users = loadLocalUsers();
    const localUser = users.find((item) => item.email === normalizedEmail);

    if (!localUser) {
      registerFailedLoginAttempt(normalizedEmail);
      return { success: false, message: "Invalid email or password." };
    }

    const passwordHash = await passwordToHash(input.password);
    if (passwordHash !== localUser.passwordHash) {
      registerFailedLoginAttempt(normalizedEmail);
      return { success: false, message: "Invalid email or password." };
    }

    saveLocalSession({ userId: localUser.id });
    clearLoginAttempts(normalizedEmail);
    const profile: LmsProfile = {
      id: localUser.id,
      fullName: localUser.fullName,
      email: localUser.email,
      phone: localUser.phone,
      role: localUser.role,
      dateJoined: localUser.dateJoined,
    };

    setUser(profile);
    return {
      success: true,
      message: "Logged in successfully.",
      user: profile,
    };
  };

  const signInWithOAuth = async (
    provider: OAuthProvider,
    redirectPath = "/login",
  ): Promise<AuthActionResult> => {
    if (AUTH_MODE !== "supabase") {
      return {
        success: false,
        message:
          "Social sign-in is only available when Supabase auth mode is enabled.",
      };
    }

    const normalizedPath = redirectPath.startsWith("/")
      ? redirectPath
      : `/${redirectPath}`;
    const redirectTo = `${window.location.origin}${normalizedPath}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: `Redirecting to ${
        provider === "google" ? "Google" : "GitHub"
      }...`,
    };
  };

  const logout = async () => {
    if (AUTH_MODE === "supabase") {
      await supabase.auth.signOut();
      setUser(null);
      return;
    }

    clearLocalSession();
    setUser(null);
  };

  const sendPasswordReset = async (email: string): Promise<AuthActionResult> => {
    const normalizedEmail = normalizeEmail(email);

    if (AUTH_MODE === "supabase") {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        message:
          "Password reset link sent. Check your inbox and follow the instructions.",
      };
    }

    const users = loadLocalUsers();
    const exists = users.some((item) => item.email === normalizedEmail);
    if (!exists) {
      return {
        success: false,
        message: "No account was found with that email address.",
      };
    }

    return {
      success: true,
      message:
        "Local auth mode does not send automatic reset emails. Contact support to reset your password.",
    };
  };

  const hasRole = useCallback(
    (...roles: LmsRole[]): boolean => {
      if (!user) return roles.includes("guest");
      return roles.includes(user.role);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      authMode: AUTH_MODE,
      register,
      login,
      signInWithOAuth,
      logout,
      sendPasswordReset,
      hasRole,
    }),
    [
      user,
      isLoading,
      register,
      login,
      signInWithOAuth,
      logout,
      sendPasswordReset,
      hasRole,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
