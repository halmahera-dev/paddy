"use client";

import type { ExpressionSpecification, GeoJSONSource, Map as MapLibreMap, MapLayerMouseEvent, MapMouseEvent } from "maplibre-gl";
import { useEffect, useEffectEvent } from "react";

import { useMap } from "@/components/ui/map";
import type { PublicBowl } from "@/features/bowls/bowls-queries";
import { firstSymbolLayerId, themeColor } from "@/features/nisar/components/nisar-layers";

const sourceId = "landas-bowls";
const glowLayerId = `${sourceId}-glow`;
const ringLayerId = `${sourceId}-rings`;
const tierLayerId = `${sourceId}-tiers`;
const selectedTierLayerId = `${sourceId}-tiers-selected`;
const layerIds = [glowLayerId, ringLayerId, tierLayerId, selectedTierLayerId];
const clickLayerIds = [glowLayerId, tierLayerId, selectedTierLayerId];

export const slowRateMmYr = 20;
export const middleRateMmYr = 55;
export const fastRateMmYr = 100;

function rateColorExpression() {
  return [
    "interpolate",
    ["linear"],
    ["get", "rate"],
    slowRateMmYr,
    themeColor("--rate-slow"),
    middleRateMmYr,
    themeColor("--rate-middle"),
    fastRateMmYr,
    themeColor("--rate-fast"),
  ] as never;
}

const emphasisFadeMs = 300;
const circleSteps = 48;
const metersPerDegree = 111_320;
const stackRadiusShare = 0.7;
const stackBaseHeightM = 260;
const stackHeightPerDropM = 700;
const tiers = [
  { radiusShare: 1, from: 0, to: 0.35 },
  { radiusShare: 0.72, from: 0.35, to: 0.62 },
  { radiusShare: 0.46, from: 0.62, to: 0.85 },
  { radiusShare: 0.2, from: 0.85, to: 1 },
];
const ringRadiusShares = [1.5, 2, 2.6];
const glowRadiusShare = 2.2;

export function dropMeters(bowl: PublicBowl, years: number, withBan: boolean) {
  const rateMmYr = withBan ? bowl.rateAfterBanMmYr : bowl.rateBeforeBanMmYr;
  return (rateMmYr * years) / 1000;
}

export function predictionFor(
  bowlId: string,
  selectedBowlId: string | null,
  chosen: { years: number; withBan: boolean },
  baselineYears: number,
) {
  return bowlId === selectedBowlId ? chosen : { years: baselineYears, withBan: true };
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

function bowlFeatures(
  bowl: PublicBowl,
  years: number,
  withBan: boolean,
  isSelected: boolean,
): GeoJSON.Feature[] {
  const rate = withBan ? bowl.rateAfterBanMmYr : bowl.rateBeforeBanMmYr;
  const stackRadiusM = bowl.radiusM * stackRadiusShare;
  const stackHeightM = stackBaseHeightM + dropMeters(bowl, years, withBan) * stackHeightPerDropM;
  const properties = { id: bowl.id, rate, selected: isSelected ? 1 : 0 };

  const glow: GeoJSON.Feature = {
    type: "Feature",
    properties: { ...properties, kind: "glow" },
    geometry: circle(bowl.center, stackRadiusM * glowRadiusShare),
  };
  const rings = ringRadiusShares.map((share): GeoJSON.Feature => ({
    type: "Feature",
    properties: { ...properties, kind: "ring" },
    geometry: circle(bowl.center, stackRadiusM * share),
  }));
  const stack = tiers.map((tier): GeoJSON.Feature => ({
    type: "Feature",
    properties: {
      ...properties,
      kind: "tier",
      base: tier.from * stackHeightM,
      top: tier.to * stackHeightM,
    },
    geometry: circle(bowl.center, stackRadiusM * tier.radiusShare),
  }));
  return [glow, ...rings, ...stack];
}

function toFeatureCollection(
  bowls: PublicBowl[],
  chosen: { years: number; withBan: boolean },
  baselineYears: number,
  selectedBowlId: string | null,
): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: bowls.flatMap((bowl) => {
      const prediction = predictionFor(bowl.id, selectedBowlId, chosen, baselineYears);
      return bowlFeatures(bowl, prediction.years, prediction.withBan, bowl.id === selectedBowlId);
    }),
  };
}

function ofKind(kind: string): ExpressionSpecification {
  return ["==", ["get", "kind"], kind];
}

const isSelected: ExpressionSpecification = ["==", ["get", "selected"], 1];

