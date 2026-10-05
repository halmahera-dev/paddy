import { sql } from "drizzle-orm";
import {
  check,
  customType,
  date,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

const point = customType<{ data: string; driverData: string }>({
  dataType() {
    return "geometry(Point, 4326)";
  },
});

const multiPolygon = customType<{ data: string; driverData: string }>({
  dataType() {
    return "geometry(MultiPolygon, 4326)";
  },
});

export const nasaSource = pgEnum("nasa_source", ["imerg_final", "imerg_late", "smap_l4", "power"]);

// The unit is part of the measure name, so a value can never carry the wrong unit.
export const measure = pgEnum("measure", [
  "rain_mm",
  "soil_wetness_m3m3",
  "tmax_c",
  "tmin_c",
  "eto_mm",
]);

export const season = pgEnum("season", ["MH", "MK1", "MK2"]);

export const normalPeriodKind = pgEnum("normal_period_kind", ["season", "month"]);

export const runStatus = pgEnum("run_status", ["running", "succeeded", "failed"]);

export const area = pgTable(
  "area",
  {
    code: text("code").primaryKey(),
    name: text("name").notNull(),
    districtCode: text("district_code").notNull(),
    districtName: text("district_name").notNull(),
    provinceCode: text("province_code").notNull(),
    provinceName: text("province_name").notNull(),
    // ponytail: one boundary release at a time; add release to the key when two must coexist.
    boundaryRelease: text("boundary_release").notNull(),
    boundary: multiPolygon("boundary").notNull(),
    // Simplified as one coverage so neighbors keep shared edges on the map.
    displayBoundary: multiPolygon("display_boundary").notNull(),
    center: point("center").notNull(),
  },
  (table) => [
    index("area_province_idx").on(table.provinceCode),
    index("area_boundary_gist").using("gist", table.boundary),
  ],
);

export const areaCell = pgTable(
  "area_cell",
  {
    areaCode: text("area_code")
      .notNull()
      .references(() => area.code, { onDelete: "cascade" }),
    source: nasaSource("source").notNull(),
    cellId: text("cell_id").notNull(),
    cellCenter: point("cell_center").notNull(),
    areaShare: doublePrecision("area_share").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.areaCode, table.source, table.cellId] }),
    index("area_cell_cell_idx").on(table.source, table.cellId),
  ],
);

export const dataRun = pgTable("data_run", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: nasaSource("source").notNull(),
  product: text("product").notNull(),
  version: text("version").notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  status: runStatus("status").notNull().default("running"),
  granuleCount: integer("granule_count"),
  error: text("error"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  finishedAt: timestamp("finished_at"),
});

export const areaCondition = pgTable(
  "area_condition",
  {
    areaCode: text("area_code")
      .notNull()
      .references(() => area.code, { onDelete: "cascade" }),
    measure: measure("measure").notNull(),
    source: nasaSource("source").notNull(),
    observedOn: date("observed_on").notNull(),
    value: doublePrecision("value").notNull(),
    validCoverage: real("valid_coverage").notNull(),
    qualityFlag: text("quality_flag"),
    version: text("version").notNull(),
    runId: uuid("run_id")
      .notNull()
      .references(() => dataRun.id),
    fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.areaCode, table.measure, table.source, table.observedOn] }),
    index("area_condition_latest_idx").on(table.measure, table.observedOn),
  ],
);

export const areaNormal = pgTable(
  "area_normal",
  {
    areaCode: text("area_code")
      .notNull()
      .references(() => area.code, { onDelete: "cascade" }),
    measure: measure("measure").notNull(),
    source: nasaSource("source").notNull(),
    periodKind: normalPeriodKind("period_kind").notNull(),
    season: season("season"),
    month: smallint("month"),
    mean: doublePrecision("mean").notNull(),
    standardDeviation: doublePrecision("standard_deviation"),
    firstYear: smallint("first_year").notNull(),
    lastYear: smallint("last_year").notNull(),
    yearCount: smallint("year_count").notNull(),
    validCoverage: real("valid_coverage").notNull(),
    method: text("method").notNull(),
    version: text("version").notNull(),
    runId: uuid("run_id")
      .notNull()
      .references(() => dataRun.id),
  },
  (table) => [
    unique("area_normal_period_key")
      .on(table.areaCode, table.measure, table.source, table.periodKind, table.season, table.month)
      .nullsNotDistinct(),
    check(
      "area_normal_one_period",
      sql`(${table.periodKind} = 'season' and ${table.season} is not null and ${table.month} is null)
        or (${table.periodKind} = 'month' and ${table.month} between 1 and 12 and ${table.season} is null)`,
    ),
  ],
);
