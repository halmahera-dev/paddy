// Illustrative values. Replace with stored NASA season summaries later.
export type SeasonKey = "rainy" | "dry" | "drought";
export type Crop = "rice" | "maize" | "soybean" | "fallow";

export const seasons: { key: SeasonKey; label: string; months: string; color: string }[] = [
  { key: "rainy", label: "Rainy", months: "Nov–Feb", color: "var(--chart-1)" },
  { key: "dry", label: "Dry", months: "Mar–Jun", color: "var(--chart-2)" },
  { key: "drought", label: "Drought", months: "Jul–Oct", color: "var(--chart-3)" },
];

export const monthLabels = ["N", "D", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O"];

// Order starts at November so months line up with the season ring.
export const riceNeedByMonth = [250, 250, 250, 250, 225, 225, 225, 225, 250, 250, 250, 250];

export const cropNeedBySeason: Record<Crop, number[]> = {
  rice: [1000, 900, 1000],
  maize: [450, 500, 500],
  soybean: [350, 400, 400],
  fallow: [0, 0, 0],
};

export const cropShortName: Record<Crop, string> = {
  rice: "Rice",
  maize: "Maize",
  soybean: "Soy",
  fallow: "Rest",
};

export const plans: { id: string; crops: Crop[] }[] = [
  { id: "rrr", crops: ["rice", "rice", "rice"] },
  { id: "rrs", crops: ["rice", "rice", "soybean"] },
  { id: "rms", crops: ["rice", "maize", "soybean"] },
  { id: "rsf", crops: ["rice", "soybean", "fallow"] },
];

export const areas = [
  {
    id: "32.12.15",
    name: "Indramayu",
    province: "West Java",
    rainByMonth: [180, 300, 320, 260, 220, 150, 90, 60, 30, 15, 10, 20],
    rainLast24hMm: 0,
    temperatureC: 31.4,
    surfaceMoisture: 0.087,
    normalSurfaceMoisture: 0.21,
    rootZoneMoisture: 0.157,
    normalRootZoneMoisture: 0.29,
    clearSkyShare: 0.74,
  },
  {
    id: "34.04.13",
    name: "Sleman",
    province: "Special Region of Yogyakarta",
    rainByMonth: [260, 340, 380, 320, 300, 240, 120, 70, 40, 20, 30, 80],
    rainLast24hMm: 3,
    temperatureC: 29.6,
    surfaceMoisture: 0.181,
    normalSurfaceMoisture: 0.2,
    rootZoneMoisture: 0.221,
    normalRootZoneMoisture: 0.27,
    clearSkyShare: 0.61,
  },
  {
    id: "35.10.16",
    name: "Banyuwangi",
    province: "East Java",
    rainByMonth: [200, 260, 280, 240, 190, 130, 80, 50, 30, 20, 20, 40],
    rainLast24hMm: 9,
    temperatureC: 28.1,
    surfaceMoisture: 0.174,
    normalSurfaceMoisture: 0.19,
    rootZoneMoisture: 0.238,
    normalRootZoneMoisture: 0.26,
    clearSkyShare: 0.52,
  },
];

export type Area = (typeof areas)[number];

export function findArea(areaId: string | undefined) {
  return areas.find((area) => area.id === areaId) ?? areas[0];
}

export function seasonRainMm(area: Area, seasonIndex: number) {
  const months = area.rainByMonth.slice(seasonIndex * 4, seasonIndex * 4 + 4);
  return months.reduce((sum, mm) => sum + mm, 0);
}

export function rainCover(area: Area, crop: Crop, seasonIndex: number) {
  if (crop === "fallow") return null;
  const cover = seasonRainMm(area, seasonIndex) / cropNeedBySeason[crop][seasonIndex];
  return Math.min(Math.round(cover * 100), 100);
}
