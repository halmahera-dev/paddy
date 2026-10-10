"use client";

import { Badge } from "@paddy-field/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@paddy-field/ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@paddy-field/ui/components/chart";
import { Tabs, TabsList, TabsTrigger } from "@paddy-field/ui/components/tabs";
import { useState, useSyncExternalStore } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

type Crop = "rice" | "maize" | "soybean" | "fallow";
type Soil = "clay" | "loam" | "sandy";
type Priority = "water" | "soil" | "rice";
type SeasonKey = "rainy" | "earlyDry" | "lateDry";

const seasonKeys: SeasonKey[] = ["rainy", "earlyDry", "lateDry"];

const chartConfig = {
  rainy: { label: "Rainy (Nov–Feb)", color: "var(--chart-1)" },
  earlyDry: {
    label: "Early dry (Mar–Jun)",
    color: "var(--chart-2)",
  },
  lateDry: {
    label: "Late dry (Jul–Oct)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

// Illustrative area: normal season rain and crop water need, in mm.
const seasonRain = [1200, 600, 150];
const cropNeed: Record<Crop, number[]> = {
  rice: [1000, 900, 1000],
  maize: [450, 500, 500],
  soybean: [350, 400, 400],
  fallow: [0, 0, 0],
};

const cropShortName: Record<Crop, string> = {
  rice: "Rice",
  maize: "Maize",
  soybean: "Soy",
  fallow: "Rest",
};

const plans: { id: string; crops: Crop[] }[] = [
  { id: "rrr", crops: ["rice", "rice", "rice"] },
  { id: "rrs", crops: ["rice", "rice", "soybean"] },
  { id: "rms", crops: ["rice", "maize", "soybean"] },
  { id: "rsf", crops: ["rice", "soybean", "fallow"] },
];

const soilOptions: { value: Soil; label: string }[] = [
  { value: "clay", label: "Clay" },
  { value: "loam", label: "Loam" },
  { value: "sandy", label: "Sandy" },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: "water", label: "Save water" },
  { value: "soil", label: "Improve soil" },
  { value: "rice", label: "Keep rice" },
];

function rainCover(crop: Crop, seasonIndex: number, soil: Soil) {
  if (crop === "fallow") return null;
  const sandyRiceLoss = soil === "sandy" && crop === "rice" ? 0.8 : 1;
  const cover = (seasonRain[seasonIndex] / cropNeed[crop][seasonIndex]) * sandyRiceLoss;
  return Math.min(Math.round(cover * 100), 100);
}

function soilNotes(crops: Crop[], soil: Soil) {
  const notes: string[] = [];
  if (crops.every((crop) => crop === "rice")) notes.push("No rest for soil");
  if (crops.includes("soybean")) notes.push("Soybean adds nitrogen");
  if (crops.includes("fallow")) notes.push("Fallow rests the soil");
  if (soil === "sandy" && crops.includes("rice")) notes.push("Rice loses water on sand");
  if (soil === "clay" && crops[1] !== "rice") notes.push("Clay needs drainage");
  return notes;
}

function scorePlan(crops: Crop[], soil: Soil) {
  const covers = crops.map((crop, index) => rainCover(crop, index, soil) ?? 100);
  const water = covers.reduce((sum, cover) => sum + cover, 0);
  const restSeasons = crops.filter((crop) => crop === "soybean" || crop === "fallow").length;
  const soilScore = restSeasons * 10 - (crops.every((crop) => crop === "rice") ? 10 : 0);
  const riceSeasons = crops.filter((crop) => crop === "rice").length;
  return { water, soil: soilScore, rice: riceSeasons * 1000 + water };
}

function sortPlans(priority: Priority, soil: Soil) {
  return [...plans].sort(function byPriority(a, b) {
    return scorePlan(b.crops, soil)[priority] - scorePlan(a.crops, soil)[priority];
  });
}

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function RotationExplorer() {
  const [soil, setSoil] = useState<Soil>("loam");
  const [priority, setPriority] = useState<Priority>("water");
  const [chosenPlanId, setChosenPlanId] = useState<string | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  const orderedPlans = sortPlans(priority, soil);
  const selectedPlanId = chosenPlanId ?? orderedPlans[0].id;
  const selectedIndex = orderedPlans.findIndex((plan) => plan.id === selectedPlanId);
  const selectedPlan = orderedPlans[selectedIndex];

  const chartData = orderedPlans.map(function toChartRow(plan) {
    const covers = plan.crops.map((crop, seasonIndex) => rainCover(crop, seasonIndex, soil));
    return {
      id: plan.id,
      tick: plan.crops.map((crop) => cropShortName[crop]).join(" -> "),
      crops: plan.crops,
      rainy: covers[0] ?? 0,
      earlyDry: covers[1] ?? 0,
      lateDry: covers[2] ?? 0,
    };
  });

  function chooseSoil(value: Soil) {
    setSoil(value);
    setChosenPlanId(null);
  }

  function choosePriority(value: Priority) {
    setPriority(value);
    setChosenPlanId(null);
  }

  return (
    <Card className="min-w-0">
      <CardHeader>
        <div className="flex flex-col gap-5">
          <div className="grid min-w-0 gap-1.5">
            <CardTitle>How much of the water need does rain cover?</CardTitle>
            <CardDescription>Example area. Rain only. Tap a plan to see why.</CardDescription>
          </div>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <ChoiceTabs
              label="Your soil"
              options={soilOptions}
              value={soil}
              onChange={chooseSoil}
            />
            <ChoiceTabs
              label="Your priority"
              options={priorityOptions}
              value={priority}
              onChange={choosePriority}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="mb-3 text-xs text-muted-foreground md:hidden">
          Scroll to compare all four plans.
        </p>
        <div
          role="region"
          aria-label="Rain cover for four crop plans"
          tabIndex={0}
          className="overflow-x-auto rounded-lg pb-2 focus-visible:outline-2 focus-visible:outline-ring [&_g:focus:not(:focus-visible)]:outline-none"
        >
          <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full min-w-160">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20, left: -16, right: 4 }}
              barGap={3}
              className="cursor-pointer"
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="tick"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                fontSize={11}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 40, 100]}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
                axisLine={false}
              />
              <ReferenceLine
                y={40}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                label={{
                  value: "Too little rain",
                  position: "insideBottomRight",
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {chartConfig[name as SeasonKey].label}
                        </span>
                        <span className="font-medium tabular-nums">
                          {item.payload.crops[seasonKeys.indexOf(name as SeasonKey)] === "fallow"
                            ? "Rest"
                            : `${value}%`}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
              {seasonKeys.map(function renderSeasonBar(key) {
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={`var(--color-${key})`}
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={!reduceMotion}
                    animationDuration={450}
                    animationEasing="ease-out"
                    onClick={(_, index) => setChosenPlanId(chartData[index].id)}
                  >
                    {chartData.map(function renderCell(row, index) {
                      return <Cell key={row.id} fillOpacity={index === selectedIndex ? 1 : 0.35} />;
                    })}
                    <LabelList
                      dataKey={key}
                      position="top"
                      className="fill-foreground"
                      fontSize={10}
                      formatter={(value) => (value === 0 ? "" : `${value}`)}
                    />
                  </Bar>
                );
              })}
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full flex-wrap items-center gap-2" aria-live="polite">
          <Badge variant={selectedIndex === 0 ? "default" : "outline"}>
            {selectedIndex === 0 ? "Consider first" : `Choice ${selectedIndex + 1} of 4`}
          </Badge>
          <p className="font-medium">
            {selectedPlan.crops.map((crop) => cropShortName[crop]).join(" -> ")}
          </p>
          {selectedPlan.id === "rrr" ? <Badge variant="outline">Today’s habit</Badge> : null}
          {soilNotes(selectedPlan.crops, soil).map(function renderNote(note) {
            return (
              <Badge key={note} variant="secondary">
                {note}
              </Badge>
            );
          })}
        </div>
      </CardFooter>
    </Card>
  );
}

function ChoiceTabs<Value extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: Value; label: string }[];
  value: Value;
  onChange: (value: Value) => void;
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <Tabs value={value} onValueChange={(nextValue) => onChange(nextValue as Value)}>
        <TabsList aria-label={label} className="w-full min-w-0 group-data-horizontal/tabs:h-14">
          {options.map(function renderOption(option) {
            return (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="min-w-0 whitespace-normal"
              >
                {option.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}
