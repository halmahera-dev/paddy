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
import { Switch } from "@hollou/ui/components/switch";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AppLogo } from "@/components/app-logo";
import { Map, useMap } from "@/components/ui/map";
import type { PublicBowl } from "@/features/bowls/bowls-queries";
import { BowlLayer, dropMeters, maxDropMeters, waterExaggeration } from "@/features/map/components/bowl-layer";
import { MapTimeline, usePlayback } from "@/features/map/components/map-timeline";
import { BuildingsLayer, InterferogramLayer } from "@/features/nisar/components/nisar-layers";
import { interferogramCatalog } from "@/features/nisar/nisar-catalog";
import { LanguageSwitch } from "@/features/shell/components/language-switch";
import { fill, formatDate, type Dictionary, type Locale } from "@/lib/i18n";

const globe = { type: "globe" } as const;
const currentYear = 2026;
const lastYear = 2050;
const defaultYear = 2035;
const yearsPerSecond = 3;
const passesPerSecond = 1.25;
const allBowls = "all";

type Option = { value: string; label: string };

const overviewCamera = { center: [106.81, -6.13] as [number, number], zoom: 12, pitch: 58, bearing: -20 };

function MapCamera({ bowl }: { bowl: PublicBowl | null }) {
  const { map, isLoaded } = useMap();
  const flownTargetRef = useRef<string | null>(null);
  const target = bowl?.id ?? "overview";

  useEffect(() => {
    if (!map || !isLoaded || flownTargetRef.current === target) {
      return;
    }
    const isIntro = flownTargetRef.current === null;
    flownTargetRef.current = target;
    const camera = bowl ? { center: bowl.center, zoom: 14, pitch: 55 } : overviewCamera;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      map.jumpTo(camera);
      return;
    }
    map.flyTo({ ...camera, duration: isIntro ? 7000 : 2400, essential: true });
  }, [map, isLoaded, target, bowl]);

  return null;
}

function parseYear(value: string | null) {
  const year = Number(value);
  if (Number.isInteger(year) && year >= currentYear && year <= lastYear) {
    return year;
  }
  return defaultYear;
}

function parsePassIndex(value: string | null, passCount: number) {
  const index = Number(value);
  if (value !== null && Number.isInteger(index) && index >= 0 && index < passCount) {
    return index;
  }
  return passCount - 1;
}

const gaugeHeight = 72;
const personHeightMeters = 1.7;

