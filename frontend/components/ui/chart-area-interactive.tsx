"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

interface Expense {
  id: number;
  amount: number;
  description: string;
  category: string;
  payer: {
    name: string;
    id: number;
  };
  created_at: string;
  status: string;
  dispute_reason?: string;
  user_approval_status?: string;
}

interface ChartAreaInteractiveProps {
  expenses: Expense[];
}

const chartConfig = {
  received: {
    label: "received",
    color: "var(--chart-1)",
  },
  spend: {
    label: "spend",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ expenses }: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState("30d");

  // Transform expenses into chart data
  const chartData = React.useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    // Group expenses by date (only APPROVED expenses)
    const dataByDate: Record<string, { received: number; spend: number }> = {};

    expenses
      .filter((expense) => expense.status === "APPROVED") // Only approved expenses
      .forEach((expense) => {
        const date = new Date(expense.created_at).toISOString().split("T")[0];
        if (!dataByDate[date]) {
          dataByDate[date] = { received: 0, spend: 0 };
        }

        // Add to spend (expenses are always spending)
        dataByDate[date].spend += expense.amount;
      });

    // Convert to array and sort by date
    return Object.entries(dataByDate)
      .map(([date, values]) => ({
        date,
        ...values,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [expenses]);

  const filteredData = React.useMemo(() => {
    if (chartData.length === 0) return [];

    const now = new Date();
    const daysToSubtract = timeRange === "7d" ? 7 : 30;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [chartData, timeRange]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart</CardTitle>
          <CardDescription>
            Showing data for the {timeRange === "7d" ? "last 7 days" : "last 30 days"}
          </CardDescription>
        </div>

        {/* ONLY 30 & 7 DAYS */}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[250px] text-center">
            <p className="text-sm font-medium mb-1">Data not available</p>
            <p className="text-xs text-muted-foreground">
              No approved expenses found for this time range
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillreceived" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-received)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-received)"
                    stopOpacity={0.1}
                  />
                </linearGradient>

                <linearGradient id="fillspend" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-spend)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-spend)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="spend"
                type="natural"
                fill="url(#fillspend)"
                stroke="var(--color-spend)"
              />
              <Area
                dataKey="received"
                type="natural"
                fill="url(#fillreceived)"
                stroke="var(--color-received)"
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
