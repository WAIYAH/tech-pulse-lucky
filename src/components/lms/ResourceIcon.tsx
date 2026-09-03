import {
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  Github,
  Link as LinkIcon,
  Presentation,
  Video,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MasterclassResourceType } from "@/types/masterclass";

const ICONS: Record<MasterclassResourceType, LucideIcon> = {
  pdf: FileText,
  doc: FileType,
  ppt: Presentation,
  sheet: FileSpreadsheet,
  image: FileImage,
  zip: FileArchive,
  code: FileCode,
  audio: FileAudio,
  link: LinkIcon,
  github: Github,
  video: Video,
};

/** Tinted so a student can tell formats apart at a glance in a long list. */
const TONES: Record<MasterclassResourceType, string> = {
  pdf: "bg-red-500/10 text-red-600 dark:text-red-400",
  doc: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ppt: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  sheet: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  image: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  zip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  code: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  audio: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  link: "bg-primary/10 text-primary",
  github: "bg-slate-500/10 text-slate-700 dark:text-slate-200",
  video: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
};

const getResourceIcon = (resourceType: MasterclassResourceType): LucideIcon =>
  ICONS[resourceType] ?? FileText;

const ResourceIcon = ({
  resourceType,
  className,
}: {
  resourceType: MasterclassResourceType;
  className?: string;
}) => {
  const Icon = getResourceIcon(resourceType);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
        TONES[resourceType] ?? TONES.pdf,
        className,
      )}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
};

export default ResourceIcon;
