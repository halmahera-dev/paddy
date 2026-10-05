import "server-only";

// Sample data. Replace with Neon farm records and stored NASA area conditions.
export type Crop = "rice" | "maize" | "soybean" | "fallow";
export type DatePrecision = "exact" | "week" | "month" | "unknown";
export type AlertStatus = "new" | "acknowledged" | "recovered";

export type CropRecord = {
  crop: Crop;
  plantedFrom: string | null;
  plantedTo: string | null;
  precision: DatePrecision;
};

export type WeeklyWater = {
  week: string;
  startsOn: string;
  rainMm: number;
  demandMm: [number, number] | null;
};

export type FarmAlert = {
  id: string;
  title: string;
  status: AlertStatus;
  observed: string;
  observedFrom: string;
  observedTo: string;
  scale: string;
  action: string;
};

export type PlanSeason = {
  season: string;
  crop: Crop;
  demandMm: number;
  rainToDemandPercent: number | null;
};

export type Farm = {
  id: string;
  name: string;
  subdistrict: string;
  province: string;
  asOf: string;
  field: string;
  outline: [longitude: number, latitude: number][];
  soil: string;
  cropRecord: CropRecord;
  conditions: {
    rain30dMm: number;
    normalRain30dMm: number;
    rainObserved: string;
    rootZoneMoisture: number | null;
    normalRootZoneMoisture: number;
    moistureObserved: string;
    maxTemperatureC: number;
    normalMaxTemperatureC: number;
    temperatureObserved: string;
  };
  season: string;
  weeklyWater: WeeklyWater[];
  alerts: FarmAlert[];
  plan: { seasons: PlanSeason[]; baselineDemandMm: number } | null;
};

