import { supabase as _supabase } from "@/integrations/supabase/client";

const storageKeys = {
  profile: "student_portal_profile_v1",
  settings: "student_portal_settings_v1",
  supportLegacy: "student_portal_support_v1",
  support: "student_portal_support_all_v1",
  notifications: "student_portal_notifications_v1",
  interestedWebinars: "student_portal_interested_webinars_v1",
} as const;

const isBrowser = typeof window !== "undefined";
const STUDENT_EXPERIENCE_EVENT = "student-portal-experience-updated";
const hasSupabaseSync = Boolean(
  import.meta.env.VITE_ENABLE_SUPABASE_AUTH === "true" &&
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
const warnedOperations = new Set<string>();

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
export type SupportTicketCategory = "billing" | "course" | "technical" | "general";

export type StudentNotificationType =
  | "payment"
  | "support"
  | "learning"
  | "webinar"
  | "system";

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  adminReply?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: StudentNotificationType;
  actionPath?: string;
  read: boolean;
  createdAt: string;
}

interface QueryError {
  message?: string;
}

interface QueryResult<T> {
  data: T | null;
  error: QueryError | null;
}

interface QueryBuilder<Row> extends PromiseLike<QueryResult<Row[]>> {
  select(columns?: string): QueryBuilder<Row>;
  eq(column: string, value: unknown): QueryBuilder<Row>;
  order(column: string, options?: { ascending?: boolean }): QueryBuilder<Row>;
  insert(values: unknown): QueryBuilder<Row>;
  update(values: unknown): QueryBuilder<Row>;
  single(): Promise<QueryResult<Row>>;
  maybeSingle(): Promise<QueryResult<Row>>;
}

interface RealtimeChannelLike {
  on(
    event: "postgres_changes",
    filter: {
      event: string;
      schema: string;
      table: string;
    },
    callback: () => void,
  ): RealtimeChannelLike;
  subscribe(callback?: (status: string) => void): RealtimeChannelLike;
}

interface SupabaseLikeClient {
  from<Row extends Record<string, unknown> = Record<string, unknown>>(
    table: string,
  ): QueryBuilder<Row>;
  channel(name: string): RealtimeChannelLike;
  removeChannel(channel: RealtimeChannelLike): Promise<unknown>;
}

