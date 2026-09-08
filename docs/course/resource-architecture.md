# Course Resource Architecture

How learning materials are stored, secured, published and reused in the Tech Pulse Insider LMS.

---

## 1. The hierarchy

```
masterclass_programs          Web Development Masterclass   (the reusable curriculum)
      |
      +-- masterclass_cohorts        2026 Cohort, 2027 Cohort, ...   (one per courses row)
      |
      +-- masterclass_weeks          Week 1 .. Week 8                (shared by every cohort)
              |
              +-- masterclass_lessons          taught content
              +-- masterclass_terminology      the week's vocabulary
              +-- masterclass_quizzes          -> masterclass_quiz_questions
              +-- masterclass_assignments      the weekly brief
              +-- masterclass_resources        the file library      <- this document
```

The split that matters: **curriculum hangs off the program, progress hangs off the cohort.**
Weeks, lessons, quizzes and resources are authored once and shared by every cohort that ever runs
the programme. Only per-student records — `masterclass_lesson_progress`, `masterclass_quiz_attempts`,
`masterclass_assignment_submissions`, `masterclass_final_projects` — carry a `cohort_id`.

Adding the 2027 cohort is therefore one row in `masterclass_cohorts` pointing at a new `courses`
row. The entire curriculum, including every resource, comes with it at no extra cost. Nothing needs
duplicating.

---

## 2. Where files live

Resources are stored in a **private** Supabase Storage bucket, `course-resources`. Object keys
mirror the folder layout in the repository:

```
course-resources/
  web-development-masterclass/
    week-01/notes/a3f9c21b-week-01-web-fundamentals-training-manual.pdf
    week-02/notes/7b2e4f19-week-02-css-foundations-responsive-design-notes.pdf
    week-04/practical/c81d0a42-week-04-single-page-application-build-guide.docx
```

The prefix is content-addressed (a short hash of the file, or a timestamp for browser uploads) so
that re-uploading a changed file produces a genuinely new key. Nothing is ever overwritten in place,
which means a link a student already holds cannot silently start pointing at different content.

The bucket is private. **No public URL is ever produced.** Every read is a signed URL valid for one
hour, minted at the moment the student clicks.

---

## 3. How access is decided

Storage access is derived from the catalogue row that owns the object, so the two can never drift
apart:

```sql
create policy course_resources_read on storage.objects for select using (
  bucket_id = 'course-resources'
  and (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.masterclass_resources r
      where r.storage_path = storage.objects.name
        and r.is_published
        and (r.visibility = 'public'
             or public.is_enrolled_in_masterclass_program(r.program_id))
    )
  )
);
```

A file is reachable exactly when its catalogue entry is. Unpublish the row and the file becomes
unreachable in the same instant, with no separate storage change to remember.

| Who | Sees |
|---|---|
| Admin | Everything, published or not |
| Enrolled student | Published resources for the programme they are enrolled in |
| Signed-in non-student | Published resources marked `public` only |
| Anonymous visitor | Published resources marked `public` only |

Enrolment is checked by `is_enrolled_in_masterclass_program()`, which requires an `enrollments` row
with `access_status` of `approved` or `free` — the same gate that governs lessons and quizzes.

Writes to the bucket are admin-only. Students never upload here; assignment submissions are GitHub
URLs on `masterclass_assignment_submissions`, not files.

---

## 4. The resource row

| Column | Purpose |
|---|---|
| `program_id` | Which curriculum it belongs to. Always set. |
| `week_id` | Which week. Null means programme-wide, such as the cohort WhatsApp link. |
| `category` | Where it sits in the journey: notes, presentation, practical, assignment, quiz, reference, project, template, recording, link. Drives the grouping students see. |
| `resource_type` | The format: pdf, doc, ppt, sheet, image, zip, code, audio, link, github, video. Drives the icon and the viewer. |
| `url` | External address. Empty for stored files. |
| `storage_path` | Object key in the bucket. Null for links. Unique. |
| `file_name`, `file_size`, `mime_type` | File metadata, shown to students before they download on mobile data. |
| `is_required` | Whether the week can be completed without it. |
| `is_published` | Hidden from students while you prepare it. |
| `learning_objective` | What a student should be able to do after using it. |
| `version`, `supersedes_id` | Content versioning — see below. |
| `resource_order` | Sort position within its category. |
| `visibility` | `enrolled` or `public`. |
| `is_live_link` | Marks the week's Zoom or Meet link. One per week, enforced by a partial unique index. |

A row must have either a `storage_path` or a non-empty `url` — enforced by
`masterclass_resources_source_check`, so a resource can never point at nothing.

---

## 5. Versioning

