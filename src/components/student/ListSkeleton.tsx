import { Skeleton } from "@/components/ui/skeleton";

const ListSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="mt-3 h-3 w-3/5" />
      </div>
    ))}
  </div>
);

export default ListSkeleton;
