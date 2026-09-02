import { Link } from "react-router-dom";
import { Clock3, Layers3, Lock, User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatKesAmount } from "@/data/lmsConfig";
import { enrollmentReopenLabel } from "@/lib/lms/enrollmentFocus";
import { routes } from "@/routes/routeConfig";
import type { LmsCourse } from "@/types/lms";

interface CourseCardProps {
  course: LmsCourse;
  /** Enrollment is paused for this course; render it as unavailable. */
  locked?: boolean;
}

const CourseCard = ({ course, locked = false }: CourseCardProps) => {
  return (
    <Card
      className={`h-full flex flex-col border-2 transition-colors ${
        locked ? "border-muted bg-muted/30" : "hover:border-primary/40"
      }`}
    >
      <div className="h-40 rounded-t-xl bg-gradient-to-r from-primary/10 to-accent/20 flex items-center justify-center">
        <img
          src={course.imageUrl}
          alt={course.title}
          className={`h-full w-full object-cover rounded-t-xl ${
            locked ? "opacity-50 grayscale" : ""
          }`}
        />
      </div>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          {locked ? (
            <Badge variant="outline" className="gap-1">
              <Lock className="h-3 w-3" />
              Opens {enrollmentReopenLabel()}
            </Badge>
          ) : (
            <Badge variant={course.isFree ? "secondary" : "default"}>
              {course.isFree ? "FREE" : "PAID"}
            </Badge>
          )}
          <Badge variant="outline">{course.level}</Badge>
        </div>
        <h3 className="text-xl font-bold leading-tight">{course.title}</h3>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-muted-foreground text-sm">{course.shortDescription}</p>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User2 className="h-4 w-4 text-primary" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-primary" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-primary" />
            <span>{course.lessonsCount} lessons</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <p className={`font-bold ${locked ? "text-muted-foreground" : "text-primary"}`}>
          {course.isFree ? "Free" : formatKesAmount(course.price)}
        </p>
        {locked ? (
          <Button variant="outline" disabled>
            <Lock className="mr-1 h-4 w-4" />
            Enrollment Paused
          </Button>
        ) : (
          <Button asChild>
            <Link to={routes.public.course(course.slug)}>View Details</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
