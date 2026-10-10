"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@paddy-field/ui/components/chart";
import { Bar, BarChart, LabelList, XAxis } from "recharts";

const chartConfig = {
  cover: { label: "Rain cover", color: "var(--chart-1)" },
} satisfies ChartConfig;

// Illustrative: part of rice water need that normal rain covers in one area.
const chartData = [
  { season: "Rainy", cover: 100 },
  { season: "Early dry", cover: 67 },
  { season: "Late dry", cover: 15 },
];

export function RiceSeasonChart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 28 }}>
        <XAxis dataKey="season" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent formatter={(value) => `Rain cover ${value}%`} />}
        />
        <Bar dataKey="cover" fill="var(--color-cover)" radius={16}>
          <LabelList
            dataKey="cover"
            position="top"
            className="fill-foreground font-semibold"
            fontSize={24}
            formatter={(value) => `${value}%`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