interface SupportTicketRow extends Record<string, unknown> {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  admin_reply?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface StudentNotificationRow extends Record<string, unknown> {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: StudentNotificationType;
  action_path?: string | null;
  read: boolean;
  read_at?: string | null;
  created_at: string;
  updated_at: string;
}

const supabase = _supabase as unknown as SupabaseLikeClient;

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

const randomId = (): string => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

const emitStudentExperienceEvent = (): void => {
  if (!isBrowser) return;
  window.dispatchEvent(new Event(STUDENT_EXPERIENCE_EVENT));
};

const warnOperation = (operation: string, reason?: string): void => {
  if (warnedOperations.has(operation)) return;

  const hint = hasSupabaseSync
    ? reason ?? "Supabase operation failed, using local storage fallback."
    : "Supabase sync disabled, using local storage fallback.";
  console.info(`[Student Experience Sync] ${operation}: ${hint}`);
  warnedOperations.add(operation);
};

const withSupabaseFallback = async <T,>(
  operation: string,
  supabaseRun: () => Promise<T>,
  fallbackRun: () => T | Promise<T>,
): Promise<T> => {
  if (!hasSupabaseSync) {
    warnOperation(operation);
    return fallbackRun();
  }

  try {
    return await supabaseRun();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    warnOperation(operation, message);
    return fallbackRun();
  }
};

const normalizeSupportTicket = (
  ticket: Partial<SupportTicket> &
    Pick<SupportTicket, "id" | "subject" | "message" | "createdAt" | "updatedAt">,
): SupportTicket => {
  return {
    id: ticket.id,
    userId: ticket.userId ?? "unknown-user",
    userName: ticket.userName ?? "Learner",
    userEmail: ticket.userEmail ?? "",
    subject: ticket.subject,
    message: ticket.message,
    category: ticket.category ?? "general",
    priority: ticket.priority ?? "medium",
    status: ticket.status ?? "open",
    adminReply: ticket.adminReply,
    resolvedAt: ticket.resolvedAt,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
};

const readLegacySupportTickets = (userId: string): SupportTicket[] => {
  const legacyRows = readArrayState<Partial<SupportTicket>>(
    makeScopedKey(storageKeys.supportLegacy, userId),
    [],
  );

  return legacyRows
    .filter((row): row is Partial<SupportTicket> & Pick<SupportTicket, "id" | "subject" | "message" | "createdAt" | "updatedAt"> => {
      return Boolean(
        row.id &&
          row.subject &&
          row.message &&
          row.createdAt &&
          row.updatedAt,
      );
    })
    .map((row) =>
      normalizeSupportTicket({
        ...row,
        userId,
      }),
    );
};

const readSupportTicketsRaw = (): SupportTicket[] => {
  const rows = readArrayState<Partial<SupportTicket>>(storageKeys.support, []);

  return rows
    .filter((row): row is Partial<SupportTicket> & Pick<SupportTicket, "id" | "subject" | "message" | "createdAt" | "updatedAt"> => {
      return Boolean(
        row.id &&
          row.subject &&
          row.message &&
          row.createdAt &&
          row.updatedAt,
      );
    })
    .map((row) => normalizeSupportTicket(row));
};

const writeSupportTickets = (tickets: SupportTicket[]): void => {
  saveArrayState(storageKeys.support, tickets);
  emitStudentExperienceEvent();
};

const readNotificationsRaw = (): StudentNotification[] => {
  const rows = readArrayState<Partial<StudentNotification>>(storageKeys.notifications, []);

  return rows
    .filter((row): row is StudentNotification => {
      return Boolean(
        row.id &&
          row.userId &&
          row.title &&
          row.message &&
          row.type &&
          row.createdAt &&
          typeof row.read === "boolean",
      );
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

const writeNotifications = (notifications: StudentNotification[]): void => {
  saveArrayState(storageKeys.notifications, notifications);
  emitStudentExperienceEvent();
};

const mapSupportTicketRow = (row: SupportTicketRow): SupportTicket => {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    subject: row.subject,
    message: row.message,
    category: row.category,
    priority: row.priority,
    status: row.status,
    adminReply: row.admin_reply ?? undefined,
    resolvedAt: row.resolved_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapNotificationRow = (
  row: StudentNotificationRow,
): StudentNotification => {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    type: row.type,
    actionPath: row.action_path ?? undefined,
    read: row.read,
    createdAt: row.created_at,
  };
};

const toSupportTicketInsert = (ticket: SupportTicket) => {
  return {
    user_id: ticket.userId,
    user_name: ticket.userName,
    user_email: ticket.userEmail,
    subject: ticket.subject,
    message: ticket.message,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    admin_reply: ticket.adminReply ?? null,
    resolved_at: ticket.resolvedAt ?? null,
    created_at: ticket.createdAt,
    updated_at: ticket.updatedAt,
  };
};

const toNotificationInsert = (notification: StudentNotification) => {
  return {
    user_id: notification.userId,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    action_path: notification.actionPath ?? null,
    read: notification.read,
    read_at: notification.read ? new Date().toISOString() : null,
    created_at: notification.createdAt,
    updated_at: notification.createdAt,
  };
};

const seedSupportFromLocalIfNeeded = async (
  userId: string,
  remoteRows: SupportTicket[],
): Promise<SupportTicket[]> => {
  if (remoteRows.length > 0) return remoteRows;

  const localRows = readSupportTicketsRaw().filter((row) => row.userId === userId);
  const legacyRows = readLegacySupportTickets(userId);
  const seedRows = [...localRows, ...legacyRows];

  if (seedRows.length === 0) return remoteRows;

  const { error } = await supabase
    .from("support_tickets")
    .insert(seedRows.map((ticket) => toSupportTicketInsert(ticket)));

  if (error) {
    throw new Error(error.message ?? "Unable to migrate support tickets.");
  }

  const { data: refreshedRows, error: refreshError } = await supabase
    .from<SupportTicketRow>("support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (refreshError) {
    throw new Error(refreshError.message ?? "Unable to refresh support tickets.");
  }

  return (refreshedRows ?? []).map(mapSupportTicketRow);
};

const seedNotificationsFromLocalIfNeeded = async (
  userId: string,
  remoteRows: StudentNotification[],
): Promise<StudentNotification[]> => {
  if (remoteRows.length > 0) return remoteRows;

  const localRows = readNotificationsRaw().filter((row) => row.userId === userId);
  if (localRows.length === 0) return remoteRows;

  const { error } = await supabase
    .from("student_notifications")
    .insert(localRows.map((row) => toNotificationInsert(row)));

  if (error) {
    throw new Error(error.message ?? "Unable to migrate notifications.");
  }

  const { data: refreshedRows, error: refreshError } = await supabase
    .from<StudentNotificationRow>("student_notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (refreshError) {
    throw new Error(refreshError.message ?? "Unable to refresh notifications.");
  }

  return (refreshedRows ?? []).map(mapNotificationRow);
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

export const subscribeStudentExperience = (
  onChange: () => void,
): (() => void) => {
  if (!isBrowser) return () => undefined;

  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener(STUDENT_EXPERIENCE_EVENT, handler);

  let channel: RealtimeChannelLike | null = null;
  if (hasSupabaseSync) {
    channel = supabase
      .channel(`student-experience-${Math.random().toString(16).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        handler,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "student_notifications" },
        handler,
      )
      .subscribe();
  }

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STUDENT_EXPERIENCE_EVENT, handler);
    if (channel) {
      void supabase.removeChannel(channel);
    }
  };
};

export const readAllSupportTickets = async (): Promise<SupportTicket[]> => {
  return withSupabaseFallback(
    "readAllSupportTickets",
    async () => {
      const { data, error } = await supabase
        .from<SupportTicketRow>("support_tickets")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) {
        throw new Error(error.message ?? "Unable to load support tickets.");
      }

      return (data ?? []).map(mapSupportTicketRow);
    },
    () =>
      readSupportTicketsRaw().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  );
};

export const readStudentSupportTickets = async (
  userId: string,
): Promise<SupportTicket[]> => {
  return withSupabaseFallback(
    "readStudentSupportTickets",
    async () => {
      const { data, error } = await supabase
        .from<SupportTicketRow>("support_tickets")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      if (error) {
        throw new Error(error.message ?? "Unable to load support tickets.");
      }

      const remoteRows = (data ?? []).map(mapSupportTicketRow);
      return seedSupportFromLocalIfNeeded(userId, remoteRows);
    },
    () => {
      const globalRows = readSupportTicketsRaw().filter((row) => row.userId === userId);
      if (globalRows.length > 0) {
        return globalRows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      }

      // Backward compatibility for older user-scoped support tickets.
      const legacyRows = readLegacySupportTickets(userId);
      if (legacyRows.length === 0) return [];

      const merged = [...readSupportTicketsRaw(), ...legacyRows];
      writeSupportTickets(merged);
      return legacyRows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },
  );
};

export const saveStudentSupportTickets = (
  userId: string,
  tickets: SupportTicket[],
): void => {
  const rows = readSupportTicketsRaw().filter((row) => row.userId !== userId);
  const normalized = tickets.map((ticket) =>
    normalizeSupportTicket({
      ...ticket,
      userId,
    }),
  );
  writeSupportTickets([...rows, ...normalized]);
};

export const createSupportTicket = (input: {
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
}): Promise<SupportTicket> => {
  const now = new Date().toISOString();
  const ticket: SupportTicket = {
    id: randomId(),
    userId: input.userId,
    userName: input.userName.trim() || "Learner",
    userEmail: input.userEmail.trim().toLowerCase(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    category: input.category,
    priority: input.priority,
    status: "open",
    createdAt: now,
    updatedAt: now,
  };

  return withSupabaseFallback(
    "createSupportTicket",
    async () => {
      const { data, error } = await supabase
        .from<SupportTicketRow>("support_tickets")
        .insert({
          user_id: input.userId,
          user_name: input.userName.trim() || "Learner",
          user_email: input.userEmail.trim().toLowerCase(),
          subject: input.subject.trim(),
          message: input.message.trim(),
          category: input.category,
          priority: input.priority,
          status: "open",
        })
        .select("*")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "Unable to create support ticket.");
      }

      emitStudentExperienceEvent();
      return mapSupportTicketRow(data);
    },
    () => {
      const next = [ticket, ...readSupportTicketsRaw()];
      writeSupportTickets(next);
      return ticket;
    },
  );
};

export const updateSupportTicket = (
  ticketId: string,
  updates: Partial<Pick<SupportTicket, "status" | "adminReply" | "priority" | "category" | "subject" | "message">>,
): Promise<SupportTicket | null> => {
  return withSupabaseFallback(
    "updateSupportTicket",
    async () => {
      const now = new Date().toISOString();
      const nextStatus = updates.status;
      const payload: Record<string, unknown> = {
        updated_at: now,
      };

      if (updates.priority) payload.priority = updates.priority;
      if (updates.category) payload.category = updates.category;
      if (typeof updates.subject === "string") payload.subject = updates.subject.trim();
      if (typeof updates.message === "string") payload.message = updates.message.trim();
      if (typeof updates.adminReply === "string") {
        payload.admin_reply = updates.adminReply.trim() || null;
      }
      if (nextStatus) {
        payload.status = nextStatus;
        payload.resolved_at = nextStatus === "resolved" ? now : null;
      }

      const { data, error } = await supabase
        .from<SupportTicketRow>("support_tickets")
        .update(payload)
        .eq("id", ticketId)
        .select("*")
        .maybeSingle();

      if (error) {
        throw new Error(error.message ?? "Unable to update support ticket.");
      }
      if (!data) return null;

      emitStudentExperienceEvent();
      return mapSupportTicketRow(data);
    },
    () => {
      const rows = readSupportTicketsRaw();
      const target = rows.find((row) => row.id === ticketId);
      if (!target) return null;

      const nextStatus = updates.status ?? target.status;
      const nextTicket: SupportTicket = {
        ...target,
        ...updates,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
        resolvedAt: nextStatus === "resolved" ? new Date().toISOString() : undefined,
      };

      const nextRows = rows.map((row) => (row.id === ticketId ? nextTicket : row));
      writeSupportTickets(nextRows);
      return nextTicket;
    },
  );
};

export const readStudentNotifications = (
  userId: string,
): Promise<StudentNotification[]> => {
  return withSupabaseFallback(
    "readStudentNotifications",
    async () => {
      const { data, error } = await supabase
        .from<StudentNotificationRow>("student_notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message ?? "Unable to load notifications.");
      }

      const remoteRows = (data ?? []).map(mapNotificationRow);
      return seedNotificationsFromLocalIfNeeded(userId, remoteRows);
    },
    () => readNotificationsRaw().filter((item) => item.userId === userId),
  );
};

export const createStudentNotification = (input: {
  userId: string;
  title: string;
  message: string;
  type: StudentNotificationType;
  actionPath?: string;
}): Promise<StudentNotification> => {
  const notification: StudentNotification = {
    id: randomId(),
    userId: input.userId,
    title: input.title.trim(),
    message: input.message.trim(),
    type: input.type,
    actionPath: input.actionPath,
    read: false,
    createdAt: new Date().toISOString(),
  };

  return withSupabaseFallback(
    "createStudentNotification",
    async () => {
      const { data, error } = await supabase
        .from<StudentNotificationRow>("student_notifications")
        .insert({
          user_id: input.userId,
          title: input.title.trim(),
          message: input.message.trim(),
          type: input.type,
          action_path: input.actionPath ?? null,
          read: false,
          read_at: null,
        })
        .select("*")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "Unable to create notification.");
      }

      emitStudentExperienceEvent();
      return mapNotificationRow(data);
    },
    () => {
      const next = [notification, ...readNotificationsRaw()];
      writeNotifications(next);
      return notification;
    },
  );
};

export const createBulkStudentNotifications = (input: {
  userIds: string[];
  title: string;
  message: string;
  type: StudentNotificationType;
  actionPath?: string;
}): Promise<StudentNotification[]> => {
  const uniqueUserIds = Array.from(new Set(input.userIds)).filter(Boolean);
  if (uniqueUserIds.length === 0) return Promise.resolve([]);

  const now = new Date().toISOString();
  const created = uniqueUserIds.map((userId) => ({
    id: randomId(),
    userId,
    title: input.title.trim(),
    message: input.message.trim(),
    type: input.type,
    actionPath: input.actionPath,
    read: false,
    createdAt: now,
  } satisfies StudentNotification));

  return withSupabaseFallback(
    "createBulkStudentNotifications",
    async () => {
      const payload = uniqueUserIds.map((userId) => ({
        user_id: userId,
        title: input.title.trim(),
        message: input.message.trim(),
        type: input.type,
        action_path: input.actionPath ?? null,
        read: false,
        read_at: null,
      }));

      const { data, error } = await supabase
        .from<StudentNotificationRow>("student_notifications")
        .insert(payload)
        .select("*");

      if (error) {
        throw new Error(error.message ?? "Unable to create notifications.");
      }

      emitStudentExperienceEvent();
      return (data ?? []).map(mapNotificationRow);
    },
    () => {
      const next = [...created, ...readNotificationsRaw()];
      writeNotifications(next);
      return created;
    },
  );
};

export const markStudentNotificationRead = (
  userId: string,
  notificationId: string,
): Promise<void> => {
  return withSupabaseFallback(
    "markStudentNotificationRead",
    async () => {
      const { error } = await supabase
        .from("student_notifications")
        .update({
          read: true,
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("id", notificationId);
      if (error) {
        throw new Error(error.message ?? "Unable to mark notification as read.");
      }

      emitStudentExperienceEvent();
    },
    () => {
      const rows = readNotificationsRaw();
      const next = rows.map((row) => {
        if (row.userId !== userId || row.id !== notificationId) return row;
        return { ...row, read: true };
      });
      writeNotifications(next);
    },
  );
};

export const readInterestedWebinarIds = (userId: string): string[] => {
  return readArrayState<string>(makeScopedKey(storageKeys.interestedWebinars, userId), []);
};

export const toggleInterestedWebinar = (userId: string, webinarId: string): string[] => {
  const current = readInterestedWebinarIds(userId);
  const next = current.includes(webinarId)
    ? current.filter((id) => id !== webinarId)
    : [...current, webinarId];
  saveArrayState(makeScopedKey(storageKeys.interestedWebinars, userId), next);
  emitStudentExperienceEvent();
  return next;
};

export const markAllStudentNotificationsRead = (userId: string): Promise<void> => {
  return withSupabaseFallback(
    "markAllStudentNotificationsRead",
    async () => {
      const { error } = await supabase
        .from("student_notifications")
        .update({
          read: true,
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("read", false);
      if (error) {
        throw new Error(error.message ?? "Unable to mark all notifications as read.");
      }

      emitStudentExperienceEvent();
    },
    () => {
      const rows = readNotificationsRaw();
      const next = rows.map((row) => {
        if (row.userId !== userId) return row;
        return { ...row, read: true };
      });
      writeNotifications(next);
    },
  );
};
