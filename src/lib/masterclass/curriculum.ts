import { emitMasterclassExperienceEvent, supabase, withMasterclassFallback } from "./client";
import { deleteResourceFile } from "./resourceStorage";
import { masterclassProgram, masterclassWeeks } from "@/data/masterclassContent";
import type {
  MasterclassLesson,
  MasterclassProgram,
  MasterclassResource,
  MasterclassTerm,
  MasterclassWeek,
} from "@/types/masterclass";

interface ProgramRow extends Record<string, unknown> {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  philosophy: string;
  technologies: string[];
  total_weeks: number;
  created_at: string;
  updated_at: string;
}

interface WeekRow extends Record<string, unknown> {
  id: string;
  program_id: string;
  week_number: number;
  title: string;
  theme: string;
  learning_objectives: string[];
  topics: string[];
  estimated_study_time: string;
  created_at: string;
  updated_at: string;
}

interface LessonRow extends Record<string, unknown> {
  id: string;
  week_id: string;
  title: string;
  lesson_order: number;
  lesson_type: MasterclassLesson["lessonType"];
  content: string;
  video_url?: string | null;
  created_at: string;
  updated_at: string;
}

interface TermRow extends Record<string, unknown> {
  id: string;
  week_id: string;
  term: string;
  definition: string;
  simple_explanation: string;
  example: string;
  related_concept: string;
  term_order: number;
}

interface ResourceRow extends Record<string, unknown> {
  id: string;
  program_id: string;
  week_id?: string | null;
  title: string;
  description: string;
  resource_type: MasterclassResource["resourceType"];
  category?: MasterclassResource["category"] | null;
  url: string;
  storage_path?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  visibility: MasterclassResource["visibility"];
  resource_order: number;
  is_live_link: boolean;
  is_required?: boolean | null;
  is_published?: boolean | null;
  learning_objective?: string | null;
  version?: number | null;
  supersedes_id?: string | null;
}

