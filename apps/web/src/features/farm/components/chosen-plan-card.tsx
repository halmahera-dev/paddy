import { Badge } from "@paddy-field/ui/components/badge";
import { buttonVariants } from "@paddy-field/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@paddy-field/ui/components/card";
import { Progress } from "@paddy-field/ui/components/progress";
import Link from "next/link";

import type { Farm, PlanSeason } from "../farm-queries";

import { cropName } from "../crop-progress";

function describeRatio(percent: number) {
  if (percent < 50) return "Low";
  if (percent < 80) return "Medium";
  return "High";
}

function findRiskiestSeason(seasons: PlanSeason[]) {
  let riskiest: PlanSeason | null = null;
  for (const season of seasons) {
    if (season.rainToDemandPercent === null) continue;
    if (riskiest === null || season.rainToDemandPercent < (riskiest.rainToDemandPercent ?? 100)) {
      riskiest = season;
    }
  }
  return riskiest;
}

export function ChosenPlanCard({ farm }: { farm: Farm }) {
  const plansLink = (
    <Link href="/briefing" className={buttonVariants({ variant: "secondary", size: "sm" })}>
      Compare plans
    </Link>
  );

  if (farm.plan === null) {
    return (
      <Card>
        <CardHeader>
          <CardDescription>Your plan · next three seasons</CardDescription>
          <CardTitle className="type-title">No plan chosen yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Compare rotation plans for this farm and choose one to consider.
          </p>
        </CardContent>
        <CardFooter>{plansLink}</CardFooter>
      </Card>
    );
  }

  const { seasons, baselineDemandMm } = farm.plan;
  const planDemandMm = seasons.reduce((sum, season) => sum + season.demandMm, 0);
  const savingPercent = Math.round((1 - planDemandMm / baselineDemandMm) * 100);
  const riskiestSeason = findRiskiestSeason(seasons);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Your plan · next three seasons</CardDescription>
        <CardTitle className="type-title">
          {seasons.map((season) => cropName[season.crop]).join(" → ")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Progress
            value={(planDemandMm / baselineDemandMm) * 100}
            aria-label="Plan demand against rice every season"
          />
          <span className="text-muted-foreground">
            {savingPercent}% less estimated crop water demand than rice every season ({planDemandMm}{" "}
            vs {baselineDemandMm} mm)
          </span>
        </div>
        <ol className="grid grid-cols-3 gap-2">
          {seasons.map(function renderSeason(season) {
            return (
              <li key={season.season} className="flex flex-col">
                <span className="text-xs text-muted-foreground">{season.season}</span>
                <span className="font-medium">{cropName[season.crop]}</span>
                <span className="text-muted-foreground tabular-nums">
                  {season.rainToDemandPercent === null
                    ? "Rest"
                    : `${season.rainToDemandPercent}% · ${describeRatio(season.rainToDemandPercent)}`}
                </span>
              </li>
            );
          })}
        </ol>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-wrap items-center gap-2">
          <Badge variant="brand">Plan to consider</Badge>
          {riskiestSeason === null ? null : (
            <Badge variant="destructive">Water risk: {riskiestSeason.season}</Badge>
          )}
          <span className="ml-auto">{plansLink}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
