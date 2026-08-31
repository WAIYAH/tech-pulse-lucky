import { webinars as defaultWebinars, type WebinarRecord } from "@/data/webinars";

const STORAGE_KEY = "admin_webinars_v1";
const UPDATE_EVENT = "admin-webinars-updated";
const EAT_OFFSET = "+03:00";
const isBrowser = typeof window !== "undefined";

const cloneWebinar = (webinar: WebinarRecord): WebinarRecord => ({
  ...webinar,
  spots: {
    total: Number(webinar.spots?.total ?? 0),
    available: Number(webinar.spots?.available ?? 0),
  },
  topics: Array.isArray(webinar.topics) ? [...webinar.topics] : [],
  paymentMethods: Array.isArray(webinar.paymentMethods)
    ? [...webinar.paymentMethods]
    : undefined,
});

const cloneCatalog = (catalog: WebinarRecord[]): WebinarRecord[] =>
  catalog.map((webinar) => cloneWebinar(webinar));

const sortByStartTime = (catalog: WebinarRecord[]): WebinarRecord[] => {
  return [...catalog].sort((a, b) => {
    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  });
};

const seedCatalog = (): WebinarRecord[] => {
  const seed = sortByStartTime(cloneCatalog(defaultWebinars));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
};

const readStorage = (): WebinarRecord[] | null => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return seedCatalog();
    }
    return sortByStartTime(cloneCatalog(parsed as WebinarRecord[]));
  } catch {
    return seedCatalog();
  }
};

export const readAdminWebinars = (): WebinarRecord[] => {
  if (!isBrowser) {
    return sortByStartTime(cloneCatalog(defaultWebinars));
  }

  const stored = readStorage();
  if (stored === null) {
    return seedCatalog();
  }
  return stored;
};

export const saveAdminWebinars = (catalog: WebinarRecord[]): WebinarRecord[] => {
  const next = sortByStartTime(cloneCatalog(catalog));
  if (isBrowser) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  }
  return next;
};

export const subscribeAdminWebinars = (onChange: () => void): (() => void) => {
  if (!isBrowser) return () => undefined;

  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener(UPDATE_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(UPDATE_EVENT, handler);
  };
};

export const toWebinarSlug = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const toDateTimeLocalValue = (startsAt: string): string => {
  if (startsAt.length >= 16) {
    return startsAt.slice(0, 16);
  }
  return startsAt;
};

export const toStartsAtValue = (value: string): string => {
  if (!value) return "";
  if (value.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(value)) {
    return value;
  }
  if (value.length === 16) {
    return `${value}:00${EAT_OFFSET}`;
  }
  if (value.length === 19) {
    return `${value}${EAT_OFFSET}`;
  }
  return value;
};

export const formatWebinarDate = (startsAt: string): string => {
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(date);
};

export const formatWebinarTime = (startsAt: string): string => {
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return "";
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Nairobi",
  }).format(date);
  return `${time} EAT`;
};
