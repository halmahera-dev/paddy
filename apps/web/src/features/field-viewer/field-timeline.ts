import type { CropRecord, Farm, FarmAlert, WeeklyWater } from "@/features/farm/farm-queries";

import { daysBetween, estimateCropProgress, seasonLengthDays } from "@/features/farm/crop-progress";

export type FieldMoment = {
  date: string;
  week: WeeklyWater;
  wetness: number;
  stage: string;
  activeAlerts: FarmAlert[];
};

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function seasonStart(farm: Farm) {
  return farm.weeklyWater[0].startsOn;
}

export function seasonSpanDays(farm: Farm) {
  return daysBetween(seasonStart(farm), farm.asOf);
}

export function dateAt(farm: Farm, day: number) {
  const time = Date.parse(seasonStart(farm)) + Math.floor(day) * millisecondsPerDay;
  return new Date(time).toISOString().slice(0, 10);
}

// Before planting there is no crop demand, so compare rain with typical weekly evaporation.
const bareSoilWeeklyDemandMm = 25;

function weekWetness(week: WeeklyWater) {
  const demandMm = week.demandMm
    ? (week.demandMm[0] + week.demandMm[1]) / 2
    : bareSoilWeeklyDemandMm;
  return Math.min(week.rainMm / demandMm, 1.5) / 1.5;
}

function stageOn(record: CropRecord, date: string) {
  if (record.plantedFrom !== null && date < record.plantedFrom) return "Before planting";
  const progress = estimateCropProgress(record, date);
  if (progress.kind === "fallow") return "Fallow";
  if (progress.kind === "unknown-date") return "Planting date unknown";
  return progress.stage;
}

export function momentAt(farm: Farm, day: number): FieldMoment {
  const lastWeek = farm.weeklyWater.length - 1;
  const weekIndex = Math.min(Math.max(Math.floor(day / 7), 0), lastWeek);
  const nextWeekIndex = Math.min(weekIndex + 1, lastWeek);
  const weekShare = (day % 7) / 7;
  const week = farm.weeklyWater[weekIndex];
  const wetness =
    weekWetness(week) * (1 - weekShare) + weekWetness(farm.weeklyWater[nextWeekIndex]) * weekShare;
  const date = dateAt(farm, day);

  return {
    date,
    week,
    wetness,
    stage: stageOn(farm.cropRecord, date),
    activeAlerts: farm.alerts.filter(function isActive(alert) {
      return alert.observedFrom <= date && date <= alert.observedTo;
    }),
  };
}

// A rough planting date stays a range: each row is planted on its own day inside the range.
export function rowGrowth(farm: Farm, day: number, rowShare: number) {
  const record = farm.cropRecord;
  if (record.crop === "fallow" || record.plantedFrom === null || record.plantedTo === null) {
    return null;
  }
  const plantingSpanDays = daysBetween(record.plantedFrom, record.plantedTo);
  const plantedDay =
    daysBetween(seasonStart(farm), record.plantedFrom) + rowShare * plantingSpanDays;
  const elapsedDays = day - plantedDay;
  if (elapsedDays < 0) return null;
  return Math.min(elapsedDays / seasonLengthDays(record.crop), 1);
}
