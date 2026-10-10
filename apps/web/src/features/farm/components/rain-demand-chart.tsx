"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@paddy-field/ui/components/chart";
import { Area, Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";

import type { WeeklyWater } from "../farm-queries";

const chartConfig = {
  rainMm: { label: "Rain", color: "var(--chart-1)" },
  demandMm: { label: "Estimated crop demand", color: "var(--chart-3)" },
} satisfies ChartConfig;

function formatTooltipValue(value: unknown, name: unknown) {
  const label = chartConfig[name as keyof typeof chartConfig].label;
  if (Array.isArray(value)) return `${label}: ${value[0]}–${value[1]} mm`;
  return `${label}: ${value} mm`;
}

export function RainDemandChart({ data }: { data: WeeklyWater[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <ComposedChart accessibilityLayer data={data} margin={{ top: 12, left: -16, right: 4 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent formatter={formatTooltipValue} />}
        />
        <Bar dataKey="rainMm" fill="var(--color-rainMm)" radius={[6, 6, 0, 0]} />
        <Area
          dataKey="demandMm"
          type="monotone"
          fill="var(--color-demandMm)"
          fillOpacity={0.2}
          stroke="var(--color-demandMm)"
          strokeDasharray="4 4"
          connectNulls={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}
