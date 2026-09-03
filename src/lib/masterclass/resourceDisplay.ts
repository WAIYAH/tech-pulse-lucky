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

/** A stored file is served from storage; everything else follows its URL. */
export const isStoredFile = (resource: MasterclassResource): boolean => Boolean(resource.storagePath);

export const resourceCountLabel = (count: number, singular: string): string =>
  `${count} ${count === 1 ? singular : `${singular}s`}`;
