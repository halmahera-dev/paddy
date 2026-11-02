"use client";

import type { GeoJSONSource } from "maplibre-gl";
import { useEffect } from "react";

import { MapMarker, MarkerContent, useMap } from "@/components/ui/map";
import type { PublicBowl } from "@/features/bowls/bowls-queries";
import { firstSymbolLayerId, themeColor } from "@/features/nisar/components/nisar-layers";
import { cn } from "@/lib/utils";

const sourceId = "landas-bowls";
const maxDropMeters = 2;
const circleSteps = 48;
const metersPerDegree = 111_320;

export function dropMeters(bowl: PublicBowl, years: number) {
  return (bowl.rateAfterBanMmYr * years) / 1000;
}

function circle(center: [number, number], radiusM: number) {
  const [longitude, latitude] = center;
  const latitudeRadius = radiusM / metersPerDegree;
  const longitudeRadius = latitudeRadius / Math.cos((latitude * Math.PI) / 180);
  const ring = Array.from({ length: circleSteps + 1 }, function toPoint(_, step) {
    const angle = (step / circleSteps) * Math.PI * 2;
    return [longitude + longitudeRadius * Math.cos(angle), latitude + latitudeRadius * Math.sin(angle)];
  });
  return { type: "Polygon" as const, coordinates: [ring] };
}

function toFeatureCollection(bowls: PublicBowl[], years: number): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: bowls.map((bowl) => ({
      type: "Feature",
      properties: { id: bowl.id, drop: dropMeters(bowl, years) },
      geometry: circle(bowl.center, bowl.radiusM),
    })),
  };
}

export function BowlLayer({
  bowls,
  years,
  selectedBowlId,
  onSelect,
}: {
  bowls: PublicBowl[];
  years: number;
  selectedBowlId: string | null;
  onSelect: (bowlId: string) => void;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }
    const data = toFeatureCollection(bowls, years);
    const source = map.getSource<GeoJSONSource>(sourceId);
    if (source) {
      source.setData(data);
      return;
    }
    map.addSource(sourceId, { type: "geojson", data });
    map.addLayer(
      {
        id: `${sourceId}-fill`,
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
      firstSymbolLayerId(map),
    );
    map.addLayer(
      {
        id: `${sourceId}-line`,
        type: "line",
        source: sourceId,
        paint: { "line-color": themeColor("--chart-4"), "line-width": 1 },
      },
      firstSymbolLayerId(map),
    );
  }, [map, isLoaded, bowls, years]);

  useEffect(() => {
    return function removeBowls() {
      if (!map?.getStyle()) {
        return;
      }
      for (const layerId of [`${sourceId}-fill`, `${sourceId}-line`]) {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map]);

  return bowls.map((bowl) => (
    <MapMarker
      key={bowl.id}
      longitude={bowl.center[0]}
      latitude={bowl.center[1]}
      onClick={() => onSelect(bowl.id)}
    >
      <MarkerContent>
        <span
          className={cn(
            "rounded-full border bg-card px-2 py-0.5 text-xs whitespace-nowrap shadow-sm transition-colors duration-160 ease-out",
            bowl.id === selectedBowlId && "border-brand text-brand-text",
          )}
        >
          {bowl.name} −{dropMeters(bowl, years).toFixed(2)} m
        </span>
      </MarkerContent>
    </MapMarker>
  ));
}

export function FlyToBowl({ bowl }: { bowl: PublicBowl | null }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !bowl) {
      return;
    }
    const camera = { center: bowl.center, zoom: 14, pitch: 55 };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      map.jumpTo(camera);
      return;
    }
    map.flyTo({ ...camera, duration: 2400, essential: true });
  }, [map, isLoaded, bowl]);

  return null;
}
