#!/usr/bin/env node
/**
 * Sync the resources/ folder into Supabase Storage and masterclass_resources.
 *
 * The folder layout is the source of truth for week and category:
 *
 *     resources/week-02/notes/week-02-css-foundations.pdf
 *               ^^^^^^^ ^^^^^
 *               week 2  category "notes"
 *
 * and resources/manifest.json supplies the teaching metadata for each file.
 *
 * resources/ is the published tree: it holds only what students may receive, and
 * it is generated, not edited. Word sources live in active-word-notes/ and reach
 * this tree as PDFs via tools/docx-to-pdf.ps1 - listing a .docx here is an error.
 *
 * Usage
 * -----
 *   node tools/sync-resources.mjs --dry-run     show what would change
 *   node tools/sync-resources.mjs               upload and upsert
 *   node tools/sync-resources.mjs --prune       also unpublish rows whose file is gone
 *
 * Requires a service-role key, because uploading to the private bucket and
 * writing catalogue rows are both admin-only operations under RLS:
 *
 *   VITE_SUPABASE_URL=...            (or SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY=...
 *
 * The service-role key bypasses RLS entirely. Keep it out of the repository and
 * out of anything that ships to a browser - this script runs on your machine only.
 */

import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RESOURCES_DIR = path.join(REPO_ROOT, "resources");
const MANIFEST = path.join(RESOURCES_DIR, "manifest.json");
const BUCKET = "course-resources";

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const PRUNE = args.has("--prune");

// ---------------------------------------------------------------- file types

const EXTENSION_TYPES = {
  pdf: ["pdf", "application/pdf"],
  ppt: ["ppt", "application/vnd.ms-powerpoint"],
  pptx: ["ppt", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  xls: ["sheet", "application/vnd.ms-excel"],
  xlsx: ["sheet", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  csv: ["sheet", "text/csv"],
  png: ["image", "image/png"],
  jpg: ["image", "image/jpeg"],
  jpeg: ["image", "image/jpeg"],
  webp: ["image", "image/webp"],
  gif: ["image", "image/gif"],
  svg: ["image", "image/svg+xml"],
  zip: ["zip", "application/zip"],
  html: ["code", "text/html"],
  css: ["code", "text/css"],
  js: ["code", "text/javascript"],
  json: ["code", "application/json"],
  sql: ["code", "application/sql"],
  php: ["code", "application/x-httpd-php"],
  md: ["code", "text/markdown"],
  txt: ["code", "text/plain"],
  mp4: ["video", "video/mp4"],
  webm: ["video", "video/webm"],
  mp3: ["audio", "audio/mpeg"],
};

const VALID_CATEGORIES = new Set([
  "notes",
  "presentations",
  "practicals",
  "assignments",
  "quizzes",
  "references",
]);

/** Folder names are plural for readability; the database column is singular. */
const CATEGORY_FROM_FOLDER = {
  notes: "notes",
  presentations: "presentation",
  practicals: "practical",
  assignments: "assignment",
  quizzes: "quiz",
  references: "reference",
};

/** Every category the table accepts, including the ones with no folder. */
const ALL_CATEGORIES = new Set([
  ...Object.values(CATEGORY_FROM_FOLDER),
  "project",
  "template",
  "recording",
  "link",
]);

// ------------------------------------------------------------------- helpers

const fail = (message) => {
  console.error(`\n  ERROR  ${message}\n`);
  process.exit(1);
};

const log = (symbol, message) => console.log(`  ${symbol}  ${message}`);

/**
 * Derive week number and category from the file's own location, so a file can
 * never disagree with where it is filed.
 */
const parseLocation = (relativePath) => {
  const [weekFolder, categoryFolder, ...rest] = relativePath.split("/");

  const weekMatch = /^week-(\d{2})$/.exec(weekFolder ?? "");
  if (!weekMatch) {
    return { error: `"${relativePath}" is not inside a week-NN folder.` };
  }
  if (!VALID_CATEGORIES.has(categoryFolder ?? "")) {
    return {
      error: `"${relativePath}" is not inside a known category folder (${[...VALID_CATEGORIES].join(", ")}).`,
    };
  }
  if (rest.length !== 1) {
    return { error: `"${relativePath}" must sit directly inside its category folder.` };
  }

  return {
    weekNumber: Number(weekMatch[1]),
    category: CATEGORY_FROM_FOLDER[categoryFolder],
    fileName: rest[0],
  };
};

/**
 * Word is an editing format, not a delivery format. Students get PDFs, which
 * open in the in-app viewer on any device and cannot be half-rendered by
 * whatever word processor the student happens to have. The .docx sources live
 * in active-word-notes/ and are converted by tools/docx-to-pdf.ps1, so a Word
 * file reaching this point means a step was skipped rather than a format choice
 * being made - hence a hard error rather than an upload.
 */
const EDITING_ONLY_EXTENSIONS = new Set(["doc", "docx", "rtf", "odt", "pages"]);

const typeOf = (fileName) => {
  const extension = path.extname(fileName).slice(1).toLowerCase();

  if (EDITING_ONLY_EXTENSIONS.has(extension)) {
    return {
      error:
        `.${extension} is an editing format and is never published to students.\n` +
        `         Keep the source in active-word-notes/, run\n` +
        `           pwsh -File tools/docx-to-pdf.ps1\n` +
        `         and list the exported .pdf here instead.`,
    };
  }

  const entry = EXTENSION_TYPES[extension];
  if (!entry) return { error: `.${extension} is not an accepted resource format.` };
  return { resourceType: entry[0], mimeType: entry[1] };
};

/**
 * The manifest decides what is uploaded, so a stray Word file in resources/ is
 * harmless in itself - but it means someone edited the published tree by hand
 * and their next edit will be lost the next time the PDF is exported. Say so
 * while it is still cheap to fix.
 */
const warnAboutStrayEditingFiles = async () => {
  const strays = [];

  const walk = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (EDITING_ONLY_EXTENSIONS.has(path.extname(entry.name).slice(1).toLowerCase())) {
        strays.push(path.relative(RESOURCES_DIR, full).split(path.sep).join("/"));
      }
    }
  };

  await walk(RESOURCES_DIR);

  if (strays.length > 0) {
    console.log(
      `\n  WARN  resources/ is the published tree and should hold no editable sources.\n` +
        strays.map((stray) => `          ${stray}\n`).join("") +
        `        Move them to active-word-notes/ and export with tools/docx-to-pdf.ps1.\n`,
    );
  }
};

