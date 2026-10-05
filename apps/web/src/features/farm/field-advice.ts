import type { Farm } from "./farm-queries";

import { cropName } from "./crop-progress";

export type FieldAdvice = {
  needsAttention: boolean;
  headline: string;
  detail: string;
  action: string | null;
};

// A week is dry when rain meets less than a quarter of the crop's water need.
const dryWeekShare = 0.25;

function trailingDryWeeks(farm: Farm) {
  const dryWeeks = [];
  for (const week of farm.weeklyWater.toReversed()) {
    if (week.demandMm === null) break;
    const demandMidMm = (week.demandMm[0] + week.demandMm[1]) / 2;
    if (week.rainMm >= demandMidMm * dryWeekShare) break;
    dryWeeks.push(week);
  }
  return dryWeeks;
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export function adviseField(farm: Farm): FieldAdvice {
  const newAlert = farm.alerts.find((alert) => alert.status === "new");
  const dryWeeks = trailingDryWeeks(farm);

  if (newAlert && dryWeeks.length > 0) {
    let rainMm = 0;
    let demandLowMm = 0;
    let demandHighMm = 0;
    for (const week of dryWeeks) {
      rainMm += week.rainMm;
      demandLowMm += week.demandMm?.[0] ?? 0;
      demandHighMm += week.demandMm?.[1] ?? 0;
    }
    return {
      needsAttention: true,
      headline: `Dry for ${plural(dryWeeks.length, "week")}`,
      detail: `Rain gave ${rainMm} mm. Your ${cropName[farm.cropRecord.crop].toLowerCase()} needed about ${demandLowMm}–${demandHighMm} mm.`,
      action: `${newAlert.action} for standing water and dry, cracked soil.`,
    };
  }

  if (newAlert) {
    return {
      needsAttention: true,
      headline: newAlert.title,
      detail: `Seen ${newAlert.observed}.`,
      action: `${newAlert.action}.`,
    };
  }

  const { rain30dMm, normalRain30dMm } = farm.conditions;
  return {
    needsAttention: false,
    headline: "No problems found",
    detail: `Rain in the last 30 days was ${rain30dMm} mm. Normal is ${normalRain30dMm} mm.`,
    action: null,
  };
}

export function byAttentionFirst(left: Farm, right: Farm) {
  return Number(adviseField(right).needsAttention) - Number(adviseField(left).needsAttention);
}
