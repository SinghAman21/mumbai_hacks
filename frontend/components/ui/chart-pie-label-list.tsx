"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A pie chart with a label list";

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

interface ChartPieLabelListProps {
  expenses: Expense[];
}

// Define chart colors for different categories
const categoryColors: Record<string, string> = {
  food: "var(--chart-1)",
  transport: "var(--chart-2)",
  entertainment: "var(--chart-3)",
  utilities: "var(--chart-4)",
  other: "var(--chart-5)",
};

export function ChartPieLabelList({ expenses }: ChartPieLabelListProps) {
  // Transform expenses into category-based data
  const { chartData, chartConfig, totalAmount } = React.useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return { chartData: [], chartConfig: {}, totalAmount: 0 };
    }

    // Group by category (only APPROVED expenses)
    const categoryTotals: Record<string, number> = {};
    let total = 0;

    expenses
      .filter((expense) => expense.status === "APPROVED") // Only approved expenses
      .forEach((expense) => {
        const category = expense.category.toLowerCase();
        categoryTotals[category] =
          (categoryTotals[category] || 0) + expense.amount;
        total += expense.amount;
      });

    // Create chart data
    const data = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      fill: categoryColors[category] || "var(--chart-5)",
    }));

    // Create config
    const config: ChartConfig = {
      amount: {
        label: "Amount",
      },
    };

    Object.keys(categoryTotals).forEach((category, index) => {
      config[category] = {
        label: category.charAt(0).toUpperCase() + category.slice(1),
        color: categoryColors[category] || `var(--chart-${(index % 5) + 1})`,
      };
    });

    return { chartData: data, chartConfig: config, totalAmount: total };
  }, [expenses]);
  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col mb-24">
        <CardHeader className="items-center pb-0">
          <CardTitle>Expense Distribution by Category</CardTitle>
          <CardDescription>No expenses to display</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col mb-24">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expense Distribution by Category</CardTitle>
        <CardDescription>Total: ${totalAmount.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[400px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="amount" hideLabel />}
            />
            <Pie data={chartData} dataKey="amount">
              <LabelList
                dataKey="category"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Breakdown of expenses across all your groups
        </div>
      </CardFooter>
    </Card>
  );
}