/**
 * Not every resource is a file. A live class link has nothing to upload, so it
 * carries its week and category in the manifest entry rather than inheriting
 * them from a folder it does not sit in.
 */
const LINK_TYPES = new Set(["link", "github", "video"]);

const parseLinkEntry = (entry) => {
  if (!Number.isInteger(entry.week) || entry.week < 1) {
    return { error: `"${entry.title}" is a link, so it needs a "week" number.` };
  }

  let parsed;
  try {
    parsed = new URL(entry.url);
  } catch {
    return { error: `"${entry.title}" has a url that is not a valid URL: ${entry.url}` };
  }
  if (parsed.protocol !== "https:") {
    return { error: `"${entry.title}" must use https, not ${parsed.protocol}` };
  }

  const resourceType = entry.type ?? "link";
  if (!LINK_TYPES.has(resourceType)) {
    return { error: `"${entry.title}" has type "${resourceType}"; use one of ${[...LINK_TYPES].join(", ")}.` };
  }

  const category = entry.category ?? "link";
  if (!ALL_CATEGORIES.has(category)) {
    return { error: `"${entry.title}" has category "${category}", which is not a known category.` };
  }

  return { weekNumber: entry.week, category, resourceType };
};

/**
 * A content hash keeps the object key stable across runs, so re-syncing an
 * unchanged file is a no-op and a changed file gets a genuinely new key rather
 * than silently overwriting what students already hold links to.
 */
const storageKey = (programSlug, weekNumber, category, fileName, bytes) => {
  const digest = createHash("sha256").update(bytes).digest("hex").slice(0, 8);
  const week = `week-${String(weekNumber).padStart(2, "0")}`;
  return `${programSlug}/${week}/${category}/${digest}-${fileName}`;
};

