"use client";

import { Label } from "@paddy-field/ui/components/label";
import { Switch } from "@paddy-field/ui/components/switch";
import Link from "next/link";
import { useState } from "react";

import type { AreaProperties } from "@/features/maps/maps-queries";

import {
  Map,
  MapControls,
  MapGeoJSON,
  MapMarker,
  MarkerContent,
  MarkerLabel,
} from "@/components/ui/map";

export type FieldPin = {
  id: string;
  name: string;
  center: [longitude: number, latitude: number];
  needsAttention: boolean;
};

export default function MapsScene({ fields }: { fields: FieldPin[] }) {
  const longitudes = fields.map((field) => field.center[0]);
  const latitudes = fields.map((field) => field.center[1]);
  return (
    <div className="relative flex h-full min-h-0 flex-col bg-background text-foreground">
      <div className="relative min-h-80 flex-1">
        <Map
          center={[107.6191, -6.9175]}
          zoom={9}
          bounds={
            fields.length === 0
              ? undefined
              : [
                  [Math.min(...longitudes), Math.min(...latitudes)],
                  [Math.max(...longitudes), Math.max(...latitudes)],
                ]
          }
          fitBoundsOptions={{
            padding: { top: 240, right: 120, bottom: 120, left: 360 },
            maxZoom: 12,
          }}
          styles={{ light: "https://tiles.openfreemap.org/styles/bright" }}
          renderWorldCopies
        >
          <AreaLayer />
          {fields.map((field) => (
            <MapMarker key={field.id} longitude={field.center[0]} latitude={field.center[1]}>
              <MarkerContent>
                <Link
                  href={`/fields/${field.id}`}
                  aria-label={`Open ${field.name}`}
                  className={`block size-4 rounded-full border-2 border-background shadow-lg ${field.needsAttention ? "bg-destructive" : "bg-primary"}`}
                />
                <MarkerLabel>{field.name}</MarkerLabel>
              </MarkerContent>
            </MapMarker>
          ))}
          <MapControls
            position="bottom-left"
            showZoom
            showCompass
            className="md:group-has-data-[state=expanded]/sidebar-wrapper:left-(--sidebar-width) md:group-has-data-[state=expanded]/sidebar-wrapper:translate-x-2"
          />
        </Map>
      </div>
    </div>
  );
}

function AreaLayer() {
  const [showAreas, setShowAreas] = useState(true);
  const [hoveredArea, setHoveredArea] = useState<AreaProperties | null>(null);

  return (
    <>
      {showAreas && (
        <MapGeoJSON<AreaProperties>
          id="areas"
          data="/api/areas"
          promoteId="code"
          interactive
          fillPaint={{ "fill-color": "#0ea5e9", "fill-opacity": 0.06 }}
          fillHoverPaint={{ "fill-opacity": 0.3 }}
          linePaint={{ "line-color": "#0ea5e9", "line-width": 1, "line-opacity": 0.7 }}
          onHover={function showAreaName(event) {
            setHoveredArea(event ? event.feature.properties : null);
          }}
        />
      )}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 shadow-sm">
          <Label htmlFor="areas-switch">Areas</Label>
          <Switch
            id="areas-switch"
            checked={showAreas}
            onCheckedChange={function toggleAreas(checked) {
              setShowAreas(checked);
              setHoveredArea(null);
            }}
          />
        </div>
        {showAreas && hoveredArea && (
          <p className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs shadow-sm">
            {hoveredArea.name} ·{" "}
            <span className="text-muted-foreground">{hoveredArea.province}</span>
          </p>
        )}
      </div>
    </>
  );
}