function applyEmphasis(map: MapLibreMap, hasSelection: boolean) {
  const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : emphasisFadeMs;
  map.setPaintProperty(tierLayerId, "fill-extrusion-opacity-transition", { duration, delay: 0 });
  const glowOpacity = ["case", isSelected, 0.4, hasSelection ? 0.06 : 0.18] as ExpressionSpecification;
  const ringOpacity = ["case", isSelected, 1, hasSelection ? 0.15 : 0.3] as ExpressionSpecification;
  map.setPaintProperty(glowLayerId, "fill-opacity", glowOpacity);
  map.setPaintProperty(ringLayerId, "line-opacity", ringOpacity);
  map.setPaintProperty(tierLayerId, "fill-extrusion-opacity", hasSelection ? 0.3 : 0.92);
}

export function BowlLayer({
  bowls,
  years,
  withBan,
  baselineYears,
  selectedBowlId,
  onSelect,
  onDeselect,
}: {
  bowls: PublicBowl[];
  years: number;
  withBan: boolean;
  baselineYears: number;
  selectedBowlId: string | null;
  onSelect: (bowlId: string) => void;
  onDeselect: () => void;
}) {
  const { map, isLoaded } = useMap();
  const selectBowl = useEffectEvent(onSelect);
  const clearSelection = useEffectEvent(() => {
    if (selectedBowlId !== null) {
      onDeselect();
    }
  });

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }
    const data = toFeatureCollection(bowls, { years, withBan }, baselineYears, selectedBowlId);
    const source = map.getSource<GeoJSONSource>(sourceId);
    if (source) {
      source.setData(data);
      applyEmphasis(map, selectedBowlId !== null);
      return;
    }
    map.addSource(sourceId, { type: "geojson", data });
    const beforeLayerId = firstSymbolLayerId(map);
    map.addLayer(
      {
        id: glowLayerId,
        type: "fill",
        source: sourceId,
        filter: ofKind("glow"),
        paint: {
          "fill-color": rateColorExpression(),
          "fill-opacity": 0.18,
        },
      },
      beforeLayerId,
    );
    map.addLayer(
      {
        id: ringLayerId,
        type: "line",
        source: sourceId,
        filter: ofKind("ring"),
        paint: {
          "line-color": ["case", isSelected, themeColor("--foreground"), rateColorExpression()] as ExpressionSpecification,
          "line-width": ["case", isSelected, 3, 1],
          "line-opacity": 0.3,
        },
      },
      beforeLayerId,
    );
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.addLayer(
      {
        id: tierLayerId,
        type: "fill-extrusion",
        source: sourceId,
        filter: ["all", ofKind("tier"), ["!", isSelected]],
        paint: {
          "fill-extrusion-color": rateColorExpression(),
          "fill-extrusion-base": ["get", "base"],
          "fill-extrusion-height": ["get", "top"],
          "fill-extrusion-opacity": 0.92,
          "fill-extrusion-opacity-transition": { duration: isReducedMotion ? 0 : 300, delay: 0 },
        },
      },
      beforeLayerId,
    );
    map.addLayer(
      {
        id: selectedTierLayerId,
        type: "fill-extrusion",
        source: sourceId,
        filter: ["all", ofKind("tier"), isSelected],
        paint: {
          "fill-extrusion-color": rateColorExpression(),
          "fill-extrusion-base": ["get", "base"],
          "fill-extrusion-height": ["get", "top"],
          "fill-extrusion-opacity": 1,
        },
      },
      beforeLayerId,
    );
    applyEmphasis(map, selectedBowlId !== null);
  }, [map, isLoaded, bowls, years, withBan, baselineYears, selectedBowlId]);

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }
    function handleClick(event: MapLayerMouseEvent) {
      const bowlId = event.features?.[0]?.properties?.id;
      if (typeof bowlId === "string") {
        selectBowl(bowlId);
      }
    }
    function handleMapClick(event: MapMouseEvent) {
      if (event.target.queryRenderedFeatures(event.point, { layers: clickLayerIds }).length === 0) {
        clearSelection();
      }
    }
    map.on("click", handleMapClick);
    const canvas = map.getCanvas();
    function showPointer() {
      canvas.style.cursor = "pointer";
    }
    function hidePointer() {
      canvas.style.cursor = "";
    }
    for (const layerId of clickLayerIds) {
      map.on("click", layerId, handleClick);
      map.on("mouseenter", layerId, showPointer);
      map.on("mouseleave", layerId, hidePointer);
    }
    return () => {
      map.off("click", handleMapClick);
      for (const layerId of clickLayerIds) {
        map.off("click", layerId, handleClick);
        map.off("mouseenter", layerId, showPointer);
        map.off("mouseleave", layerId, hidePointer);
      }
      hidePointer();
    };
  }, [map, isLoaded]);

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

  return null;
}
