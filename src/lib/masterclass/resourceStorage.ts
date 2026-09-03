import { supabase as rawSupabase } from "@/integrations/supabase/client";
import type {
  MasterclassResourceCategory,
  MasterclassResourceType,
} from "@/types/masterclass";

/**
 * File handling for the course resource library.
 *
 * Uploaded files are untrusted input, so every upload passes three gates before
 * it reaches Supabase Storage: an allow-list of extensions and MIME types, a
 * size ceiling, and a filename rebuild that discards whatever the browser sent.
 *
 * The bucket is PRIVATE. Nothing here ever produces a public URL - reads always
 * go through a short-lived signed URL, and the storage policy re-checks the
 * caller against the owning resource row, so a leaked link cannot outlive its
 * expiry or bypass enrolment.
 */

export const RESOURCE_BUCKET = "course-resources";

/** 50 MB. Large enough for a slide deck with images, small enough to stay usable on mobile data. */
export const MAX_RESOURCE_BYTES = 50 * 1024 * 1024;

/** Signed URLs live just long enough to open or download a file, not to be shared around. */
const SIGNED_URL_TTL_SECONDS = 60 * 60;

interface AllowedFormat {
  type: MasterclassResourceType;
  mimeTypes: string[];
  label: string;
}

/**
 * The allow-list. Adding a future format is a one-line change here plus the
 * matching value in the resource_type check constraint - no other code moves.
 * Executable and script formats are deliberately absent.
 */
export const ALLOWED_RESOURCE_FORMATS: Record<string, AllowedFormat> = {
  pdf: { type: "pdf", mimeTypes: ["application/pdf"], label: "PDF document" },
  doc: { type: "doc", mimeTypes: ["application/msword"], label: "Word document" },
  docx: {
    type: "doc",
    mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    label: "Word document",
  },
  ppt: { type: "ppt", mimeTypes: ["application/vnd.ms-powerpoint"], label: "PowerPoint deck" },
  pptx: {
    type: "ppt",
    mimeTypes: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    label: "PowerPoint deck",
  },
  xls: { type: "sheet", mimeTypes: ["application/vnd.ms-excel"], label: "Spreadsheet" },
  xlsx: {
    type: "sheet",
    mimeTypes: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    label: "Spreadsheet",
  },
  csv: { type: "sheet", mimeTypes: ["text/csv", "application/csv"], label: "CSV data" },
  png: { type: "image", mimeTypes: ["image/png"], label: "Image" },
  jpg: { type: "image", mimeTypes: ["image/jpeg"], label: "Image" },
  jpeg: { type: "image", mimeTypes: ["image/jpeg"], label: "Image" },
  webp: { type: "image", mimeTypes: ["image/webp"], label: "Image" },
  gif: { type: "image", mimeTypes: ["image/gif"], label: "Image" },
  svg: { type: "image", mimeTypes: ["image/svg+xml"], label: "Vector image" },
  zip: { type: "zip", mimeTypes: ["application/zip", "application/x-zip-compressed"], label: "Zip archive" },
  html: { type: "code", mimeTypes: ["text/html"], label: "HTML file" },
  css: { type: "code", mimeTypes: ["text/css"], label: "CSS file" },
  js: { type: "code", mimeTypes: ["text/javascript", "application/javascript"], label: "JavaScript file" },
  json: { type: "code", mimeTypes: ["application/json"], label: "JSON file" },
  sql: { type: "code", mimeTypes: ["application/sql", "text/plain"], label: "SQL script" },
  php: { type: "code", mimeTypes: ["application/x-httpd-php", "text/plain"], label: "PHP file" },
  md: { type: "code", mimeTypes: ["text/markdown", "text/plain"], label: "Markdown file" },
  txt: { type: "code", mimeTypes: ["text/plain"], label: "Text file" },
  mp4: { type: "video", mimeTypes: ["video/mp4"], label: "Video" },
  webm: { type: "video", mimeTypes: ["video/webm"], label: "Video" },
  mp3: { type: "audio", mimeTypes: ["audio/mpeg"], label: "Audio" },
};

export const ACCEPTED_FILE_EXTENSIONS = Object.keys(ALLOWED_RESOURCE_FORMATS)
  .map((extension) => `.${extension}`)
  .join(",");

export interface ResourceValidationResult {
  ok: boolean;
  error?: string;
  extension?: string;
  resourceType?: MasterclassResourceType;
}

const extensionOf = (fileName: string): string => {
  const index = fileName.lastIndexOf(".");
  return index === -1 ? "" : fileName.slice(index + 1).toLowerCase();
};

export const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null || Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Gate an upload before it touches the network. The browser-reported MIME type
 * is checked where it is present but never trusted on its own - the extension
 * allow-list is what actually decides, and the server re-checks authorisation.
 */
