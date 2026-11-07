"use client";

import { Alert, AlertDescription } from "@hollou/ui/components/alert";
import { Button } from "@hollou/ui/components/button";
import { Switch } from "@hollou/ui/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@hollou/ui/components/tabs";
import { Cancel01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { BowlSeries, PublicBowl } from "@/features/bowls/bowls-queries";

import { BowlChart } from "@/features/bowls/components/bowl-chart";
import { BowlDepthView } from "@/features/map/components/bowl-depth-view";
import { dropMeters } from "@/features/map/components/bowl-layer";
import { fill, type Dictionary, type Locale } from "@/lib/i18n";

const currentYear = 2026;
const predictionYears = [2030, 2035, 2040, 2045, 2050];

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex flex-1 flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="type-title tabular-nums">
        {value}
        <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
      </span>
    </div>
  );
}

function Row({ label, value, isStrong = false }: { label: string; value: ReactNode; isStrong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={isStrong ? "font-medium tabular-nums" : "tabular-nums"}>{value}</dd>
    </div>
  );
}

function EvidenceList({ items }: { items: { summary: string; body: string }[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <details key={item.summary} className="group details-reveal border-t py-2 text-sm first:border-t-0">
          <summary className="cursor-pointer list-none text-muted-foreground tabular-nums transition-colors group-open:text-foreground hover:text-foreground">
            {item.summary}
          </summary>
          <p className="pt-2 text-muted-foreground">{item.body}</p>
        </details>
      ))}
    </div>
  );
}