Updating a document does not overwrite it. Replacing a stored file:

1. uploads the new file under a new object key,
2. inserts a new row with `version = old + 1` and `supersedes_id` pointing at the old row,
3. sets `is_published = false` on the old row.

The old row and its file are retained. Student progress is unaffected in any case, because progress
is tracked against lessons, quizzes and assignments — never against resources — so re-issuing
material can never disturb a completion record or a quiz score.

---

## 6. Adding resources

### Option A — the admin interface (one file, right now)

`/admin/masterclass` → pick the week → **Resources**.

Choose *Upload a file* or *Add a link*, set the title, category, visibility, required and published
flags, and save. Uploading a file when editing an existing one publishes a new version.

The interface validates before anything is sent: extension against an allow-list, size against a
50 MB ceiling, and the declared MIME type against the extension. Filenames are rebuilt from scratch
rather than sanitised, so path traversal and double extensions cannot survive.

### Option B — the repository and sync script (bulk, reproducible)

Two trees hold course material, and material only ever moves one way between them:

```
active-word-notes/          the editing tree - Word sources, never uploaded
  week-01/{notes,presentations,practicals,assignments,quizzes,references}/
  ...
  week-08/...

resources/                  the published tree - generated, never hand-edited
  manifest.json
  week-01/{notes,presentations,practicals,assignments,quizzes,references}/
  ...
  week-08/...
```

Both trees use the same week and category folders, and `tools/docx-to-pdf.ps1` mirrors a document
from one to the other as it exports. The folder a file sits in **decides** its week and category —
a file cannot disagree with where it is filed. `resources/manifest.json` supplies the teaching
metadata.

To add "Week 4 JavaScript notes":

1. Put the `.docx` in `active-word-notes/week-04/notes/`.
2. `npm run resources:pdf` — exports it to `resources/week-04/notes/` as a PDF.
3. Add an entry to `manifest.json` for the **PDF**, with title, description, objective, required
   and order.
4. `npm run resources:check` — validates the manifest against the files, no credentials needed.
5. `npm run resources:sync` — uploads and upserts.

A file with no Word source — a slide deck, an image, a code sample — skips steps 1 and 2 and goes
straight into `resources/week-NN/<category>/`.

### Links, and the weekly live class

A resource can be a link instead of a file. A link has no folder to be filed in, so its manifest
entry states its own `week` and `category`:

```json
{
  "url": "https://meet.google.com/xxx-xxxx-xxx",
  "week": 1,
  "category": "link",
  "liveLink": true,
  "title": "Week 1 Live Class - Get Techy With Lucky",
  "description": "Tuesday 8 September, 7:30-9:30pm UTC on Google Meet.",
  "required": false,
  "order": 1
}
```

`liveLink: true` marks it as **the** live class for that week. Students see it as the *Join Live
Class* button at the top of the week rather than as another row in the resource list, and the
database allows only one per week.

Links are written differently from files: files upsert on `storage_path`, but a link has none, and
a null never conflicts in Postgres — upserting one would insert a fresh duplicate on every sync. So
a link is matched to its existing row and updated in place, and a live link is matched **on the
week** rather than on the title. Changing the meeting URL or renaming the session therefore replaces
that week's link instead of adding a second one.

### Why students never receive a Word file

Word is how the material is written; PDF is how it is delivered. A PDF paginates identically for
every student, renders in the in-app viewer rather than downloading into whatever word processor
they happen to have, and cannot quietly become a different document from the one being taught.

The rule holds in three independent places, so no single mistake can put a `.docx` in front of a
student:

| Where | What it does |
| --- | --- |
| `hideEditableDocuments` in `resourceDisplay.ts` | Filters Word out of the student view unconditionally — not only when a PDF also exists. |
| `tools/sync-resources.mjs` | Fails the check if a Word file is listed in the manifest, and warns about any Word file sitting in `resources/`. |
| Admin resource panel | Badges any Word resource *Not shown to students*, so an upload cannot look like it worked while the student library stays empty. |

Admins still see and manage every format; only the student view is filtered.

The sync is idempotent: re-running it re-uploads nothing and leaves rows unchanged. `--prune`
additionally unpublishes rows whose file has left the manifest, rather than deleting them.

The sync needs a service-role key, because uploading to a private bucket and writing catalogue rows
are both admin operations:

```bash
export VITE_SUPABASE_URL="https://<project>.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
npm run resources:sync
```

The service-role key bypasses RLS entirely. It belongs in your shell, never in `.env`, never in the
repository, and never in anything that reaches a browser.

---

## 7. Generating learning documents

