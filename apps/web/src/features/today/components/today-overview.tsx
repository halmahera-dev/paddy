import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Skeleton } from "@hollou/ui/components/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@hollou/ui/components/table";
import { cn } from "@hollou/ui/lib/utils";
import Link from "next/link";

import { getBowlSeries, getBowls, type Bowl } from "@/features/bowls/bowls-queries";
import { interferogramCatalog } from "@/features/nisar/nisar-catalog";
import { PassChart, Sparkline } from "@/features/today/components/today-charts";
import { Card, CountList, Dumbbells, Metric, SplitRows } from "@/features/today/components/today-panels";
import { fill, formatDate, getDictionary, type Dictionary, type Locale } from "@/lib/i18n";

const passIntervalDays = 12;
const notSlowingShare = 0.8;
const slowingShare = 0.6;

const statusColors: Record<Bowl["status"], string> = {
  lead: "bg-brand",
  scheduled: "bg-chart-2",
  inspected: "bg-chart-3",
  closed: "bg-chart-5",
  dismissed: "bg-muted-foreground/40",
};

type ChangeKind = "new" | "up" | "down" | "slowing";

function rateShare(bowl: Bowl) {
  return bowl.rateAfterBanMmYr / bowl.rateBeforeBanMmYr;
}

function describeChange(bowl: Bowl, latestPassIndex: number, t: Dictionary["today"]) {
  if (bowl.firstSeenPass === latestPassIndex) {
    return { kind: "new" as ChangeKind, text: t.newBowl };
  }
  if (bowl.previousRank !== null && bowl.previousRank > bowl.rank) {
    return { kind: "up" as ChangeKind, text: fill(t.rankUp, { from: bowl.previousRank, to: bowl.rank }) };
  }
  if (bowl.previousRank !== null && bowl.previousRank < bowl.rank) {
    return { kind: "down" as ChangeKind, text: fill(t.rankDown, { from: bowl.previousRank, to: bowl.rank }) };
  }
  if (rateShare(bowl) < slowingShare) {
    return {
      kind: "slowing" as ChangeKind,
      text: fill(t.slowing, { percent: Math.round((1 - rateShare(bowl)) * 100) }),
    };
  }
  return null;
}

function RankChange({ bowl, kind, text }: { bowl: Bowl; kind: ChangeKind; text: string }) {
  const hasMoved = kind !== "slowing";
  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums" title={text}>
      <span className="sr-only">{text}</span>
      {hasMoved ? (
        <span aria-hidden="true" className="text-muted-foreground">
          {bowl.previousRank ?? "–"}
        </span>
      ) : null}
      {hasMoved ? (
        <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} className="size-3 text-muted-foreground" aria-hidden="true" />
      ) : null}
      <span aria-hidden="true" className={cn("font-medium", kind === "down" ? null : "text-brand-text")}>
        {bowl.rank}
      </span>
    </span>
  );
}

function meanByIndex(seriesList: { mm: number }[][]) {
  const length = Math.min(...seriesList.map((series) => series.length));
  return Array.from({ length }, function meanAt(_, index) {
    const total = seriesList.reduce((sum, series) => sum + series[index].mm, 0);
    return Math.round(total / seriesList.length);
  });
}