export function MapBowlDetail({
  locale,
  bowl,
  series,
  banDate,
  year,
  withBan,
  onYearChange,
  onBanChange,
  onClose,
  labels,
}: {
  locale: Locale;
  bowl: PublicBowl;
  series: BowlSeries;
  banDate: string;
  year: number;
  withBan: boolean;
  onYearChange: (year: number) => void;
  onBanChange: (withBan: boolean) => void;
  onClose: () => void;
  labels: { map: Dictionary["map"]; bowls: Dictionary["bowls"]; common: Dictionary["common"] };
}) {
  const t = labels.map;
  const years = year - currentYear;
  const todayMeters = bowl.depthCm / 100;
  const drop = dropMeters(bowl, years, withBan);
  const dropWithBan = dropMeters(bowl, years, true);
  const dropWithoutBan = dropMeters(bowl, years, false);
  const projectedMeters = todayMeters + drop;
  const rate = withBan ? bowl.rateAfterBanMmYr : bowl.rateBeforeBanMmYr;
  const rateChangePercent = Math.round((1 - bowl.rateAfterBanMmYr / bowl.rateBeforeBanMmYr) * 100);
  const centimeters = (meters: number) => Math.round(meters * 100);
  const hasMovedRank = bowl.previousRank !== null && bowl.previousRank !== bowl.rank;

  const evidence = [
    {
      summary: fill(t.evidenceDepth, { cm: bowl.depthCm }),
      body: fill(t.evidenceDepthBody, { radius: bowl.radiusM }),
    },
    {
      summary: fill(t.evidenceRate, { before: bowl.rateBeforeBanMmYr, after: bowl.rateAfterBanMmYr }),
      body: fill(t.evidenceRateBody, { uncertainty: bowl.uncertaintyMmYr }),
    },
    {
      summary: fill(t.evidenceProjection, { year, meters: drop.toFixed(2) }),
      body: t.evidenceProjectionBody,
    },
  ];

  return (
    <aside
      aria-label={bowl.name}
      className="fade-in flex h-full min-h-0 w-full flex-col overflow-y-auto overscroll-contain border-t bg-background md:w-md md:overflow-hidden md:border-t-0 md:border-l"
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="type-title">{bowl.name}</h2>
            <p className="text-sm text-muted-foreground">
              {bowl.kecamatan}, {fill(t.rankLabel, { rank: bowl.rank }).toLowerCase()}
              {hasMovedRank ? ` (${fill(t.rankWas, { rank: bowl.previousRank ?? "" })})` : null}
            </p>
          </div>
          <Button size="icon-sm" variant="neutral" aria-label={t.closeDetail} onClick={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          </Button>
        </div>

        <div className="flex gap-4">
          <Stat label={t.statDepth} value={String(bowl.depthCm)} unit="cm" />
          <Stat label={fill(t.statDrop, { year })} value={drop.toFixed(2)} unit="m" />
          <Stat label={t.statRate} value={String(rate)} unit="mm/yr" />
        </div>

        <Alert>
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
          <AlertDescription>{labels.common.leadLabel}</AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="prediction" className="flex-none md:min-h-0 md:flex-1">
        <div className="px-4 pb-2">
          <TabsList className="w-full">
          <TabsTrigger value="prediction">
            {t.predictionTitle}
          </TabsTrigger>
          <TabsTrigger value="history">
            {t.historyTitle}
          </TabsTrigger>
          <TabsTrigger value="evidence">
            {t.evidenceTitle}
          </TabsTrigger>
        </TabsList>
        </div>

        <TabsContent value="prediction" className="md:overflow-y-auto md:overscroll-contain">
          <div className="flex flex-col gap-4 p-4">
          <div role="group" aria-label={t.year} className="flex flex-wrap gap-2">
            {predictionYears.map((option) => (
              <Button
                key={option}
                size="sm"
                variant={option === year ? "neutral" : "secondary"}
                aria-pressed={option === year}
                onClick={() => onYearChange(option)}
              >
                {option}
              </Button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Switch size="sm" checked={withBan} onCheckedChange={onBanChange} />
            {t.banScenario}
          </label>

          <BowlDepthView
            todayMeters={todayMeters}
            projectedMeters={projectedMeters}
            description={fill(t.depthDescription, {
              name: bowl.name,
              today: centimeters(todayMeters),
              projected: centimeters(projectedMeters),
              year,
            })}
            todayLabel={fill(t.depthToday, { cm: centimeters(todayMeters) })}
            projectedLabel={fill(t.depthProjected, { year, cm: centimeters(projectedMeters) })}
            depthLabel={`${centimeters(projectedMeters)} cm`}
          />

          <section className="flex flex-col">
            <h3 className="text-sm font-medium">{fill(t.compareTitle, { year })}</h3>
            <dl className="flex flex-col divide-y">
              <Row label={t.compareWith} value={`${dropWithBan.toFixed(2)} m`} />
              <Row label={t.compareWithout} value={`${dropWithoutBan.toFixed(2)} m`} />
              <Row label={t.compareSaved} value={`${(dropWithoutBan - dropWithBan).toFixed(2)} m`} isStrong />
            </dl>
          </section>

          <p className="text-sm text-muted-foreground">{t.predictionNote}</p>
        </div>
        </TabsContent>

        <TabsContent value="history" className="md:overflow-y-auto md:overscroll-contain">
          <div className="flex flex-col gap-4 p-4">
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">{labels.bowls.chartTitle}</h3>
            <BowlChart
              series={series}
              banDate={banDate}
              labels={{
                sentinel: labels.bowls.sentinel,
                nisar: labels.bowls.nisar,
                banLine: labels.bowls.banLine,
              }}
            />
            <p className="text-sm text-muted-foreground">{labels.bowls.joinNote}</p>
          </section>
          <dl className="flex flex-col divide-y">
            <Row label={labels.bowls.sentinel} value={`${bowl.rateBeforeBanMmYr} mm/yr`} />
            <Row
              label={labels.bowls.nisar}
              value={`${bowl.rateAfterBanMmYr} ± ${bowl.uncertaintyMmYr} mm/yr`}
            />
            <Row label={t.rateChange} value={`−${rateChangePercent}%`} isStrong />
          </dl>
        </div>
        </TabsContent>

        <TabsContent value="evidence" className="md:overflow-y-auto md:overscroll-contain">
          <div className="flex flex-col gap-3 p-4">
          <p className="text-sm text-muted-foreground">{t.evidenceExample}</p>
          <EvidenceList items={evidence} />
        </div>
        </TabsContent>
      </Tabs>

      <div className="border-t p-4">
        <Button
          variant="link"
          size="sm"
          nativeButton={false}
          render={<Link href={`/${locale}/bowls/${bowl.id}`} />}
        >
          {t.openOnDesk} →
        </Button>
      </div>
    </aside>
  );
}
