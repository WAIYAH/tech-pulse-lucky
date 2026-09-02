import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { exportToCsv } from "@/lib/exportToCsv";
import type { CoursePerformancePoint } from "./reportsData";

const chartConfig: ChartConfig = {
  activeEnrollments: { label: "Active Enrollments", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const TOP_N_FOR_CHART = 8;

const CoursePerformanceChart = ({ data }: { data: CoursePerformancePoint[] }) => {
  const chartData = data.slice(0, TOP_N_FOR_CHART);

  const handleExport = () => {
    exportToCsv(
      "course-performance.csv",
      [
        { key: "title", label: "Course Title" },
        { key: "category", label: "Category" },
        { key: "level", label: "Level" },
        { key: "price", label: "Price" },
        { key: "activeEnrollments", label: "Active Enrollments" },
        { key: "pendingEnrollments", label: "Pending Enrollments" },
        { key: "approvedRevenue", label: "Approved Revenue" },
      ],
      data,
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <h2 className="text-xl font-semibold">Course Performance</h2>
        <Button size="sm" variant="outline" onClick={handleExport} disabled={data.length === 0}>
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No courses to compare yet.</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
            <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="title"
                tickLine={false}
                axisLine={false}
                width={160}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="activeEnrollments" fill="var(--color-activeEnrollments)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CoursePerformanceChart;
