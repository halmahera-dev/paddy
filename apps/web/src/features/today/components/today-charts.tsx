"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@hollou/ui/components/chart";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function Sparkline({
  values,
  color,
  isStep = false,
}: {
  values: number[];
  color: string;
  isStep?: boolean;
}) {
  const stepValues = isStep && values.length > 0 ? [...values, values[values.length - 1]] : values;
  const points = stepValues.map((value, index) => ({ index, value }));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.2 || 1;
  return (
    <div className="h-12" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 240, height: 48 }}>
        <AreaChart data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <YAxis hide domain={[min - padding, max + padding / 2]} />
          <Area
            dataKey="value"
            type={isStep ? "stepAfter" : "monotone"}
            baseValue="dataMin"
            stroke={color}
            strokeWidth={1.5}
            fill={color}
            fillOpacity={0.12}
            activeDot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

type PassPoint = { label: string; mm: number };

function PassDot({ cx, cy, index, lastIndex }: { cx?: number; cy?: number; index?: number; lastIndex: number }) {
  if (cx === undefined || cy === undefined) {
    return null;
  }
  const isLatest = index === lastIndex;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isLatest ? 5 : 3}
      fill={isLatest ? "var(--brand)" : "var(--card)"}
      stroke="var(--brand)"
      strokeWidth={1.5}
    />
  );
}

export function PassChart({ points, label }: { points: PassPoint[]; label: string }) {
  const config = { mm: { label, color: "var(--brand)" } } satisfies ChartConfig;
  const lastIndex = points.length - 1;
  return (
    <ChartContainer config={config} className="aspect-auto h-44 w-full">
      <AreaChart data={points} accessibilityLayer margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id="pass-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-mm)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--color-mm)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
        <YAxis tickLine={false} axisLine={false} unit=" mm" width={64} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="mm"
          type="monotone"
          baseValue="dataMin"
          stroke="var(--color-mm)"
          strokeWidth={2}
          fill="url(#pass-fill)"
          dot={(props) => <PassDot key={props.index} {...props} lastIndex={lastIndex} />}
          activeDot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
