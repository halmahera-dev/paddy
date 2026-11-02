"use client";

import { Button } from "@hollou/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hollou/ui/components/select";
import { Skeleton } from "@hollou/ui/components/skeleton";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AppLogo } from "@/components/app-logo";
import { Map } from "@/components/ui/map";
import type { PublicBowl } from "@/features/bowls/bowls-queries";
import { BowlLayer, dropMeters, FlyToBowl } from "@/features/map/components/bowl-layer";
import { BuildingsLayer, FlyToNorthJakarta, InterferogramLayer } from "@/features/nisar/components/nisar-layers";
import { interferogramCatalog } from "@/features/nisar/nisar-catalog";
import { LanguageSwitch } from "@/features/shell/components/language-switch";
import { fill, formatDate, type Dictionary, type Locale } from "@/lib/i18n";

const globe = { type: "globe" } as const;
const currentYear = 2026;
const yearOptions = ["2030", "2035", "2040", "2050"];
const defaultYear = "2035";
const allBowls = "all";

type Option = { value: string; label: string };

function HeaderSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="hidden lg:inline">{label}</span>
      <Select items={options} value={value} onValueChange={(next) => next && onChange(next)}>
        <SelectTrigger size="sm" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

export function LandasMap({
  locale,
  bowls,
  labels,
}: {
  locale: Locale;
  bowls: PublicBowl[];
  labels: { map: Dictionary["map"]; common: Dictionary["common"] };
}) {
  const t = labels.map;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pairs = interferogramCatalog.pairs;

  const show = searchParams.get("show") === "radar" ? "radar" : "bowls";
  const year = yearOptions.includes(searchParams.get("year") ?? "") ? searchParams.get("year")! : defaultYear;
  const passIndex = Math.min(Number(searchParams.get("pass") ?? pairs.length - 1) || 0, pairs.length - 1);
  const selectedBowl = bowls.find((bowl) => bowl.id === searchParams.get("bowl")) ?? null;
  const years = Number(year) - currentYear;
  const pair = pairs[passIndex];

  function setParam(name: string, value: string | null) {
    const nextParams = new URLSearchParams(searchParams);
    if (value === null) {
      nextParams.delete(name);
    } else {
      nextParams.set(name, value);
    }
    router.replace(`${pathname}?${nextParams}`, { scroll: false });
  }

  const summaryBowl = selectedBowl ?? bowls.toSorted((a, b) => b.rateAfterBanMmYr - a.rateAfterBanMmYr)[0];
  const summary =
    show === "bowls"
      ? fill(t.bowlSummary, {
          name: summaryBowl.name,
          meters: dropMeters(summaryBowl, years).toFixed(2),
          year,
        })
      : fill(t.radarSummary, {
          start: formatDate(locale, pair.referenceDate),
          end: formatDate(locale, pair.secondaryDate),
          days: Math.round((Date.parse(pair.secondaryDate) - Date.parse(pair.referenceDate)) / 86_400_000),
        });

  return (
    <div className="flex h-svh flex-col bg-background">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3">
        <Link href={`/${locale}/landing`} className="flex items-center gap-2 text-sm font-medium">
          <AppLogo />
          LANDAS
        </Link>
        <HeaderSelect
          label={t.show}
          value={show}
          options={[
            { value: "bowls", label: t.showBowls },
            { value: "radar", label: t.showRadar },
          ]}
          onChange={(value) => setParam("show", value)}
        />
        {show === "bowls" ? (
          <>
            <HeaderSelect
              label={t.year}
              value={year}
              options={yearOptions.map((option) => ({ value: option, label: option }))}
              onChange={(value) => setParam("year", value)}
            />
            <HeaderSelect
              label={t.jumpTo}
              value={selectedBowl?.id ?? allBowls}
              options={[
                { value: allBowls, label: t.northJakarta },
                ...bowls.map((bowl) => ({ value: bowl.id, label: bowl.name })),
              ]}
              onChange={(value) => setParam("bowl", value === allBowls ? null : value)}
            />
          </>
        ) : (
          <HeaderSelect
            label={t.pass}
            value={String(passIndex)}
            options={pairs.map((item, index) => ({
              value: String(index),
              label: `${formatDate(locale, item.referenceDate)} – ${formatDate(locale, item.secondaryDate)}`,
            }))}
            onChange={(value) => setParam("pass", value)}
          />
        )}
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitch locale={locale} label={labels.common.switchLanguage} />
          <Button size="sm" nativeButton={false} render={<Link href={`/${locale}`} />}>
            {labels.common.openDesk}
          </Button>
        </div>
        <p className="w-full text-sm text-muted-foreground" aria-live="polite">
          {summary}
        </p>
      </header>

      <div className="relative flex-1">
        <Map center={[112, -2]} zoom={2.6} projection={globe} maxPitch={75}>
          <BuildingsLayer />
          <FlyToNorthJakarta />
          {show === "radar" ? (
            <InterferogramLayer pair={pair} />
          ) : (
            <BowlLayer
              bowls={bowls}
              years={years}
              selectedBowlId={selectedBowl?.id ?? null}
              onSelect={(bowlId) => setParam("bowl", bowlId)}
            />
          )}
          <FlyToBowl bowl={show === "bowls" ? selectedBowl : null} />
        </Map>
        <div className="absolute bottom-4 left-4 flex max-w-64 flex-col gap-2 rounded-xl border bg-card/90 p-3 text-xs text-muted-foreground shadow-lg backdrop-blur-md">
          {show === "bowls" ? (
            <>
              <div className="h-2 rounded-full bg-linear-to-r from-chart-3 to-chart-4" />
              <div className="flex justify-between tabular-nums">
                <span>0 m</span>
                <span>2 m</span>
              </div>
              <p>{fill(t.dropLegend, { year })}</p>
            </>
          ) : (
            <>
              <div className="phase-cycle-legend h-2 rounded-full" />
              <p>{t.phaseLegend}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function LandasMapSkeleton() {
  return (
    <div className="flex h-svh flex-col">
      <div className="flex items-center gap-4 border-b px-4 py-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-28" />
      </div>
      <Skeleton className="flex-1" />
    </div>
  );
}
