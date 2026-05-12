const storageKeys = {
  profile: "student_portal_profile_v1",
  settings: "student_portal_settings_v1",
  support: "student_portal_support_v1",
} as const;

const isBrowser = typeof window !== "undefined";

export interface StudentProfileState {
  jobTitle: string;
  organization: string;
  country: string;
  timezone: string;
  bio: string;
  learningGoal: string;
  linkedinUrl: string;
  githubUrl: string;
}

export interface StudentSettingsState {
  emailNotifications: boolean;
  smsNotifications: boolean;
  weeklyDigest: boolean;
  webinarReminders: boolean;
  autoplayNextLesson: boolean;
  highContrastMode: boolean;
}

export type SupportTicketPriority = "low" | "medium" | "high";
export type SupportTicketStatus = "open" | "in_progress" | "resolved";

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  category: "billing" | "course" | "technical" | "general";
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
}

const defaultProfileState: StudentProfileState = {
  jobTitle: "",
  organization: "",
  country: "Kenya",
  timezone: "Africa/Nairobi",
  bio: "",
  learningGoal: "",
  linkedinUrl: "",
  githubUrl: "",
};

const defaultSettingsState: StudentSettingsState = {
  emailNotifications: true,
  smsNotifications: false,
  weeklyDigest: true,
  webinarReminders: true,
  autoplayNextLesson: true,
  highContrastMode: false,
};

const makeScopedKey = (baseKey: string, userId: string): string => {
  return `${baseKey}:${userId}`;
};

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return { ...fallback, ...(JSON.parse(raw) as Record<string, unknown>) } as T;
  } catch {
    return fallback;
  }
};

const safeParseArray = <T,>(raw: string | null, fallback: T[]): T[] => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
};

const readState = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  return safeParse(window.localStorage.getItem(key), fallback);
};

const saveState = <T,>(key: string, value: T): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const readArrayState = <T,>(key: string, fallback: T[]): T[] => {
  if (!isBrowser) return fallback;
  return safeParseArray(window.localStorage.getItem(key), fallback);
};

const saveArrayState = <T,>(key: string, value: T[]): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const readStudentProfileState = (userId: string): StudentProfileState => {
  return readState<StudentProfileState>(
    makeScopedKey(storageKeys.profile, userId),
    defaultProfileState,
  );
};

export const saveStudentProfileState = (
  userId: string,
  state: StudentProfileState,
): void => {
  saveState(makeScopedKey(storageKeys.profile, userId), state);
};

export const readStudentSettingsState = (userId: string): StudentSettingsState => {
  return readState<StudentSettingsState>(
    makeScopedKey(storageKeys.settings, userId),
    defaultSettingsState,
  );
};

export const saveStudentSettingsState = (
  userId: string,
  state: StudentSettingsState,
): void => {
  saveState(makeScopedKey(storageKeys.settings, userId), state);
};

export const readStudentSupportTickets = (userId: string): SupportTicket[] => {
  return readArrayState<SupportTicket>(makeScopedKey(storageKeys.support, userId), []);
};

export const saveStudentSupportTickets = (
  userId: string,
  tickets: SupportTicket[],
): void => {
  saveArrayState(makeScopedKey(storageKeys.support, userId), tickets);
};
