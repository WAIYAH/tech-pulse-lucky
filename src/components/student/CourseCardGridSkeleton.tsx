import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CourseCardGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} className="flex flex-col overflow-hidden border-2">
        <Skeleton className="h-40 w-full rounded-none" />
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
        <CardContent className="flex-1 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </CardFooter>
      </Card>
    ))}
  </div>
);

export default CourseCardGridSkeleton;
