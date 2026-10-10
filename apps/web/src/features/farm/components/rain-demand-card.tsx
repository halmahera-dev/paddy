import { Badge } from "@paddy-field/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@paddy-field/ui/components/card";

import type { Farm } from "../farm-queries";

import { describePlantingDate } from "../crop-progress";
import { RainDemandChart } from "./rain-demand-chart";

function describeRainCover(farm: Farm) {
  const weeksSincePlanting = farm.weeklyWater.filter((week) => week.demandMm !== null);
  if (weeksSincePlanting.length === 0) return "Add a planting date to see crop water demand";

  let rainMm = 0;
  let demandLowMm = 0;
  let demandHighMm = 0;
  for (const week of weeksSincePlanting) {
    rainMm += week.rainMm;
    demandLowMm += week.demandMm?.[0] ?? 0;
    demandHighMm += week.demandMm?.[1] ?? 0;
  }
  const coverLow = Math.round((rainMm / demandHighMm) * 100);
  const coverHigh = Math.round((rainMm / demandLowMm) * 100);
  const cover = coverLow === coverHigh ? `${coverLow}%` : `${coverLow}–${coverHigh}%`;

  return `Rain covers ${cover} of estimated crop demand since planting`;
}

export function RainDemandCard({ farm }: { farm: Farm }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Rain vs crop water demand · {farm.season}</CardDescription>
        <CardTitle className="type-headline">{describeRainCover(farm)}</CardTitle>
      </CardHeader>
      <CardContent>
        <RainDemandChart data={farm.weeklyWater} />
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            <span className="size-2 rounded-full bg-chart-1" />
            Weekly rain · IMERG Late, 10 km
          </Badge>
          <Badge variant="secondary">
            <span className="size-2 rounded-full bg-chart-3" />
            Estimated demand · Hargreaves + FAO-56
          </Badge>
          <Badge variant="secondary">Planted {describePlantingDate(farm.cropRecord)}</Badge>
          <Badge variant="secondary">Total rain, not effective rain</Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