Weekly Word documents are generated from source, not hand-formatted, so the house style stays
identical across every document and a correction is one command away.

```bash
python -m tools.docgen.generate              # every document, .docx only
python -m tools.docgen.generate --only week02
npm run resources:generate                   # every document, with PDF export
npm run resources:pdf                        # export existing Word notes, no regeneration
```

```
tools/docgen/
  brand.py       colours, fonts, the type scale, the identity strings
  builder.py     TechPulseDocument: cover, header, footer, watermark, chapters,
                 terminology tables, code blocks, callouts, quizzes, assignments
  content/       one module per document - what it says, not how it looks
  generate.py    the CLI
```

Documents are written into `active-word-notes/week-NN/notes/` — the editing tree — and reach
`resources/` only as PDFs. `--pdf` delegates that step to `tools/docx-to-pdf.ps1` rather than
converting on its own, so there is exactly one place that decides how a document becomes a PDF.

That export drives the installed Microsoft Word through COM, because these documents rely on Word
features a generic renderer drops: the branded header, the `Page X of Y` footer fields and the table
of contents. Fields are refreshed before export, so the page numbers in the PDF's contents describe
the PDF. It needs Word on Windows; the `.docx` files themselves generate anywhere.

### The document standard

Encoded in `brand.py` and `builder.py`, so it is applied rather than remembered:

- **Header** on every page but the cover: `GET TECHY WITH LUCKY | TECH PULSE INSIDER` over
  `WEB DEVELOPMENT MASTERCLASS - WEEK NN: <title>`, under a hairline rule.
- **Footer**: `Tech Pulse Insider | Get Techy With Lucky` left, `Page X of Y` right as live Word
  fields, `Learn • Build • Connect • Grow` centred beneath.
- **Watermark**: `TECH PULSE INSIDER` at 315°, in `#F1F4FA` — present but never competing with the
  text.
- **Typography**: Arial throughout. Cover title 30pt, chapter 19pt, section 15pt, subsection 12.5pt,
  body 11pt, captions 9.5pt, code 9.5pt Consolas.
- **Colour**: brand blue `#003F9E`, lighter blue `#005CE6`, gold `#B88A00` at text weight — matching
  the LMS tokens in `src/index.css`.
- **Page**: A4, 2.2 cm margins, no header or footer on the cover.

---

## 8. How students reach a resource

`/dashboard/masterclass/week/:n/live` shows the week's live-session link followed by every published
resource, grouped by category in journey order — notes first, reference last — with a count of what
is required.

**View** opens the resource viewer, which renders in place wherever the browser can:

| Format | Behaviour |
|---|---|
| PDF | Inline in an iframe |
| Image | Inline |
| Video, audio | Inline player |
| Code, text | Inline, monospaced |
| Word, PowerPoint, spreadsheet, archive | Explains it opens in its own application, offers download |
| Link, GitHub | Shows the destination, opens in a new tab |

**Download** mints a separate signed URL carrying a `download` disposition, so the file saves under
its clean name instead of a storage key.

Signed URLs are minted per click and never held in the page, so a link cannot go stale while a
student reads, and nothing durable is exposed in the DOM.

---

## 9. Adding a future resource type

The design point is that this is a small, bounded change:

1. Add the extension to `ALLOWED_RESOURCE_FORMATS` in `src/lib/masterclass/resourceStorage.ts`.
2. If it needs a new `resource_type`, add it to the check constraint, the TypeScript union, the
   icon map in `ResourceIcon.tsx`, and the label map in `resourceDisplay.ts`.
3. If it can render inline, add it to `INLINE_VIEWABLE` and give the viewer a branch.

No schema redesign, no change to storage, no change to access control. Adding a new **category** is
one value in the check constraint plus a label and a hint.

---

## 10. Security summary

| Control | Where |
|---|---|
| Private bucket, no public URLs | `storage.buckets.public = false` |
| Read access derived from the catalogue row | `course_resources_read` policy |
| Admin-only writes | `course_resources_admin_*` policies |
| Unpublished resources invisible to students | `masterclass_resources_select_by_visibility` |
| Extension allow-list, no executables | `ALLOWED_RESOURCE_FORMATS` |
| 50 MB size ceiling | `MAX_RESOURCE_BYTES` |
| MIME type checked against extension | `validateResourceFile()` |
| Filenames rebuilt, not sanitised | `toSafeFileName()` |
| Signed URLs expire after one hour | `createResourceSignedUrl()` |
| Orphaned files removed on delete | `deleteMasterclassResource()` |

Uploaded files are treated as untrusted throughout. Nothing is executed, nothing is served from an
origin that could run it, and the extension allow-list has no scriptable server-side formats in it.
