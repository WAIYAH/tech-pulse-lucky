import type { ReactNode } from "react";

interface EmptyStateProps {
  image: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({ image, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-background px-6 py-10 text-center">
    <img src={image} alt="" className="h-28 w-28 object-contain sm:h-36 sm:w-36" />
    <p className="text-sm font-semibold text-foreground">{title}</p>
    {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
