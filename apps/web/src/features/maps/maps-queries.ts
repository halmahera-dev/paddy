import "server-only";

import { db } from "@paddy-field/db";
import { area } from "@paddy-field/db/schema/area";
import { sql } from "drizzle-orm";

export type AreaProperties = { code: string; name: string; province: string };

export async function getAreaBoundaries(): Promise<
  GeoJSON.FeatureCollection<GeoJSON.MultiPolygon, AreaProperties>
> {
  const rows = await db
    .select({
      code: area.code,
      name: area.name,
      province: area.provinceName,
      geometry: sql<string>`st_asgeojson(${area.displayBoundary}, 4)`,
    })
    .from(area);

  return {
    type: "FeatureCollection",
    features: rows.map(function toFeature(row) {
      return {
        type: "Feature",
        properties: { code: row.code, name: row.name, province: row.province },
        geometry: JSON.parse(row.geometry),
      };
    }),
  };
}
