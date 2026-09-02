import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { exportToCsv } from "@/lib/exportToCsv";
import type { MonthlyRevenuePoint } from "./reportsData";

const chartConfig: ChartConfig = {
  approved: { label: "Approved", color: "hsl(var(--primary))" },
  pending: { label: "Pending", color: "#f59e0b" },
} satisfies ChartConfig;

const RevenueTrendChart = ({ data }: { data: MonthlyRevenuePoint[] }) => {
  const handleExport = () => {
    exportToCsv(
      "revenue-by-month.csv",
      [
        { key: "monthLabel", label: "Month" },
        { key: "approved", label: "Approved Revenue" },
        { key: "pending", label: "Pending Value" },
        { key: "rejected", label: "Rejected Value" },
        { key: "approvedCount", label: "Approved Count" },
        { key: "totalCount", label: "Total Count" },
      ],
      data,
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <h2 className="text-xl font-semibold">Revenue Trend</h2>
        <Button size="sm" variant="outline" onClick={handleExport} disabled={data.length === 0}>
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payment records yet.</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
            <LineChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="approved"
                type="monotone"
                stroke="var(--color-approved)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="pending"
                type="monotone"
                stroke="var(--color-pending)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueTrendChart;