/**
 * Write a link row.
 *
 * Files upsert on storage_path, but a link has none, and a null never conflicts
 * in Postgres - upserting one would insert a fresh duplicate on every run. So a
 * link is matched to its existing row first and updated in place.
 *
 * A live link is matched on the week rather than on the title, because the
 * database allows only one per week: when the meeting link changes, or the
 * session is renamed, the intent is to replace that week's live link rather
 * than to add a second one that the unique index would reject anyway.
 */
const syncLink = async (supabase, programId, weekId, item) => {
  const row = {
    program_id: programId,
    week_id: weekId,
    title: item.title,
    description: item.description ?? "",
    learning_objective: item.objective ?? "",
    category: item.category,
    resource_type: item.resourceType,
    url: item.url,
    storage_path: null,
    file_name: null,
    file_size: null,
    mime_type: null,
    visibility: item.visibility ?? "enrolled",
    resource_order: item.order ?? 1,
    is_required: item.required ?? false,
    is_published: item.published ?? true,
    is_live_link: item.liveLink ?? false,
    version: 1,
  };

  const query = supabase.from("masterclass_resources").select("id").eq("week_id", weekId);
  const { data: existing, error: findError } = item.liveLink
    ? await query.eq("is_live_link", true).maybeSingle()
    : await query.eq("title", item.title).eq("version", 1).maybeSingle();

  if (findError) fail(`Looking up "${item.title}": ${findError.message}`);

  const { error: writeError } = existing
    ? await supabase.from("masterclass_resources").update(row).eq("id", existing.id)
    : await supabase.from("masterclass_resources").insert(row);

  if (writeError) fail(`Saving "${item.title}": ${writeError.message}`);
};

// ---------------------------------------------------------------------- main