const mapProgramRow = (row: ProgramRow): MasterclassProgram => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  tagline: row.tagline,
  summary: row.summary,
  philosophy: row.philosophy,
  technologies: row.technologies ?? [],
  totalWeeks: row.total_weeks,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapWeekRow = (row: WeekRow): MasterclassWeek => ({
  id: row.id,
  programId: row.program_id,
  weekNumber: row.week_number,
  title: row.title,
  theme: row.theme,
  learningObjectives: row.learning_objectives ?? [],
  topics: row.topics ?? [],
  estimatedStudyTime: row.estimated_study_time,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapLessonRow = (row: LessonRow): MasterclassLesson => ({
  id: row.id,
  weekId: row.week_id,
  title: row.title,
  lessonOrder: row.lesson_order,
  lessonType: row.lesson_type,
  content: row.content,
  videoUrl: row.video_url ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapTermRow = (row: TermRow): MasterclassTerm => ({
  id: row.id,
  weekId: row.week_id,
  term: row.term,
  definition: row.definition,
  simpleExplanation: row.simple_explanation,
  example: row.example,
  relatedConcept: row.related_concept,
  termOrder: row.term_order,
});

const mapResourceRow = (row: ResourceRow): MasterclassResource => ({
  id: row.id,
  programId: row.program_id,
  weekId: row.week_id ?? undefined,
  title: row.title,
  description: row.description,
  resourceType: row.resource_type,
  category: row.category ?? "reference",
  url: row.url ?? "",
  storagePath: row.storage_path ?? undefined,
  fileName: row.file_name ?? undefined,
  fileSize: row.file_size ?? undefined,
  mimeType: row.mime_type ?? undefined,
  visibility: row.visibility,
  resourceOrder: row.resource_order,
  isLiveLink: row.is_live_link ?? false,
  isRequired: row.is_required ?? false,
  // Rows written before the library migration have no flag and were visible, so
  // treat a missing value as published rather than hiding existing content.
  isPublished: row.is_published ?? true,
  learningObjective: row.learning_objective ?? "",
  version: row.version ?? 1,
  supersedesId: row.supersedes_id ?? undefined,
});

export const PROGRAM_SLUG = "web-development-masterclass";

/**
 * Alias of PROGRAM_SLUG for call sites outside this module that need "is this course row the
 * masterclass" (course.slug comparison), not "which program". Guaranteed identical: the phase9
 * seed migration sets both courses.slug and masterclass_programs.slug to this same literal.
 */
export const MASTERCLASS_COURSE_SLUG = PROGRAM_SLUG;

export const readMasterclassProgram = (slug: string = PROGRAM_SLUG): Promise<MasterclassProgram | null> => {
  return withMasterclassFallback(
    "readMasterclassProgram",
    async () => {
      const { data, error } = await supabase
        .from<ProgramRow>("masterclass_programs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw new Error(error.message ?? "Unable to load the masterclass program.");
      return data ? mapProgramRow(data) : null;
    },
    () => (slug === masterclassProgram.slug ? masterclassProgram : null),
  );
};

export const readMasterclassWeeks = (programId: string): Promise<MasterclassWeek[]> => {
  return withMasterclassFallback(
    "readMasterclassWeeks",
    async () => {
      const { data, error } = await supabase
        .from<WeekRow>("masterclass_weeks")
        .select("*")
        .eq("program_id", programId)
        .order("week_number", { ascending: true });
      if (error) throw new Error(error.message ?? "Unable to load masterclass weeks.");
      return (data ?? []).map(mapWeekRow);
    },
    () => (programId === masterclassProgram.id ? masterclassWeeks : []),
  );
};

export const readMasterclassWeekByNumber = (
  programId: string,
  weekNumber: number,
): Promise<MasterclassWeek | null> => {
  return withMasterclassFallback(
    "readMasterclassWeekByNumber",
    async () => {
      const { data, error } = await supabase
        .from<WeekRow>("masterclass_weeks")
        .select("*")
        .eq("program_id", programId)
        .eq("week_number", weekNumber)
        .maybeSingle();
      if (error) throw new Error(error.message ?? "Unable to load this masterclass week.");
      return data ? mapWeekRow(data) : null;
    },
    () =>
      programId === masterclassProgram.id
        ? masterclassWeeks.find((week) => week.weekNumber === weekNumber) ?? null
        : null,
  );
};

export const readMasterclassLessons = (weekId: string): Promise<MasterclassLesson[]> => {
  return withMasterclassFallback(
    "readMasterclassLessons",
    async () => {
      const { data, error } = await supabase
        .from<LessonRow>("masterclass_lessons")
        .select("*")
        .eq("week_id", weekId)
        .order("lesson_order", { ascending: true });
      if (error) throw new Error(error.message ?? "Unable to load lessons for this week.");
      return (data ?? []).map(mapLessonRow);
    },
    () => [],
  );
};

export const readMasterclassTerminology = (weekId: string): Promise<MasterclassTerm[]> => {
  return withMasterclassFallback(
    "readMasterclassTerminology",
    async () => {
      const { data, error } = await supabase
        .from<TermRow>("masterclass_terminology")
        .select("*")
        .eq("week_id", weekId)
        .order("term_order", { ascending: true });
      if (error) throw new Error(error.message ?? "Unable to load terminology for this week.");
      return (data ?? []).map(mapTermRow);
    },
    () => [],
  );
};

export const readMasterclassResources = (
  programId: string,
  weekId?: string,
): Promise<MasterclassResource[]> => {
  return withMasterclassFallback(
    "readMasterclassResources",
    async () => {
      let query = supabase.from<ResourceRow>("masterclass_resources").select("*").eq("program_id", programId);
      if (weekId) {
        query = query.eq("week_id", weekId);
      }
      const { data, error } = await query.order("resource_order", { ascending: true });
      if (error) throw new Error(error.message ?? "Unable to load resources.");
      return (data ?? []).map(mapResourceRow);
    },
    () => [],
  );
};

// ---------------------------------------------------------------------------
// Admin-only writes (enforced by RLS). No fallback: curriculum authoring
// requires a live Supabase connection.
// ---------------------------------------------------------------------------

export interface LessonInput {
  weekId: string;
  title: string;
  lessonOrder: number;
  lessonType: MasterclassLesson["lessonType"];
  content: string;
  videoUrl?: string;
}

export const createMasterclassLesson = async (input: LessonInput): Promise<MasterclassLesson> => {
  const { data, error } = await supabase
    .from<LessonRow>("masterclass_lessons")
    .insert({
      week_id: input.weekId,
      title: input.title,
      lesson_order: input.lessonOrder,
      lesson_type: input.lessonType,
      content: input.content,
      video_url: input.videoUrl ?? null,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to create this lesson.");
  emitMasterclassExperienceEvent();
  return mapLessonRow(data);
};

export const updateMasterclassLesson = async (
  lessonId: string,
  input: Partial<LessonInput>,
): Promise<MasterclassLesson> => {
  const payload: Record<string, unknown> = {};
  if (input.title !== undefined) payload.title = input.title;
  if (input.lessonOrder !== undefined) payload.lesson_order = input.lessonOrder;
  if (input.lessonType !== undefined) payload.lesson_type = input.lessonType;
  if (input.content !== undefined) payload.content = input.content;
  if (input.videoUrl !== undefined) payload.video_url = input.videoUrl || null;

  const { data, error } = await supabase
    .from<LessonRow>("masterclass_lessons")
    .update(payload)
    .eq("id", lessonId)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to update this lesson.");
  emitMasterclassExperienceEvent();
  return mapLessonRow(data);
};

export const deleteMasterclassLesson = async (lessonId: string): Promise<void> => {
  const { error } = await supabase.from("masterclass_lessons").delete().eq("id", lessonId);
  if (error) throw new Error(error.message ?? "Unable to delete this lesson.");
  emitMasterclassExperienceEvent();
};

export interface TermInput {
  weekId: string;
  term: string;
  definition: string;
  simpleExplanation: string;
  example: string;
  relatedConcept: string;
  termOrder: number;
}

export const createMasterclassTerm = async (input: TermInput): Promise<MasterclassTerm> => {
  const { data, error } = await supabase
    .from<TermRow>("masterclass_terminology")
    .insert({
      week_id: input.weekId,
      term: input.term,
      definition: input.definition,
      simple_explanation: input.simpleExplanation,
      example: input.example,
      related_concept: input.relatedConcept,
      term_order: input.termOrder,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to create this term.");
  emitMasterclassExperienceEvent();
  return mapTermRow(data);
};

export const updateMasterclassTerm = async (
  termId: string,
  input: Partial<Omit<TermInput, "weekId">>,
): Promise<MasterclassTerm> => {
  const payload: Record<string, unknown> = {};
  if (input.term !== undefined) payload.term = input.term;
  if (input.definition !== undefined) payload.definition = input.definition;
  if (input.simpleExplanation !== undefined) payload.simple_explanation = input.simpleExplanation;
  if (input.example !== undefined) payload.example = input.example;
  if (input.relatedConcept !== undefined) payload.related_concept = input.relatedConcept;
  if (input.termOrder !== undefined) payload.term_order = input.termOrder;

  const { data, error } = await supabase
    .from<TermRow>("masterclass_terminology")
    .update(payload)
    .eq("id", termId)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to update this term.");
  emitMasterclassExperienceEvent();
  return mapTermRow(data);
};

export const deleteMasterclassTerm = async (termId: string): Promise<void> => {
  const { error } = await supabase.from("masterclass_terminology").delete().eq("id", termId);
  if (error) throw new Error(error.message ?? "Unable to delete this term.");
  emitMasterclassExperienceEvent();
};

export interface ResourceInput {
  programId: string;
  weekId?: string;
  title: string;
  description: string;
  resourceType: MasterclassResource["resourceType"];
  category?: MasterclassResource["category"];
  url: string;
  storagePath?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  visibility: MasterclassResource["visibility"];
  resourceOrder: number;
  isLiveLink?: boolean;
  isRequired?: boolean;
  isPublished?: boolean;
  learningObjective?: string;
  version?: number;
  supersedesId?: string;
}

export const createMasterclassResource = async (input: ResourceInput): Promise<MasterclassResource> => {
  const { data, error } = await supabase
    .from<ResourceRow>("masterclass_resources")
    .insert({
      program_id: input.programId,
      week_id: input.weekId ?? null,
      title: input.title,
      description: input.description,
      resource_type: input.resourceType,
      category: input.category ?? "reference",
      url: input.url,
      storage_path: input.storagePath ?? null,
      file_name: input.fileName ?? null,
      file_size: input.fileSize ?? null,
      mime_type: input.mimeType ?? null,
      visibility: input.visibility,
      resource_order: input.resourceOrder,
      is_live_link: input.isLiveLink ?? false,
      is_required: input.isRequired ?? false,
      is_published: input.isPublished ?? true,
      learning_objective: input.learningObjective ?? "",
      version: input.version ?? 1,
      supersedes_id: input.supersedesId ?? null,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to create this resource.");
  emitMasterclassExperienceEvent();
  return mapResourceRow(data);
};

export const updateMasterclassResource = async (
  resourceId: string,
  input: Partial<Omit<ResourceInput, "programId">>,
): Promise<MasterclassResource> => {
  const payload: Record<string, unknown> = {};
  if (input.title !== undefined) payload.title = input.title;
  if (input.description !== undefined) payload.description = input.description;
  if (input.resourceType !== undefined) payload.resource_type = input.resourceType;
  if (input.category !== undefined) payload.category = input.category;
  if (input.url !== undefined) payload.url = input.url;
  if (input.weekId !== undefined) payload.week_id = input.weekId ?? null;
  if (input.storagePath !== undefined) payload.storage_path = input.storagePath ?? null;
  if (input.fileName !== undefined) payload.file_name = input.fileName ?? null;
  if (input.fileSize !== undefined) payload.file_size = input.fileSize ?? null;
  if (input.mimeType !== undefined) payload.mime_type = input.mimeType ?? null;
  if (input.visibility !== undefined) payload.visibility = input.visibility;
  if (input.resourceOrder !== undefined) payload.resource_order = input.resourceOrder;
  if (input.isLiveLink !== undefined) payload.is_live_link = input.isLiveLink;
  if (input.isRequired !== undefined) payload.is_required = input.isRequired;
  if (input.isPublished !== undefined) payload.is_published = input.isPublished;
  if (input.learningObjective !== undefined) payload.learning_objective = input.learningObjective;
  if (input.version !== undefined) payload.version = input.version;
  if (input.supersedesId !== undefined) payload.supersedes_id = input.supersedesId ?? null;

  const { data, error } = await supabase
    .from<ResourceRow>("masterclass_resources")
    .update(payload)
    .eq("id", resourceId)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to update this resource.");
  emitMasterclassExperienceEvent();
  return mapResourceRow(data);
};

export const deleteMasterclassResource = async (
  resourceId: string,
  options: { storagePath?: string } = {},
): Promise<void> => {
  const { error } = await supabase.from("masterclass_resources").delete().eq("id", resourceId);
  if (error) throw new Error(error.message ?? "Unable to delete this resource.");

  // Remove the file too, so deleting a resource does not leave an orphan paying
  // for storage. A failure here is not worth failing the whole delete over: the
  // catalogue row is already gone, which is what students see.
  if (options.storagePath) {
    try {
      await deleteResourceFile(options.storagePath);
    } catch {
      // Intentionally swallowed - the row is deleted and the file is unreachable
      // anyway, since storage reads are gated on the row existing.
    }
  }

  emitMasterclassExperienceEvent();
};

/**
 * Publish a new version of an existing resource.
 *
 * The previous row is retained and unpublished rather than overwritten, so any
 * historical reference to it still resolves and nothing a student has already
 * seen disappears from the record. The new row points back with supersedes_id.
 */
export const replaceMasterclassResource = async (
  previous: MasterclassResource,
  input: Omit<ResourceInput, "programId" | "version" | "supersedesId">,
): Promise<MasterclassResource> => {
  const created = await createMasterclassResource({
    ...input,
    programId: previous.programId,
    version: previous.version + 1,
    supersedesId: previous.id,
  });

  await updateMasterclassResource(previous.id, { isPublished: false });
  emitMasterclassExperienceEvent();
  return created;
};
