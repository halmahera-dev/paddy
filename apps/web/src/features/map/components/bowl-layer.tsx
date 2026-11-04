"use client";

import type { GeoJSONSource } from "maplibre-gl";
import { useEffect } from "react";

import { MapMarker, MarkerContent, useMap } from "@/components/ui/map";
import type { PublicBowl } from "@/features/bowls/bowls-queries";
import { firstSymbolLayerId, themeColor } from "@/features/nisar/components/nisar-layers";
import { cn } from "@/lib/utils";

const sourceId = "landas-bowls";
const layerIds = [`${sourceId}-fill`, `${sourceId}-line`, `${sourceId}-water`];
export const maxDropMeters = 3;
export const waterExaggeration = 5;
const circleSteps = 48;
const metersPerDegree = 111_320;

export function dropMeters(bowl: PublicBowl, years: number, withBan: boolean) {
  const rateMmYr = withBan ? bowl.rateAfterBanMmYr : bowl.rateBeforeBanMmYr;
  return (rateMmYr * years) / 1000;
}

function circle(center: [number, number], radiusM: number) {
  const [longitude, latitude] = center;
  const latitudeRadius = radiusM / metersPerDegree;
  const longitudeRadius = latitudeRadius / Math.cos((latitude * Math.PI) / 180);
  const ring = Array.from({ length: circleSteps + 1 }, (_, step) => {
    const angle = (step / circleSteps) * Math.PI * 2;
    return [longitude + longitudeRadius * Math.cos(angle), latitude + latitudeRadius * Math.sin(angle)];
  });
  return { type: "Polygon" as const, coordinates: [ring] };
}

function toFeatureCollection(bowls: PublicBowl[], years: number, withBan: boolean): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: bowls.map((bowl) => ({
      type: "Feature",
      properties: { id: bowl.id, drop: dropMeters(bowl, years, withBan) },
      geometry: circle(bowl.center, bowl.radiusM),
    })),
  };
}

export function BowlLayer({
  bowls,
  years,
  withBan,
  selectedBowlId,
  onSelect,
}: {
  bowls: PublicBowl[];
  years: number;
  withBan: boolean;
  selectedBowlId: string | null;
  onSelect: (bowlId: string) => void;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }
    const data = toFeatureCollection(bowls, years, withBan);
    const source = map.getSource<GeoJSONSource>(sourceId);
    if (source) {
      source.setData(data);
      return;
    }
    map.addSource(sourceId, { type: "geojson", data });
    const beforeLayerId = firstSymbolLayerId(map);
    map.addLayer(
      {
        id: layerIds[0],
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "drop"],
            0,
            themeColor("--chart-3"),
            maxDropMeters,
            themeColor("--chart-4"),
          ],
          "fill-opacity": 0.45,
        },
      },
      beforeLayerId,
    );
    map.addLayer(
      {
        id: layerIds[1],
        type: "line",
        source: sourceId,
        paint: { "line-color": themeColor("--chart-4"), "line-width": 1 },
      },
      beforeLayerId,
    );
    map.addLayer(
      {
        id: layerIds[2],
        type: "fill-extrusion",
        source: sourceId,
        paint: {
          "fill-extrusion-color": themeColor("--chart-5"),
          "fill-extrusion-height": ["*", ["get", "drop"], waterExaggeration],
          "fill-extrusion-opacity": 0.5,
        },
      },
      beforeLayerId,
    );
  }, [map, isLoaded, bowls, years, withBan]);

  useEffect(() => {
    return () => {
      if (!map?.getStyle()) {
        return;
      }
      for (const layerId of layerIds) {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map]);

  return bowls.map((bowl) => {
    const isSelected = bowl.id === selectedBowlId;
    return (
      <MapMarker key={bowl.id} longitude={bowl.center[0]} latitude={bowl.center[1]}>
        <MarkerContent>
          <button
            type="button"
            aria-pressed={isSelected}
            className={cn(
              "pressable rounded-full border bg-card px-2 py-0.5 text-xs whitespace-nowrap tabular-nums outline-none transition hover:border-input focus-visible:ring-3 focus-visible:ring-ring/40",
              isSelected && "border-brand text-brand-text hover:border-brand",
            )}
            onClick={() => onSelect(bowl.id)}
          >
            {bowl.name} −{dropMeters(bowl, years, withBan).toFixed(2)} m
          </button>
        </MarkerContent>
      </MapMarker>
    );
  });
}
