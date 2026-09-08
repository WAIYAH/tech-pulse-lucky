import type {
  MasterclassResource,
  MasterclassResourceCategory,
  MasterclassResourceType,
} from "@/types/masterclass";

/**
 * Presentation vocabulary for the resource library, shared by the admin manager
 * and the student view so both always describe a resource the same way.
 */

/** The order categories appear in - it follows the weekly learning journey. */
export const RESOURCE_CATEGORY_ORDER: MasterclassResourceCategory[] = [
  "notes",
  "presentation",
  "practical",
  "assignment",
  "quiz",
  "project",
  "template",
  "recording",
  "reference",
  "link",
];

export const RESOURCE_CATEGORY_LABELS: Record<MasterclassResourceCategory, string> = {
  notes: "Lecture Notes",
  presentation: "Presentations",
  practical: "Practical Exercises",
  assignment: "Assignments",
  quiz: "Quizzes",
  project: "Project Resources",
  template: "Templates & Starters",
  recording: "Recordings",
  reference: "Reference Material",
  link: "Links & Live Sessions",
};

export const RESOURCE_CATEGORY_HINTS: Record<MasterclassResourceCategory, string> = {
  notes: "Read these first - they carry the week's core teaching.",
  presentation: "Slides from the live sessions.",
  practical: "Step-by-step exercises to work through yourself.",
  assignment: "Briefs and rubrics for work you submit.",
  quiz: "Practice questions and revision checks.",
  project: "Files you need for the capstone or weekly project.",
  template: "Starter files and boilerplate to build on.",
  recording: "Session recordings and video walkthroughs.",
  reference: "Cheat sheets, glossaries and deeper background.",
  link: "External links, including the live class link.",
};

export const RESOURCE_TYPE_LABELS: Record<MasterclassResourceType, string> = {
  pdf: "PDF",
  doc: "Word",
  ppt: "Slides",
  sheet: "Spreadsheet",
  image: "Image",
  zip: "Archive",
  code: "Code",
  audio: "Audio",
  link: "Link",
  github: "GitHub",
  video: "Video",
};

export interface ResourceGroup {
  category: MasterclassResourceCategory;
  label: string;
  hint: string;
  resources: MasterclassResource[];
}

/**
 * Group resources into the categories that actually have content, in journey
 * order. Empty categories are dropped rather than rendered as empty headings.
 */
export const groupResourcesByCategory = (resources: MasterclassResource[]): ResourceGroup[] => {
  const buckets = new Map<MasterclassResourceCategory, MasterclassResource[]>();

  for (const resource of resources) {
    const category = resource.category ?? "reference";
    const bucket = buckets.get(category);
    if (bucket) {
      bucket.push(resource);
    } else {
      buckets.set(category, [resource]);
    }
  }

  return RESOURCE_CATEGORY_ORDER.filter((category) => buckets.has(category)).map((category) => ({
    category,
    label: RESOURCE_CATEGORY_LABELS[category],
    hint: RESOURCE_CATEGORY_HINTS[category],
    resources: (buckets.get(category) ?? []).sort((a, b) => a.resourceOrder - b.resourceOrder),
  }));
};

/**
 * Students are never shown a Word document.
 *
 * Word is the format the course material is written in, not the format it is
 * delivered in: every guide in active-word-notes/ is exported to a PDF by
 * tools/docx-to-pdf.ps1, and the PDF is what reaches the library. A PDF renders
 * identically for every student, opens in the in-app viewer instead of forcing a
 * download into whatever word processor they happen to have, and cannot be
 * edited into a version that disagrees with the one being taught.
 *
 * This is deliberately unconditional. An earlier version hid a Word file only
 * when the same document also existed as a PDF, which meant a missing export
 * silently put a .docx in front of students. The pipeline now guarantees the PDF
 * exists - `npm run resources:check` fails on a Word entry - so the display rule
 * no longer needs to make exceptions, and a Word file that somehow reaches the
 * catalogue is a mistake to hide rather than a fallback to serve.
 *
 * Admins still see every format in the resource panel; this filters the student
 * view only.
 */
const STUDENT_HIDDEN_TYPES: ReadonlySet<MasterclassResourceType> = new Set(["doc"]);

export const hideEditableDocuments = (
  resources: MasterclassResource[],
): MasterclassResource[] =>
  resources.filter((resource) => !STUDENT_HIDDEN_TYPES.has(resource.resourceType));

/**
 * True when a published resource still will not reach students because of its
 * format. The admin panel says so on the row, so uploading a Word file cannot
 * look like it worked while the student library stays empty.
 */
export const isHiddenFromStudentsByFormat = (resource: MasterclassResource): boolean =>
  STUDENT_HIDDEN_TYPES.has(resource.resourceType);

/** A stored file is served from storage; everything else follows its URL. */
export const isStoredFile = (resource: MasterclassResource): boolean => Boolean(resource.storagePath);

export const resourceCountLabel = (count: number, singular: string): string =>
  `${count} ${count === 1 ? singular : `${singular}s`}`;
