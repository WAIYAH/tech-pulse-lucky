import { lmsConfig } from "@/data/lmsConfig";

const STORAGE_KEYS = {
  settings: "admin_settings_v1",
  content: "admin_content_v1",
  lmsControl: "admin_lms_control_v1",
} as const;

export interface AdminSettingsState {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  defaultCurrency: string;
  sessionTimeoutMinutes: number;
  requireRejectionNote: boolean;
  paymentAlertThreshold: number;
  maintenanceMode: boolean;
}

export interface AdminContentState {
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: string;
  homepageAnnouncement: string;
  seoTitle: string;
  seoDescription: string;
  blockSearchIndexing: boolean;
  includeCoursePagesInSitemap: boolean;
  updatedAt: string;
}

export interface AdminLmsControlState {
  enableCertificates: boolean;
  enableEmailNotifications: boolean;
  enableLiveClasses: boolean;
  enableWaitlist: boolean;
  paymentCollectionEnabled: boolean;
  autoArchiveRejectedPayments: boolean;
}

const defaultSettings: AdminSettingsState = {
  platformName: lmsConfig.platformName,
  supportEmail: lmsConfig.supportEmail,
  supportPhone: lmsConfig.supportPhone,
  defaultCurrency: lmsConfig.payment.currency,
  sessionTimeoutMinutes: 120,
  requireRejectionNote: true,
  paymentAlertThreshold: 50000,
  maintenanceMode: false,
};

const defaultContentState: AdminContentState = {
  heroTitle: "Learn Practical Tech Skills with Get Techy With Lucky",
  heroSubtitle:
    "Hands-on lessons, payment-verified access, and outcomes-focused learning journeys.",
  primaryCta: "Start Learning Today",
  homepageAnnouncement: "New cybersecurity cohort opens this month.",
  seoTitle: "Tech Pulse Insider - Learn Practical Tech Skills",
  seoDescription:
    "Practical LMS courses, career-ready projects, and community learning for tech professionals.",
  blockSearchIndexing: false,
  includeCoursePagesInSitemap: true,
  updatedAt: new Date().toISOString(),
};

const defaultLmsControl: AdminLmsControlState = {
  enableCertificates: lmsConfig.featureFlags.enableCertificates,
  enableEmailNotifications: lmsConfig.featureFlags.enableEmailNotifications,
  enableLiveClasses: lmsConfig.featureFlags.enableLiveClasses,
  enableWaitlist: true,
  paymentCollectionEnabled: true,
  autoArchiveRejectedPayments: false,
};

const isBrowser = typeof window !== "undefined";

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return { ...fallback, ...(JSON.parse(value) as Record<string, unknown>) } as T;
  } catch {
    return fallback;
  }
};

const readState = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  return safeParse<T>(window.localStorage.getItem(key), fallback);
};

const saveState = <T,>(key: string, value: T): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const readAdminSettings = (): AdminSettingsState => {
  return readState<AdminSettingsState>(STORAGE_KEYS.settings, defaultSettings);
};

export const saveAdminSettings = (settings: AdminSettingsState): void => {
  saveState(STORAGE_KEYS.settings, settings);
};

export const readAdminContentState = (): AdminContentState => {
  return readState<AdminContentState>(STORAGE_KEYS.content, defaultContentState);
};

export const saveAdminContentState = (content: AdminContentState): void => {
  saveState(STORAGE_KEYS.content, content);
};

export const readAdminLmsControlState = (): AdminLmsControlState => {
  return readState<AdminLmsControlState>(STORAGE_KEYS.lmsControl, defaultLmsControl);
};

export const saveAdminLmsControlState = (state: AdminLmsControlState): void => {
  saveState(STORAGE_KEYS.lmsControl, state);
};