const main = async () => {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // A dry run only validates the manifest against the files on disk, so it
  // deliberately needs no credentials and no network.
  if (!DRY_RUN) {
    if (!url) fail("Set VITE_SUPABASE_URL (or SUPABASE_URL) before running this script.");
    if (!serviceKey) {
      fail(
        "Set SUPABASE_SERVICE_ROLE_KEY before running this script.\n" +
          "         Find it in the Supabase dashboard under Project Settings > API.\n" +
          "         Run with --dry-run to validate without it.",
      );
    }
  }

  const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
  const programSlug = manifest.programSlug;
  const entries = manifest.resources ?? [];

  console.log(`\nSyncing ${entries.length} resource(s) for "${programSlug}"`);
  console.log(DRY_RUN ? "Mode: DRY RUN - nothing will be written\n" : "Mode: LIVE\n");

  await warnAboutStrayEditingFiles();

  // Validate everything before writing anything, so a bad entry cannot leave
  // the library half-synced.
  const planned = [];
  for (const entry of entries) {
    if (entry.url) {
      const link = parseLinkEntry(entry);
      if (link.error) fail(link.error);
      planned.push({ ...entry, ...link, isLink: true });
      continue;
    }

    const location = parseLocation(entry.file);
    if (location.error) fail(location.error);

    const kind = typeOf(location.fileName);
    if (kind.error) fail(`${entry.file}: ${kind.error}`);

    let bytes;
    try {
      bytes = await readFile(path.join(RESOURCES_DIR, entry.file));
    } catch {
      fail(`${entry.file} is listed in the manifest but does not exist on disk.`);
    }

    planned.push({
      ...entry,
      ...location,
      ...kind,
      bytes,
      isLink: false,
      storagePath: storageKey(programSlug, location.weekNumber, location.category, location.fileName, bytes),
    });
  }

  // One live link per week is a database constraint, so catching a duplicate
  // here gives a readable error instead of a unique-violation from Postgres.
  const liveWeeks = new Set();
  for (const item of planned.filter((candidate) => candidate.liveLink)) {
    if (liveWeeks.has(item.weekNumber)) {
      fail(`Week ${item.weekNumber} has more than one live link in the manifest.`);
    }
    liveWeeks.add(item.weekNumber);
  }

  if (DRY_RUN) {
    for (const item of planned) {
      const extent = item.isLink
        ? `${item.liveLink ? "LIVE" : "link"}`.padStart(8)
        : `${(item.bytes.length / 1024).toFixed(0).padStart(5)} KB`;
      log(
        "PLAN",
        `week ${String(item.weekNumber).padStart(2, "0")} / ${item.category.padEnd(12)} ` +
          `${extent}  ${item.title}`,
      );
    }
    console.log(`\n  ${planned.length} resource(s) validated. Nothing was written.\n`);
    return;
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { data: program, error: programError } = await supabase
    .from("masterclass_programs")
    .select("id, slug")
    .eq("slug", programSlug)
    .maybeSingle();
  if (programError) fail(`Could not read the program: ${programError.message}`);
  if (!program) fail(`No masterclass program with slug "${programSlug}". Run the migrations first.`);

  const { data: weeks, error: weeksError } = await supabase
    .from("masterclass_weeks")
    .select("id, week_number")
    .eq("program_id", program.id);
  if (weeksError) fail(`Could not read weeks: ${weeksError.message}`);

  const weekIdByNumber = new Map((weeks ?? []).map((week) => [week.week_number, week.id]));

  let uploaded = 0;
  let skipped = 0;
  let upserted = 0;
  const seenPaths = new Set();

  for (const item of planned) {
    const weekId = weekIdByNumber.get(item.weekNumber);
    if (!weekId) fail(`No week ${item.weekNumber} exists for this program.`);

    if (item.isLink) {
      await syncLink(supabase, program.id, weekId, item);
      upserted += 1;
      log("OK", `week ${String(item.weekNumber).padStart(2, "0")} / ${item.category.padEnd(12)} ${item.title}`);
      continue;
    }

    seenPaths.add(item.storagePath);

    // Upload only when this exact content is not already stored.
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(item.storagePath, item.bytes, {
        contentType: item.mimeType,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      const alreadyThere =
        uploadError.message?.toLowerCase().includes("exists") || uploadError.statusCode === "409";
      if (!alreadyThere) fail(`Uploading ${item.file}: ${uploadError.message}`);
      skipped += 1;
    } else {
      uploaded += 1;
    }

    const row = {
      program_id: program.id,
      week_id: weekId,
      title: item.title,
      description: item.description ?? "",
      learning_objective: item.objective ?? "",
      category: item.category,
      resource_type: item.resourceType,
      url: "",
      storage_path: item.storagePath,
      file_name: item.fileName,
      file_size: item.bytes.length,
      mime_type: item.mimeType,
      visibility: item.visibility ?? "enrolled",
      resource_order: item.order ?? 1,
      is_required: item.required ?? false,
      is_published: item.published ?? true,
      is_live_link: false,
      version: 1,
    };

    // storage_path is unique, which makes it the natural conflict target: the
    // same file always lands on the same row rather than accumulating copies.
    const { error: upsertError } = await supabase
      .from("masterclass_resources")
      .upsert(row, { onConflict: "storage_path" });

    if (upsertError) fail(`Saving "${item.title}": ${upsertError.message}`);
    upserted += 1;

    log("OK", `week ${String(item.weekNumber).padStart(2, "0")} / ${item.category.padEnd(12)} ${item.title}`);
  }

  if (PRUNE) {
    const { data: existing, error: existingError } = await supabase
      .from("masterclass_resources")
      .select("id, title, storage_path, is_published")
      .eq("program_id", program.id)
      .not("storage_path", "is", null);
    if (existingError) fail(`Could not read existing resources: ${existingError.message}`);

    const orphans = (existing ?? []).filter(
      (row) => row.is_published && !seenPaths.has(row.storage_path),
    );

    for (const orphan of orphans) {
      // Unpublish rather than delete: a student may already have opened it, and
      // the row is the only record that it ever existed.
      const { error } = await supabase
        .from("masterclass_resources")
        .update({ is_published: false })
        .eq("id", orphan.id);
      if (error) fail(`Unpublishing "${orphan.title}": ${error.message}`);
      log("HIDE", `no longer in the manifest: ${orphan.title}`);
    }
  }

  console.log(
    `\n  Done. ${uploaded} file(s) uploaded, ${skipped} already stored, ${upserted} catalogue row(s) saved.\n`,
  );
};

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
