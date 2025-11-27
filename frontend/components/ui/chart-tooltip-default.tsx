"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", received: 222, spend: 150 },
  { date: "2024-04-02", received: 97, spend: 180 },
  { date: "2024-04-03", received: 167, spend: 120 },
  { date: "2024-04-04", received: 242, spend: 260 },
  { date: "2024-04-05", received: 373, spend: 290 },
  { date: "2024-04-06", received: 301, spend: 340 },
  { date: "2024-04-07", received: 245, spend: 180 },
  { date: "2024-04-08", received: 409, spend: 320 },
  { date: "2024-04-09", received: 59, spend: 110 },
  { date: "2024-04-10", received: 261, spend: 190 },
  { date: "2024-04-11", received: 327, spend: 350 },
  { date: "2024-04-12", received: 292, spend: 210 },
  { date: "2024-04-13", received: 342, spend: 380 },
  { date: "2024-04-14", received: 137, spend: 220 },
  { date: "2024-04-15", received: 120, spend: 170 },
  { date: "2024-04-16", received: 138, spend: 190 },
  { date: "2024-04-17", received: 446, spend: 360 },
  { date: "2024-04-18", received: 364, spend: 410 },
  { date: "2024-04-19", received: 243, spend: 180 },
  { date: "2024-04-20", received: 89, spend: 150 },
  { date: "2024-04-21", received: 137, spend: 200 },
  { date: "2024-04-22", received: 224, spend: 170 },
  { date: "2024-04-23", received: 138, spend: 230 },
  { date: "2024-04-24", received: 387, spend: 290 },
  { date: "2024-04-25", received: 215, spend: 250 },
  { date: "2024-04-26", received: 75, spend: 130 },
  { date: "2024-04-27", received: 383, spend: 420 },
  { date: "2024-04-28", received: 122, spend: 180 },
  { date: "2024-04-29", received: 315, spend: 240 },
  { date: "2024-04-30", received: 454, spend: 380 },
  { date: "2024-05-01", received: 165, spend: 220 },
  { date: "2024-05-02", received: 293, spend: 310 },
  { date: "2024-05-03", received: 247, spend: 190 },
  { date: "2024-05-04", received: 385, spend: 420 },
  { date: "2024-05-05", received: 481, spend: 390 },
  { date: "2024-05-06", received: 498, spend: 520 },
  { date: "2024-05-07", received: 388, spend: 300 },
  { date: "2024-05-08", received: 149, spend: 210 },
  { date: "2024-05-09", received: 227, spend: 180 },
  { date: "2024-05-10", received: 293, spend: 330 },
  { date: "2024-05-11", received: 335, spend: 270 },
  { date: "2024-05-12", received: 197, spend: 240 },
  { date: "2024-05-13", received: 197, spend: 160 },
  { date: "2024-05-14", received: 448, spend: 490 },
  { date: "2024-05-15", received: 473, spend: 380 },
  { date: "2024-05-16", received: 338, spend: 400 },
  { date: "2024-05-17", received: 499, spend: 420 },
  { date: "2024-05-18", received: 315, spend: 350 },
  { date: "2024-05-19", received: 235, spend: 180 },
  { date: "2024-05-20", received: 177, spend: 230 },
  { date: "2024-05-21", received: 82, spend: 140 },
  { date: "2024-05-22", received: 81, spend: 120 },
  { date: "2024-05-23", received: 252, spend: 290 },
  { date: "2024-05-24", received: 294, spend: 220 },
  { date: "2024-05-25", received: 201, spend: 250 },
  { date: "2024-05-26", received: 213, spend: 170 },
  { date: "2024-05-27", received: 420, spend: 460 },
  { date: "2024-05-28", received: 233, spend: 190 },
  { date: "2024-05-29", received: 78, spend: 130 },
  { date: "2024-05-30", received: 340, spend: 280 },
  { date: "2024-05-31", received: 178, spend: 230 },
  { date: "2024-06-01", received: 178, spend: 200 },
  { date: "2024-06-02", received: 470, spend: 410 },
  { date: "2024-06-03", received: 103, spend: 160 },
  { date: "2024-06-04", received: 439, spend: 380 },
  { date: "2024-06-05", received: 88, spend: 140 },
  { date: "2024-06-06", received: 294, spend: 250 },
  { date: "2024-06-07", received: 323, spend: 370 },
  { date: "2024-06-08", received: 385, spend: 320 },
  { date: "2024-06-09", received: 438, spend: 480 },
  { date: "2024-06-10", received: 155, spend: 200 },
  { date: "2024-06-11", received: 92, spend: 150 },
  { date: "2024-06-12", received: 492, spend: 420 },
  { date: "2024-06-13", received: 81, spend: 130 },
  { date: "2024-06-14", received: 426, spend: 380 },
  { date: "2024-06-15", received: 307, spend: 350 },
  { date: "2024-06-16", received: 371, spend: 310 },
  { date: "2024-06-17", received: 475, spend: 520 },
  { date: "2024-06-18", received: 107, spend: 170 },
  { date: "2024-06-19", received: 341, spend: 290 },
  { date: "2024-06-20", received: 408, spend: 450 },
  { date: "2024-06-21", received: 169, spend: 210 },
  { date: "2024-06-22", received: 317, spend: 270 },
  { date: "2024-06-23", received: 480, spend: 530 },
  { date: "2024-06-24", received: 132, spend: 180 },
  { date: "2024-06-25", received: 141, spend: 190 },
  { date: "2024-06-26", received: 434, spend: 380 },
  { date: "2024-06-27", received: 448, spend: 490 },
  { date: "2024-06-28", received: 149, spend: 200 },
  { date: "2024-06-29", received: 103, spend: 160 },
  { date: "2024-06-30", received: 446, spend: 400 },
]

const chartConfig = {
  received: {
    label: "received",
    color: "var(--chart-1)",
  },
  spend: {
    label: "spend",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("30d") // default 30 days

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30") // last date in dataset

    const daysToSubtract = timeRange === "7d" ? 7 : 30
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart</CardTitle>
          <CardDescription>Showing data for selected time range</CardDescription>
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
                <stop offset="5%" stopColor="var(--color-received)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-received)" stopOpacity={0.1} />
              </linearGradient>

              <linearGradient id="fillspend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-spend)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-spend)" stopOpacity={0.1} />
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
  )
}