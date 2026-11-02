"use client";

import type { Coordinates, ImageSource, Map as MapLibreMap } from "maplibre-gl";

import { useEffect } from "react";

import type { InterferogramPair } from "@/features/nisar/nisar-catalog";

import { useMap } from "@/components/ui/map";
import { resolveColor } from "@/lib/dither";

const interferogramId = "nisar-interferogram";
const buildingsId = "buildings-3d";

export function themeColor(variable: string) {
  const [red, green, blue, alpha] = resolveColor(variable);
  return `rgba(${red * 255}, ${green * 255}, ${blue * 255}, ${alpha})`;
}

export function firstSymbolLayerId(map: MapLibreMap) {
  return map.getStyle().layers.find((layer) => layer.type === "symbol")?.id;
}

export function InterferogramLayer({ pair }: { pair: InterferogramPair }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }
    const coordinates = pair.corners as Coordinates;
    const source = map.getSource<ImageSource>(interferogramId);
    if (source) {
      source.updateImage({ url: pair.image, coordinates });
      return;
    }
    map.addSource(interferogramId, { type: "image", url: pair.image, coordinates });
    map.addLayer(
      {
        id: interferogramId,
        type: "raster",
        source: interferogramId,
        paint: { "raster-opacity": 0.8, "raster-fade-duration": 0 },
      },
      firstSymbolLayerId(map),
    );
  }, [map, isLoaded, pair]);

  useEffect(() => {
    return function removeInterferogram() {
      if (!map?.getStyle()) {
        return;
      }
      if (map.getLayer(interferogramId)) {
        map.removeLayer(interferogramId);
      }
      if (map.getSource(interferogramId)) {
        map.removeSource(interferogramId);
      }
    };
  }, [map]);

  return null;
}

// Building heights come from the Carto (Protomaps schema) tiles in the dark basemap.
export function BuildingsLayer() {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || map.getLayer(buildingsId)) {
      return;
    }
    map.addLayer(
      {
        id: buildingsId,
        type: "fill-extrusion",
        source: "protomaps",
        "source-layer": "buildings",
        minzoom: 12,
        paint: {
          "fill-extrusion-color": themeColor("--rule"),
          "fill-extrusion-height": ["coalesce", ["get", "height"], 6],
          "fill-extrusion-base": ["coalesce", ["get", "min_height"], 0],
          "fill-extrusion-opacity": 0.92,
        },
      },
      firstSymbolLayerId(map),
    );
  }, [map, isLoaded]);

  return null;
}
