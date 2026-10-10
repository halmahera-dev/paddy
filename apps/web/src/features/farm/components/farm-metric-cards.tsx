import { Badge } from "@paddy-field/ui/components/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@paddy-field/ui/components/card";
import { Progress } from "@paddy-field/ui/components/progress";

import type { Farm } from "../farm-queries";

import { describeElapsedDays, describePlantingDate, estimateCropProgress } from "../crop-progress";

function describeAgainstNormal(value: number, normal: number) {
  if (value < normal * 0.85) return { note: "Drier than normal", tone: "destructive" } as const;
  if (value > normal * 1.15) return { note: "Wetter than normal", tone: "secondary" } as const;
  return { note: "Near normal", tone: "brand" } as const;
}

function describeCropProgress(farm: Farm) {
  const progress = estimateCropProgress(farm.cropRecord, farm.asOf);
  const source = `Your record · planted ${describePlantingDate(farm.cropRecord)}`;

  if (progress.kind === "fallow") {
    return {
      label: "Crop progress",
      value: "Resting",
      share: null,
      note: "Fallow",
      tone: "secondary",
      source,
    } as const;
  }
  if (progress.kind === "unknown-date") {
    return {
      label: "Crop progress",
      value: "Unknown",
      share: null,
      note: "Add a planting date",
      tone: "secondary",
      source,
    } as const;
  }
  return {
    label: "Crop progress",
    value: describeElapsedDays(progress),
    share: progress.percent / 100,
    note: `${progress.stage} · estimated`,
    tone: "secondary",
    source,
  } as const;
}

function describeMoisture(conditions: Farm["conditions"]) {
  const source = `SMAP L4 · 9 km · ${conditions.moistureObserved}`;

  if (conditions.rootZoneMoisture === null) {
    return {
      label: "Soil moisture",
      value: "No reading",
      share: null,
      note: "No valid reading",
      tone: "secondary",
      source,
    } as const;
  }
  return {
    label: "Soil moisture",
    value: `${conditions.rootZoneMoisture.toFixed(2)} m³/m³`,
    share: conditions.rootZoneMoisture / conditions.normalRootZoneMoisture,
    ...describeAgainstNormal(conditions.rootZoneMoisture, conditions.normalRootZoneMoisture),
    source,
  };
}

export function FarmMetricCards({ farm }: { farm: Farm }) {
  const { conditions } = farm;
  const temperatureDifference = conditions.maxTemperatureC - conditions.normalMaxTemperatureC;
  const metrics = [
    describeCropProgress(farm),
    {
      label: "Rain · 30 days",
      value: `${conditions.rain30dMm} mm`,
      share: conditions.rain30dMm / conditions.normalRain30dMm,
      ...describeAgainstNormal(conditions.rain30dMm, conditions.normalRain30dMm),
      source: `IMERG Late · 10 km · to ${conditions.rainObserved}`,
    },
    describeMoisture(conditions),
    {
      label: "Max temperature",
      value: `${conditions.maxTemperatureC.toFixed(1)} °C`,
      share: null,
      note: `${temperatureDifference >= 0 ? "+" : ""}${temperatureDifference.toFixed(1)} °C vs normal`,
      tone: "secondary" as const,
      source: `POWER · 50 km · ${conditions.temperatureObserved}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metrics.map(function renderMetric(metric) {
        return (
          <Card key={metric.label}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{metric.value}</CardTitle>
            </CardHeader>
            <CardFooter className="mt-auto">
              <div className="flex w-full flex-col items-start gap-2">
                {metric.share === null ? null : (
                  <Progress
                    className="w-full"
                    value={Math.min(metric.share, 1) * 100}
                    aria-label={metric.label}
                  />
                )}
                <Badge variant={metric.tone}>{metric.note}</Badge>
                <span className="text-xs text-muted-foreground">{metric.source}</span>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
