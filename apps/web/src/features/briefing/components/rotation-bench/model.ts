export type Crop = "rice" | "maize" | "soybean";
export type Plan = [Crop, Crop, Crop];

export const CROPS: Crop[] = ["rice", "maize", "soybean"];

export const SEASONS = [
  { name: "Rainy", months: "Nov to Feb" },
  { name: "Early dry", months: "Mar to Jun" },
  { name: "Late dry", months: "Jul to Oct" },
];

// Same numbers as rotation-explorer.tsx: normal season rain and crop water need, in mm.
export const seasonRain = [1200, 600, 150];
export const cropNeed: Record<Crop, number[]> = {
  rice: [1000, 900, 1000],
  maize: [450, 500, 500],
  soybean: [350, 400, 400],
};

export const GAUGE_MAX_MM = 1200;
export const SOIL_MOISTURE = ["wet", "medium", "dry"];
export const MOISTURE_LEVEL = [1, 0.6, 0.28];

// Illustrative soil nitrogen change per season.
export const nitrogenChange: Record<Crop, number> = { rice: -1, maize: -2, soybean: 2 };
export const NITROGEN_LIMIT = 6;

export const REST_PLAN: Plan = ["rice", "maize", "soybean"];
export const TOUR_PLANS: Plan[] = [
  ["rice", "rice", "rice"],
  ["rice", "rice", "soybean"],
  ["rice", "maize", "soybean"],
];

const cropName: Record<Crop, string> = { rice: "Rice", maize: "Maize", soybean: "Soy" };

export function rainCover(crop: Crop, seasonIndex: number) {
  const cover = (seasonRain[seasonIndex]! / cropNeed[crop][seasonIndex]!) * 100;
  return Math.min(Math.round(cover), 100);
}

export function nitrogenBalance(plan: Plan) {
  const total = plan.reduce((sum, crop) => sum + nitrogenChange[crop], 0);
  return Math.max(-NITROGEN_LIMIT, Math.min(NITROGEN_LIMIT, total));
}

export function nextCrop(crop: Crop): Crop {
  return CROPS[(CROPS.indexOf(crop) + 1) % CROPS.length]!;
}

export function turnsBetween(from: Crop, to: Crop) {
  return (CROPS.indexOf(to) - CROPS.indexOf(from) + CROPS.length) % CROPS.length;
}

export function readoutOf(plan: Plan) {
  const names = plan.map((crop) => cropName[crop]).join(" → ");
  const covers = plan.map((crop, index) => rainCover(crop, index)).join(" · ");
  return `${names} · rain covers ${covers}%`;
}

export function trayLabel(plan: Plan, seasonIndex: number) {
  const { name, months } = SEASONS[seasonIndex]!;
  const crop = plan[seasonIndex]!;
  return `${name} season, ${months}: ${crop}. Normal rain covers ${rainCover(crop, seasonIndex)}% of its water need. Press to change the crop.`;
}
