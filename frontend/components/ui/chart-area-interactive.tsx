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
  id: string;
  amount: number;
  description: string;
  category: string;
  payer: {
    name: string;
    id: string;
  };
  created_at: string;
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

    // Group expenses by date
    const dataByDate: Record<string, { received: number; spend: number }> = {};

    expenses.forEach((expense) => {
      const date = new Date(expense.created_at).toISOString().split("T")[0];
      if (!dataByDate[date]) {
        dataByDate[date] = { received: 0, spend: 0 };
      }

      // Assuming positive amounts are "received" and we track all as spend
      // You may need to adjust this logic based on your business rules
      if (expense.amount > 0) {
        dataByDate[date].spend += expense.amount;
      }
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
            Showing data for selected time range
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
      </CardContent>
    </Card>
  );
}
