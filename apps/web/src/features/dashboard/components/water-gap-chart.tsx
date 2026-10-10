"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@paddy-field/ui/components/chart";
import { Bar, CartesianGrid, Cell, ComposedChart, Line, XAxis, YAxis } from "recharts";

const chartConfig = {
  rain: { label: "Rain", color: "var(--chart-1)" },
  need: { label: "Rice water need", color: "var(--foreground)" },
} satisfies ChartConfig;

type WaterGapRow = { month: string; rain: number; need: number; color: string };

export function WaterGapChart({ data }: { data: WaterGapRow[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <ComposedChart accessibilityLayer data={data} margin={{ top: 12, left: -16, right: 4 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent formatter={(value, name) => `${chartConfig[name as keyof typeof chartConfig].label}: ${value} mm`} />}
        />
        <Bar dataKey="rain" radius={[6, 6, 0, 0]}>
          {data.map(function renderCell(row, index) {
            return <Cell key={index} fill={row.color} />;
          })}
        </Bar>
        <Line dataKey="need" type="monotone" stroke="var(--color-need)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
      </ComposedChart>
    </ChartContainer>
  );
}
