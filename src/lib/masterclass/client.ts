import { supabase as _supabase } from "@/integrations/supabase/client";

export const isBrowser = typeof window !== "undefined";

export const hasMasterclassSync = Boolean(
  import.meta.env.VITE_ENABLE_SUPABASE_AUTH === "true" &&
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

const warnedOperations = new Set<string>();

export interface QueryError {
  message?: string;
}

export interface QueryResult<T> {
  data: T | null;
  error: QueryError | null;
}

export interface QueryBuilder<Row> extends PromiseLike<QueryResult<Row[]>> {
  select(columns?: string): QueryBuilder<Row>;
  eq(column: string, value: unknown): QueryBuilder<Row>;
  order(column: string, options?: { ascending?: boolean }): QueryBuilder<Row>;
  insert(values: unknown): QueryBuilder<Row>;
  update(values: unknown): QueryBuilder<Row>;
  delete(): QueryBuilder<Row>;
  single(): Promise<QueryResult<Row>>;
  maybeSingle(): Promise<QueryResult<Row>>;
}

export interface RealtimeChannelLike {
  on(
    event: "postgres_changes",
    filter: { event: string; schema: string; table: string },
    callback: () => void,
  ): RealtimeChannelLike;
  subscribe(callback?: (status: string) => void): RealtimeChannelLike;
}

export interface RpcResult<T> {
  data: T | null;
  error: QueryError | null;
}

export interface SupabaseLikeClient {
  from<Row extends Record<string, unknown> = Record<string, unknown>>(table: string): QueryBuilder<Row>;
  channel(name: string): RealtimeChannelLike;
  removeChannel(channel: RealtimeChannelLike): Promise<unknown>;
  rpc<T>(fn: string, args?: Record<string, unknown>): Promise<RpcResult<T>>;
}

export const supabase = _supabase as unknown as SupabaseLikeClient;

const warnOperation = (operation: string, reason?: string): void => {
  if (warnedOperations.has(operation)) return;

  const hint = hasMasterclassSync
    ? reason ?? "Supabase operation failed, using fallback content."
    : "Supabase sync disabled, using fallback content.";
  console.info(`[Masterclass Sync] ${operation}: ${hint}`);
  warnedOperations.add(operation);
};

export const withMasterclassFallback = async <T,>(
  operation: string,
  supabaseRun: () => Promise<T>,
  fallbackRun: () => T | Promise<T>,
): Promise<T> => {
  if (!hasMasterclassSync) {
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

const MASTERCLASS_EXPERIENCE_EVENT = "masterclass-experience-updated";

export const emitMasterclassExperienceEvent = (): void => {
  if (!isBrowser) return;
  window.dispatchEvent(new Event(MASTERCLASS_EXPERIENCE_EVENT));
};

/**
 * Realtime subscription scoped only to tables that plausibly change while a student is
 * actively on a masterclass page: announcements, attendance, and quiz attempts. Curriculum
 * content (weeks/lessons/terminology/resources) is admin-authored and changes rarely, so it
 * is not wired for realtime — pages re-fetch it via an explicit refresh instead.
 */
export const subscribeMasterclassExperience = (onChange: () => void): (() => void) => {
  if (!isBrowser) return () => undefined;

  const handler = () => onChange();
  window.addEventListener(MASTERCLASS_EXPERIENCE_EVENT, handler);

  let channel: RealtimeChannelLike | null = null;
  if (hasMasterclassSync) {
    channel = supabase
      .channel(`masterclass-experience-${Math.random().toString(16).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "masterclass_announcements" }, handler)
      .on("postgres_changes", { event: "*", schema: "public", table: "masterclass_attendance" }, handler)
      .on("postgres_changes", { event: "*", schema: "public", table: "masterclass_quiz_attempts" }, handler)
      .subscribe();
  }

  return () => {
    window.removeEventListener(MASTERCLASS_EXPERIENCE_EVENT, handler);
    if (channel) {
      void supabase.removeChannel(channel);
    }
  };
};

export const randomId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};