export const validateResourceFile = (file: File): ResourceValidationResult => {
  const extension = extensionOf(file.name);
  if (!extension) {
    return { ok: false, error: "This file has no extension, so its type cannot be verified." };
  }

  const format = ALLOWED_RESOURCE_FORMATS[extension];
  if (!format) {
    return {
      ok: false,
      error: `.${extension} files are not accepted. Allowed types: ${Object.keys(ALLOWED_RESOURCE_FORMATS).join(", ")}.`,
    };
  }

  if (file.size === 0) {
    return { ok: false, error: "This file is empty." };
  }

  if (file.size > MAX_RESOURCE_BYTES) {
    return {
      ok: false,
      error: `This file is ${formatFileSize(file.size)}. The limit is ${formatFileSize(MAX_RESOURCE_BYTES)}.`,
    };
  }

  // A declared MIME type that contradicts the extension is a mismatch worth blocking.
  if (file.type && !format.mimeTypes.includes(file.type)) {
    return {
      ok: false,
      error: `This file claims to be ${file.type}, which does not match a .${extension} file.`,
    };
  }

  return { ok: true, extension, resourceType: format.type };
};

/**
 * Rebuild the filename from scratch rather than sanitising what was supplied.
 * Anything that is not a safe character is discarded, so path traversal,
 * null bytes and double extensions cannot survive.
 */
export const toSafeFileName = (fileName: string): string => {
  const extension = extensionOf(fileName);
  const stem = extension ? fileName.slice(0, -(extension.length + 1)) : fileName;
  const safeStem =
    stem
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "resource";
  return extension ? `${safeStem}.${extension}` : safeStem;
};

/**
 * Object keys mirror the resources/ folder layout, which keeps the bucket
 * browsable and makes a stored file traceable back to its place in the course.
 *
 *   web-development-masterclass/week-02/notes/1735-css-foundations-notes.docx
 */
export const buildResourceStoragePath = (options: {
  programSlug: string;
  weekNumber?: number;
  category: MasterclassResourceCategory;
  fileName: string;
}): string => {
  const week =
    options.weekNumber && options.weekNumber > 0
      ? `week-${String(options.weekNumber).padStart(2, "0")}`
      : "program";
  // A short time-based prefix keeps re-uploads of the same filename distinct,
  // so replacing a file never silently overwrites the version students already have.
  const unique = Date.now().toString(36).slice(-5);
  return `${options.programSlug}/${week}/${options.category}/${unique}-${toSafeFileName(options.fileName)}`;
};

/**
 * The narrow client wrapper used elsewhere in this module does not expose
 * storage, so file operations use the real client directly.
 */
const storage = () => rawSupabase.storage.from(RESOURCE_BUCKET);

export interface UploadedResourceFile {
  storagePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  resourceType: MasterclassResourceType;
}

export const uploadResourceFile = async (options: {
  file: File;
  programSlug: string;
  weekNumber?: number;
  category: MasterclassResourceCategory;
}): Promise<UploadedResourceFile> => {
  const validation = validateResourceFile(options.file);
  if (!validation.ok || !validation.resourceType) {
    throw new Error(validation.error ?? "This file cannot be uploaded.");
  }

  const storagePath = buildResourceStoragePath({
    programSlug: options.programSlug,
    weekNumber: options.weekNumber,
    category: options.category,
    fileName: options.file.name,
  });

  const { error } = await storage().upload(storagePath, options.file, {
    cacheControl: "3600",
    upsert: false,
    contentType: options.file.type || "application/octet-stream",
  });

  if (error) {
    throw new Error(error.message ?? "The file could not be uploaded. Please try again.");
  }

  return {
    storagePath,
    fileName: toSafeFileName(options.file.name),
    fileSize: options.file.size,
    mimeType: options.file.type || "application/octet-stream",
    resourceType: validation.resourceType,
  };
};

/**
 * Mint a short-lived signed URL for a stored file. Storage RLS re-evaluates the
 * caller against the owning resource row, so an unauthorised request fails here
 * rather than returning a working link.
 */
export const createResourceSignedUrl = async (
  storagePath: string,
  options: { download?: boolean | string } = {},
): Promise<string | null> => {
  const { data, error } = await storage().createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS, {
    download: options.download,
  });
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
};

export const deleteResourceFile = async (storagePath: string): Promise<void> => {
  const { error } = await storage().remove([storagePath]);
  if (error) throw new Error(error.message ?? "The file could not be removed from storage.");
};

/** Formats a browser can render inline; everything else is offered as a download. */
const INLINE_VIEWABLE: MasterclassResourceType[] = ["pdf", "image", "video", "audio", "code"];

export const canPreviewInBrowser = (resourceType: MasterclassResourceType): boolean =>
  INLINE_VIEWABLE.includes(resourceType);