export async function TodayOverview({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const t = dictionary.today;
  const bowls = await getBowls();
  const activeBowls = bowls.filter((bowl) => bowl.status !== "dismissed");
  const bowlsBySpeed = activeBowls.toSorted((a, b) => b.rateAfterBanMmYr - a.rateAfterBanMmYr);
  const fastestBowl = bowlsBySpeed[0];
  const notSlowingCount = activeBowls.filter((bowl) => rateShare(bowl) >= notSlowingShare).length;
  const closedBowls = bowls.filter((bowl) => bowl.outcome !== null);
  const pumpCount = closedBowls.filter((bowl) => bowl.outcome === "pump_found").length;

  const pairs = interferogramCatalog.pairs;
  const latestPassIndex = pairs.length - 1;
  const latestPassDate = pairs[latestPassIndex].secondaryDate;
  const nextPassDate = new Date(Date.parse(latestPassDate) + passIntervalDays * 86_400_000);
  const nextPassTemplate = nextPassDate.getTime() > Date.now() ? t.nextPassFuture : t.nextPassLate;

  const seriesList = activeBowls.flatMap(function toSeries(bowl) {
    const series = getBowlSeries(bowl.id);
    return series ? [series] : [];
  });
  const nisarDates = seriesList[0]?.nisar.map((point) => point.date) ?? [];
  const meanNisar = meanByIndex(seriesList.map((series) => series.nisar));
  const passPoints = meanNisar.map((mm, index) => ({ label: formatDate(locale, nisarDates[index]), mm }));
  const meanSentinel = meanByIndex(seriesList.map((series) => series.sentinel1));
  const fastestSeries = fastestBowl ? (getBowlSeries(fastestBowl.id)?.nisar.map((point) => point.mm) ?? []) : [];
  const knownByPass = pairs.map(
    (_, passIndex) => activeBowls.filter((bowl) => bowl.firstSeenPass <= passIndex).length,
  );

  const changes = bowls.flatMap(function toChange(bowl) {
    const change = describeChange(bowl, latestPassIndex, t);
    return change ? [{ bowl, ...change }] : [];
  });

  const kecamatanRows = Object.entries(Object.groupBy(activeBowls, (bowl) => bowl.kecamatan))
    .map(([name, group]) => ({ key: name, label: name, count: group?.length ?? 0 }))
    .toSorted((a, b) => b.count - a.count);

  const unit = dictionary.common.mmPerYear;

  return (
    <>
      {fastestBowl ? (
        <p className="text-sm text-muted-foreground">
          {fill(t.finding, {
            name: fastestBowl.name,
            rate: fastestBowl.rateAfterBanMmYr,
            status: dictionary.bowls.statuses[fastestBowl.status].toLowerCase(),
          })}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric label={t.activeBowls} value={String(activeBowls.length)}>
            <Sparkline values={knownByPass} color="var(--chart-2)" isStep />
          </Metric>
          <Metric
            label={t.worstRate}
            value={`${fastestBowl?.rateAfterBanMmYr ?? 0} ${unit}`}
            detail={fastestBowl?.name}
          >
            <Sparkline values={fastestSeries} color="var(--brand)" />
          </Metric>
          <Metric
            label={t.notSlowing}
            value={`${Math.round((notSlowingCount / Math.max(activeBowls.length, 1)) * 100)}%`}
            detail={`${notSlowingCount} / ${activeBowls.length}`}
          >
            <Sparkline values={meanSentinel} color="var(--chart-4)" />
          </Metric>
          <Metric
            label={t.hitRate}
            value={closedBowls.length > 0 ? `${pumpCount} / ${closedBowls.length}` : "0"}
            detail={closedBowls.length > 0 ? null : t.noOutcomes}
          >
            {closedBowls.length > 0 ? (
              <ol className="flex flex-wrap gap-1 px-4 pb-4" aria-hidden="true">
                {closedBowls.map((bowl) => (
                  <li
                    key={bowl.id}
                    className={cn(
                      "size-2.5 rounded-full",
                      bowl.outcome === "pump_found" ? "bg-brand" : "bg-muted-foreground/30",
                    )}
                  />
                ))}
              </ol>
            ) : null}
          </Metric>
        </div>

        <Card id="heartbeat" title={t.heartbeat} note={t.movementNote}>
          <PassChart points={passPoints} label={t.meanMovement} />
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <p>
              {fill(t.latestPass, { date: formatDate(locale, latestPassDate) })}{" "}
              <span className="text-muted-foreground">
                {fill(nextPassTemplate, { date: formatDate(locale, nextPassDate) })}
              </span>
            </p>
            <ol className="flex items-center gap-1.5" aria-label={fill(t.passCount, { count: pairs.length })}>
              {pairs.map((pair, index) => (
                <li
                  key={pair.id}
                  title={formatDate(locale, pair.secondaryDate)}
                  className={cn(
                    "size-2 rounded-full",
                    index === latestPassIndex ? "bg-brand" : "bg-muted-foreground/40",
                  )}
                >
                  <span className="sr-only">{formatDate(locale, pair.secondaryDate)}</span>
                </li>
              ))}
              <li className="size-2 rounded-full border border-dashed border-muted-foreground" aria-hidden />
            </ol>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          <Card id="ban-effect" title={t.banEffect} note={t.banEffectNote} className="xl:col-span-2">
            <Dumbbells
              rows={bowlsBySpeed.map((bowl) => ({
                key: bowl.id,
                label: bowl.name,
                detail: bowl.kecamatan,
                before: bowl.rateBeforeBanMmYr,
                after: bowl.rateAfterBanMmYr,
              }))}
              beforeLabel={t.rateBefore}
              afterLabel={t.rateNow}
            />
          </Card>
          <Card id="changes" title={t.changes} note={t.sinceLastPass}>
            {changes.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t.noChanges}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{dictionary.bowls.bowl}</TableHead>
                    <TableHead>{dictionary.bowls.rank}</TableHead>
                    <TableHead className="text-right">{dictionary.bowls.rate}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {changes.map((change) => (
                    <TableRow key={change.bowl.id}>
                      <TableCell>
                        <Link
                          href={`/${locale}/bowls/${change.bowl.id}`}
                          className="flex flex-col transition-colors duration-160 ease-out hover:text-brand-text"
                        >
                          <span className="font-medium">{change.bowl.name}</span>
                          <span className="text-xs text-muted-foreground">{change.bowl.kecamatan}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <RankChange bowl={change.bowl} kind={change.kind} text={change.text} />
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-baseline gap-1.5 tabular-nums">
                          {change.bowl.rateAfterBanMmYr}
                          <span className="text-xs text-muted-foreground">
                            {Math.round((rateShare(change.bowl) - 1) * 100)}%
                          </span>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card id="case-status" title={t.caseStatus}>
            <SplitRows
              rows={(Object.keys(statusColors) as Bowl["status"][]).map((status) => ({
                label: dictionary.bowls.statuses[status],
                value: bowls.filter((bowl) => bowl.status === status).length,
                color: statusColors[status],
              }))}
            />
          </Card>
          <Card id="by-kecamatan" title={t.byKecamatan}>
            <CountList rows={kecamatanRows} emptyMessage={dictionary.bowls.empty} />
          </Card>
        </div>
      </div>
    </>
  );
}

export function TodayOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      <Skeleton className="h-5 w-96 max-w-full" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-72" />
      <div className="grid gap-3 xl:grid-cols-3">
        <Skeleton className="h-96 xl:col-span-2" />
        <Skeleton className="h-96" />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