function DropGauge({ meters, label }: { meters: number; label: string }) {
  const pixelsPerMeter = gaugeHeight / maxDropMeters;
  const waterTop = gaugeHeight - Math.min(meters, maxDropMeters) * pixelsPerMeter;
  const personTop = gaugeHeight - personHeightMeters * pixelsPerMeter;
  return (
    <svg viewBox={`0 0 40 ${gaugeHeight}`} className="h-18 w-10 shrink-0" role="img" aria-label={label}>
      <g className="fill-muted-foreground/60">
        <circle cx="20" cy={personTop + 4} r="4" />
        <rect x="14" y={personTop + 9} width="12" height="15" rx="4" />
        <rect x="15" y={personTop + 22} width="4" height={gaugeHeight - personTop - 22} rx="2" />
        <rect x="21" y={personTop + 22} width="4" height={gaugeHeight - personTop - 22} rx="2" />
      </g>
      <rect x="0" y={waterTop} width="40" height={gaugeHeight - waterTop} className="fill-chart-5/50" />
      <line x1="0" x2="40" y1={waterTop} y2={waterTop} strokeWidth="1" className="stroke-chart-5" />
    </svg>
  );
}

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pairs = interferogramCatalog.pairs;

  const isBowls = searchParams.get("show") !== "radar";
  const withBan = searchParams.get("ban") !== "off";
  const selectedBowl = bowls.find((bowl) => bowl.id === searchParams.get("bowl")) ?? null;
  const [year, setYear] = useState(() => parseYear(searchParams.get("year")));
  const [passIndex, setPassIndex] = useState(() => parsePassIndex(searchParams.get("pass"), pairs.length));
  const years = year - currentYear;
  const wholeYear = Math.floor(year);
  const pair = pairs[passIndex];

  function setParam(name: string, value: string | null) {
    const nextParams = new URLSearchParams(window.location.search);
    if (value === null) {
      nextParams.delete(name);
    } else {
      nextParams.set(name, value);
    }
    window.history.replaceState(null, "", `${pathname}?${nextParams}`);
  }

  function commitYear(value: number) {
    const nextYear = Math.floor(value);
    setYear(nextYear);
    setParam("year", String(nextYear));
  }

  function showPass(value: number) {
    setPassIndex(Math.floor(value));
  }

  function commitPass(value: number) {
    const nextIndex = Math.floor(value);
    setPassIndex(nextIndex);
    setParam("pass", String(nextIndex));
  }

  const timeline = isBowls
    ? { value: year, min: currentYear, max: lastYear, unitsPerSecond: yearsPerSecond, onFrame: setYear, onStop: commitYear }
    : { value: passIndex, min: 0, max: pairs.length - 1, unitsPerSecond: passesPerSecond, onFrame: showPass, onStop: commitPass };
  const playback = usePlayback(timeline);

  function changeShow(value: string) {
    playback.pause();
    setParam("show", value === "radar" ? "radar" : null);
  }

  function scrub(value: number) {
    playback.pause();
    timeline.onStop(value);
  }

  function togglePlay() {
    if (playback.isPlaying) {
      playback.pause();
    } else {
      playback.play();
    }
  }

  const summaryBowl = selectedBowl ?? bowls.toSorted((a, b) => b.rateAfterBanMmYr - a.rateAfterBanMmYr)[0];
  const summaryDrop = dropMeters(summaryBowl, years, withBan);

  function describeView() {
    if (!isBowls) {
      return fill(t.radarSummary, {
        start: formatDate(locale, pair.referenceDate),
        end: formatDate(locale, pair.secondaryDate),
        days: Math.round((Date.parse(pair.secondaryDate) - Date.parse(pair.referenceDate)) / 86_400_000),
      });
    }
    const values = { name: summaryBowl.name, meters: summaryDrop.toFixed(2), year: wholeYear };
    if (withBan) {
      return fill(t.bowlSummary, values);
    }
    const extra = summaryDrop - dropMeters(summaryBowl, years, true);
    return fill(t.noBanSummary, { ...values, extra: extra.toFixed(2) });
  }

  return (
    <div className="flex h-svh flex-col bg-background">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3">
        <Link href={`/${locale}/landing`} className="flex items-center gap-2 text-sm font-medium">
          <AppLogo />
          LANDAS
        </Link>
        <HeaderSelect
          label={t.show}
          value={isBowls ? "bowls" : "radar"}
          options={[
            { value: "bowls", label: t.showBowls },
            { value: "radar", label: t.showRadar },
          ]}
          onChange={changeShow}
        />
        {isBowls && (
          <HeaderSelect
            label={t.jumpTo}
            value={selectedBowl?.id ?? allBowls}
            options={[
              { value: allBowls, label: t.northJakarta },
              ...bowls.map((bowl) => ({ value: bowl.id, label: bowl.name })),
            ]}
            onChange={(value) => setParam("bowl", value === allBowls ? null : value)}
          />
        )}
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitch locale={locale} label={labels.common.switchLanguage} />
          <Button size="sm" nativeButton={false} render={<Link href={`/${locale}`} />}>
            {labels.common.openDesk}
          </Button>
        </div>
        <p className="w-full text-sm text-muted-foreground" aria-live={playback.isPlaying ? "off" : "polite"}>
          {describeView()}
        </p>
      </header>

      <div className="relative flex-1">
        <Map center={[112, -2]} zoom={2.6} projection={globe} maxPitch={75}>
          <BuildingsLayer />
          {isBowls ? (
            <BowlLayer
              bowls={bowls}
              years={years}
              withBan={withBan}
              selectedBowlId={selectedBowl?.id ?? null}
              onSelect={(bowlId) => setParam("bowl", bowlId)}
            />
          ) : (
            <InterferogramLayer pair={pair} />
          )}
          <MapCamera bowl={selectedBowl} />
        </Map>
        <div className="absolute top-4 left-4 flex max-w-64 flex-col gap-2 glass rounded-4xl border border-transparent p-3 text-xs text-muted-foreground shadow-md">
          {isBowls ? (
            <>
              <div className="h-2 rounded-full bg-linear-to-r from-chart-3 to-chart-4" />
              <div className="flex justify-between tabular-nums">
                <span>0 m</span>
                <span>{maxDropMeters} m</span>
              </div>
              <p>{fill(t.dropLegend, { year: wholeYear })}</p>
              <div className="flex items-end gap-3 border-t pt-2">
                <DropGauge meters={summaryDrop} label={fill(t.personScale, { name: summaryBowl.name })} />
                <div className="flex flex-col gap-1">
                  <span className="type-title text-foreground tabular-nums">−{summaryDrop.toFixed(2)} m</span>
                  <span>{summaryBowl.name}</span>
                  <span>{fill(t.waterScale, { scale: waterExaggeration })}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="phase-cycle-legend h-2 rounded-full" />
              <p>{t.phaseLegend}</p>
            </>
          )}
        </div>
        <MapTimeline
          isPlaying={playback.isPlaying}
          onTogglePlay={togglePlay}
          playLabel={t.play}
          pauseLabel={t.pause}
          sliderLabel={isBowls ? t.year : t.pass}
          min={timeline.min}
          max={timeline.max}
          value={timeline.value}
          onValueChange={scrub}
          valueLabel={isBowls ? String(wholeYear) : `${passIndex + 1}/${pairs.length}`}
        >
          {isBowls ? (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Switch
                size="sm"
                checked={withBan}
                onCheckedChange={(checked) => setParam("ban", checked ? null : "off")}
              />
              {t.banScenario}
            </label>
          ) : (
            <p className="text-xs text-muted-foreground tabular-nums">
              {formatDate(locale, pair.referenceDate)} – {formatDate(locale, pair.secondaryDate)}
            </p>
          )}
        </MapTimeline>
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