const farms: Farm[] = [
  {
    id: "c20f4506-bc06-4b0b-9e8d-b22945dadbb6",
    name: "Sawah Pak Budi",
    subdistrict: "Indramayu",
    province: "West Java",
    asOf: "2026-10-02",
    field: "FTW predicted outline (2025), not a legal boundary",
    outline: [
      [108.3391, -6.3468],
      [108.3412, -6.3466],
      [108.3414, -6.3481],
      [108.3393, -6.3484],
    ],
    soil: "Clay (liat)",
    cropRecord: {
      crop: "rice",
      plantedFrom: "2026-08-15",
      plantedTo: "2026-08-21",
      precision: "week",
    },
    conditions: {
      rain30dMm: 19,
      normalRain30dMm: 42,
      rainObserved: "1 Oct",
      rootZoneMoisture: 0.22,
      normalRootZoneMoisture: 0.29,
      moistureObserved: "29 Sep",
      maxTemperatureC: 33.4,
      normalMaxTemperatureC: 32.2,
      temperatureObserved: "30 Sep",
    },
    season: "Dry season 2",
    weeklyWater: [
      { week: "1 Jul", startsOn: "2026-07-01", rainMm: 12, demandMm: null },
      { week: "8 Jul", startsOn: "2026-07-08", rainMm: 6, demandMm: null },
      { week: "15 Jul", startsOn: "2026-07-15", rainMm: 0, demandMm: null },
      { week: "22 Jul", startsOn: "2026-07-22", rainMm: 4, demandMm: null },
      { week: "29 Jul", startsOn: "2026-07-29", rainMm: 0, demandMm: null },
      { week: "5 Aug", startsOn: "2026-08-05", rainMm: 2, demandMm: null },
      { week: "12 Aug", startsOn: "2026-08-12", rainMm: 8, demandMm: [5, 20] },
      { week: "19 Aug", startsOn: "2026-08-19", rainMm: 15, demandMm: [25, 32] },
      { week: "26 Aug", startsOn: "2026-08-26", rainMm: 62, demandMm: [30, 34] },
      { week: "2 Sep", startsOn: "2026-09-02", rainMm: 12, demandMm: [32, 36] },
      { week: "9 Sep", startsOn: "2026-09-09", rainMm: 6, demandMm: [34, 38] },
      { week: "16 Sep", startsOn: "2026-09-16", rainMm: 1, demandMm: [36, 41] },
      { week: "23 Sep", startsOn: "2026-09-23", rainMm: 0, demandMm: [38, 44] },
      { week: "30 Sep", startsOn: "2026-09-30", rainMm: 0, demandMm: [40, 46] },
    ],
    alerts: [
      {
        id: "dry-2026-09-12",
        title: "Dry conditions",
        status: "new",
        observed: "12 Sep – 1 Oct",
        observedFrom: "2026-09-12",
        observedTo: "2026-10-01",
        scale: "Area · 10 km rain, 9 km moisture",
        action: "Check the field",
      },
      {
        id: "heavy-rain-2026-08-27",
        title: "Heavy recent rain",
        status: "recovered",
        observed: "27–29 Aug",
        observedFrom: "2026-08-27",
        observedTo: "2026-08-29",
        scale: "Area · 10 km",
        action: "Check the field",
      },
      {
        id: "low-moisture-2026-08-02",
        title: "Low root-zone moisture",
        status: "recovered",
        observed: "2–10 Aug",
        observedFrom: "2026-08-02",
        observedTo: "2026-08-10",
        scale: "Area · 9 km",
        action: "Review the next planting",
      },
    ],
    plan: {
      seasons: [
        { season: "Wet season", crop: "rice", demandMm: 1000, rainToDemandPercent: 100 },
        { season: "Dry season 1", crop: "rice", demandMm: 900, rainToDemandPercent: 71 },
        { season: "Dry season 2", crop: "soybean", demandMm: 400, rainToDemandPercent: 34 },
      ],
      baselineDemandMm: 2900,
    },
  },
  {
    id: "5b0dc87b-e6a5-4e9f-b7b3-ef154d775fe3",
    name: "Kebun Bandung",
    subdistrict: "Bandung",
    province: "West Java",
    asOf: "2026-10-02",
    field: "Map point · illustrative shape",
    outline: [
      [107.6183, -6.9168],
      [107.6199, -6.9168],
      [107.6199, -6.9181],
      [107.6183, -6.9181],
    ],
    soil: "Unknown",
    cropRecord: {
      crop: "maize",
      plantedFrom: "2026-08-01",
      plantedTo: "2026-08-31",
      precision: "month",
    },
    conditions: {
      rain30dMm: 64,
      normalRain30dMm: 58,
      rainObserved: "1 Oct",
      rootZoneMoisture: null,
      normalRootZoneMoisture: 0.27,
      moistureObserved: "21 Sep",
      maxTemperatureC: 31.1,
      normalMaxTemperatureC: 31.4,
      temperatureObserved: "30 Sep",
    },
    season: "Dry season 2",
    weeklyWater: [
      { week: "1 Jul", startsOn: "2026-07-01", rainMm: 20, demandMm: null },
      { week: "8 Jul", startsOn: "2026-07-08", rainMm: 14, demandMm: null },
      { week: "15 Jul", startsOn: "2026-07-15", rainMm: 9, demandMm: null },
      { week: "22 Jul", startsOn: "2026-07-22", rainMm: 11, demandMm: null },
      { week: "29 Jul", startsOn: "2026-07-29", rainMm: 5, demandMm: [3, 15] },
      { week: "5 Aug", startsOn: "2026-08-05", rainMm: 8, demandMm: [3, 18] },
      { week: "12 Aug", startsOn: "2026-08-12", rainMm: 12, demandMm: [5, 22] },
      { week: "19 Aug", startsOn: "2026-08-19", rainMm: 7, demandMm: [8, 26] },
      { week: "26 Aug", startsOn: "2026-08-26", rainMm: 18, demandMm: [10, 30] },
      { week: "2 Sep", startsOn: "2026-09-02", rainMm: 15, demandMm: [14, 33] },
      { week: "9 Sep", startsOn: "2026-09-09", rainMm: 10, demandMm: [18, 35] },
      { week: "16 Sep", startsOn: "2026-09-16", rainMm: 22, demandMm: [22, 37] },
      { week: "23 Sep", startsOn: "2026-09-23", rainMm: 14, demandMm: [26, 38] },
      { week: "30 Sep", startsOn: "2026-09-30", rainMm: 18, demandMm: [30, 38] },
    ],
    alerts: [],
    plan: null,
  },
];

export async function getFarms() {
  return farms;
}

export async function getFarm(farmId: string) {
  return farms.find((farm) => farm.id === farmId);
}
