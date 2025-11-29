"use client";

import * as React from "react";
import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive";
import { ChartPieLabelList } from "@/components/ui/chart-pie-label-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashHeader from "@/components/dashboard/dash-header";

export default function AnalysisPage() {
  const [selectedMonth, setSelectedMonth] = React.useState("november");

  const months = [
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" },
  ];

  return (
    <>
      <DashHeader />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Analysis</h1>
            <p className="text-muted-foreground">
              View your spending and income trends over time
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="month-select" className="text-sm font-medium">
              Select Month:
            </label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger
                id="month-select"
                className="w-[200px]"
                aria-label="Select a month"
              >
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {months.map((month) => (
                  <SelectItem
                    key={month.value}
                    value={month.value}
                    className="rounded-lg"
                  >
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            <ChartAreaInteractive />
            <ChartPieLabelList />
          </div>
        </div>
      </main>
    </>
  );
}
