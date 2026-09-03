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
import { readFile } from "node:fs/promises";
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
  doc: ["doc", "application/msword"],
  docx: ["doc", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
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

const typeOf = (fileName) => {
  const extension = path.extname(fileName).slice(1).toLowerCase();
  const entry = EXTENSION_TYPES[extension];
  if (!entry) return { error: `.${extension} is not an accepted resource format.` };
  return { resourceType: entry[0], mimeType: entry[1] };
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

  // Validate everything before writing anything, so a bad entry cannot leave
  // the library half-synced.
  const planned = [];
  for (const entry of entries) {
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
      storagePath: storageKey(programSlug, location.weekNumber, location.category, location.fileName, bytes),
    });
  }

  if (DRY_RUN) {
    for (const item of planned) {
      log(
        "PLAN",
        `week ${String(item.weekNumber).padStart(2, "0")} / ${item.category.padEnd(12)} ` +
          `${(item.bytes.length / 1024).toFixed(0).padStart(5)} KB  ${item.title}`,
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
