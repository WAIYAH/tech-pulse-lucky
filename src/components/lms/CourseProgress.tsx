import { Progress } from "@/components/ui/progress";

interface CourseProgressProps {
  value: number;
  label?: string;
}

const CourseProgress = ({ value, label = "Progress" }: CourseProgressProps) => {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{normalized}%</span>
      </div>
      <Progress value={normalized} />
    </div>
  );
};

export default CourseProgress;

