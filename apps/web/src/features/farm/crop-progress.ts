import type { Crop, CropRecord } from "./farm-queries";

// Sample stage lengths in days. Replace with the sourced FAO-56 crop table.
const cropStages: Record<Exclude<Crop, "fallow">, { name: string; days: number }[]> = {
  rice: [
    { name: "Initial", days: 30 },
    { name: "Development", days: 30 },
    { name: "Mid-season", days: 40 },
    { name: "Late season", days: 20 },
  ],
  maize: [
    { name: "Initial", days: 20 },
    { name: "Development", days: 35 },
    { name: "Mid-season", days: 40 },
    { name: "Late season", days: 30 },
  ],
  soybean: [
    { name: "Initial", days: 15 },
    { name: "Development", days: 15 },
    { name: "Mid-season", days: 40 },
    { name: "Late season", days: 15 },
  ],
};

export const cropName: Record<Crop, string> = {
  rice: "Rice",
  maize: "Maize",
  soybean: "Soybean",
  fallow: "Fallow",
};

export function seasonLengthDays(crop: Exclude<Crop, "fallow">) {
  return cropStages[crop].reduce((sum, stage) => sum + stage.days, 0);
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to) - Date.parse(from)) / millisecondsPerDay);
}

function stageAt(stages: { name: string; days: number }[], elapsedDays: number) {
  let stageEnd = 0;
  for (const stage of stages) {
    stageEnd += stage.days;
    if (elapsedDays < stageEnd) return stage.name;
  }
  return "Ready to harvest";
}

export type CropProgress =
  | { kind: "fallow" }
  | { kind: "unknown-date" }
  | { kind: "estimate"; elapsedMin: number; elapsedMax: number; stage: string; percent: number };

// A rough date stays a range. Never collapse it to its middle day.
export function estimateCropProgress(record: CropRecord, asOf: string): CropProgress {
  if (record.crop === "fallow") return { kind: "fallow" };
  if (record.plantedFrom === null || record.plantedTo === null) return { kind: "unknown-date" };

  const stages = cropStages[record.crop];
  const seasonDays = seasonLengthDays(record.crop);
  const elapsedMin = daysBetween(record.plantedTo, asOf);
  const elapsedMax = daysBetween(record.plantedFrom, asOf);
  const firstStage = stageAt(stages, elapsedMin);
  const lastStage = stageAt(stages, elapsedMax);

  return {
    kind: "estimate",
    elapsedMin,
    elapsedMax,
    stage: firstStage === lastStage ? firstStage : `${firstStage}–${lastStage}`,
    percent: Math.min(Math.round((elapsedMin / seasonDays) * 100), 100),
  };
}

export function describeElapsedDays(progress: CropProgress) {
  if (progress.kind !== "estimate") return null;
  if (progress.elapsedMin === progress.elapsedMax) return `Day ${progress.elapsedMin}`;
  return `Day ${progress.elapsedMin}–${progress.elapsedMax}`;
}

function formatDay(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function describePlantingDate(record: CropRecord) {
  if (record.plantedFrom === null || record.plantedTo === null) return "Unknown";
  if (record.precision === "exact") return formatDay(record.plantedFrom);
  if (record.precision === "month") {
    return new Date(record.plantedFrom).toLocaleDateString("en-GB", {
      month: "long",
      timeZone: "UTC",
    });
  }
  return `~${formatDay(record.plantedFrom)} – ${formatDay(record.plantedTo)}`;
}
