import { Link } from "react-router-dom";
import { Clock3, Layers3, User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatKesAmount } from "@/data/lmsConfig";
import type { LmsCourse } from "@/types/lms";

interface CourseCardProps {
  course: LmsCourse;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="h-full flex flex-col border-2 hover:border-primary/40 transition-colors">
      <div className="h-40 rounded-t-xl bg-gradient-to-r from-primary/10 to-accent/20 flex items-center justify-center">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="h-full w-full object-cover rounded-t-xl"
        />
      </div>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={course.isFree ? "secondary" : "default"}>
            {course.isFree ? "FREE" : "PAID"}
          </Badge>
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
        <p className="font-bold text-primary">
          {course.isFree ? "Free" : formatKesAmount(course.price)}
        </p>
        <Button asChild>
          <Link to={`/courses/${course.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;

