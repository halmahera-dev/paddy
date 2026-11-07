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
import type { BowlSeries, PublicBowl } from "@/features/bowls/bowls-queries";
import {
  BowlLayer,
  dropMeters,
  fastRateMmYr,
  predictionFor,
  slowRateMmYr,
} from "@/features/map/components/bowl-layer";
import { MapBowlDetail } from "@/features/map/components/map-bowl-detail";
import { MapBowlList } from "@/features/map/components/map-bowl-list";
import { MapTimeline, usePlayback } from "@/features/map/components/map-timeline";
import { BuildingsLayer, InterferogramLayer } from "@/features/nisar/components/nisar-layers";
import { interferogramCatalog } from "@/features/nisar/nisar-catalog";
import { LanguageSwitch } from "@/features/shell/components/language-switch";
import { fill, formatDate, type Dictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const globe = { type: "globe" } as const;
const currentYear = 2026;
const lastYear = 2050;
const defaultYear = 2035;
const passesPerSecond = 1.25;
const allBowls = "all";
const maxPitch = 75;
const positionWriteDelayMs = 300;

type Option = { value: string; label: string };
type Position = { center: [number, number]; zoom: number };

const overviewCamera = { center: [106.81, -6.13] as [number, number], zoom: 12, pitch: 58, bearing: -20 };

function parsePosition(value: string | null): Position | null {
  const parts = value?.split(",").map(Number);
  if (parts?.length === 3 && parts.every(Number.isFinite)) {
    return { center: [parts[0], parts[1]], zoom: parts[2] };
  }
  return null;
}

function formatPosition({ center, zoom }: Position) {
  return `${center[0].toFixed(4)},${center[1].toFixed(4)},${zoom.toFixed(2)}`;
}

function MapCamera({ bowl, is2d, hasStartPosition }: { bowl: PublicBowl | null; is2d: boolean; hasStartPosition: boolean }) {
  const { map, isLoaded } = useMap();
  const flownTargetRef = useRef<string | null>(null);
  const isFirstPitchRef = useRef(true);
  const target = bowl?.id ?? "overview";

  useEffect(() => {
    if (!map || !isLoaded || flownTargetRef.current === target) {
      return;
    }
    const isIntro = flownTargetRef.current === null;
    flownTargetRef.current = target;
    if (isIntro && hasStartPosition) {
      return;
    }
    const camera = bowl ? { center: bowl.center, zoom: 14, pitch: 55 } : overviewCamera;
    const nextCamera = { ...camera, pitch: is2d ? 0 : camera.pitch };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      map.jumpTo(nextCamera);
      return;
    }
    map.flyTo({ ...nextCamera, duration: isIntro ? 7000 : 2400, essential: true });
  }, [map, isLoaded, target, bowl, is2d, hasStartPosition]);

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }
    map.setMaxPitch(is2d ? 0 : maxPitch);
    const isFirstRun = isFirstPitchRef.current;
    isFirstPitchRef.current = false;
    if (isFirstRun && !is2d) {
      return;
    }
    const pitch = is2d ? 0 : overviewCamera.pitch;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      map.jumpTo({ pitch });
      return;
    }
    map.easeTo({ pitch, duration: 600 });
  }, [map, isLoaded, is2d]);

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
  seriesByBowl,
  banDate,
  labels,
}: {
  locale: Locale;
  bowls: PublicBowl[];
  seriesByBowl: Record<string, BowlSeries>;
  banDate: string;
  labels: { map: Dictionary["map"]; bowls: Dictionary["bowls"]; common: Dictionary["common"] };
}) {
  const t = labels.map;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pairs = interferogramCatalog.pairs;
  const positionTimerRef = useRef(0);

  const isBowls = searchParams.get("show") !== "radar";
  const withBan = searchParams.get("ban") !== "off";
  const is2d = searchParams.get("view") === "2d";
  const selectedBowl = bowls.find((bowl) => bowl.id === searchParams.get("bowl")) ?? null;
  const [startPosition] = useState(() => parsePosition(searchParams.get("at")));
  const [year, setYear] = useState(() => parseYear(searchParams.get("year")));
  const [passIndex, setPassIndex] = useState(() => parsePassIndex(searchParams.get("pass"), pairs.length));
  const years = year - currentYear;
  const pair = pairs[passIndex];
  const [lastBowl, setLastBowl] = useState(selectedBowl);
  if (selectedBowl !== null && selectedBowl !== lastBowl) {
    setLastBowl(selectedBowl);
  }
  const detailBowl = selectedBowl ?? lastBowl;
  const detailSeries = detailBowl ? seriesByBowl[detailBowl.id] : undefined;
  const isDetailOpen = isBowls && selectedBowl !== null;

  function setParam(name: string, value: string | null) {
    const nextParams = new URLSearchParams(window.location.search);
    if (value === null) {
      nextParams.delete(name);
    } else {
      nextParams.set(name, value);
    }
    window.history.replaceState(null, "", `${pathname}?${nextParams}`);
  }

  function rememberPosition(position: Position) {
    window.clearTimeout(positionTimerRef.current);
    positionTimerRef.current = window.setTimeout(() => {
      setParam("at", formatPosition(position));
    }, positionWriteDelayMs);
  }

  function selectBowl(bowlId: string | null) {
    setParam("bowl", bowlId);
  }

  useEffect(() => {
    if (!selectedBowl) {
      return;
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setParam("bowl", null);
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  });

  function changeYear(nextYear: number) {
    setYear(nextYear);
    setParam("year", String(nextYear));
  }

  function changeBan(nextWithBan: boolean) {
    setParam("ban", nextWithBan ? null : "off");
  }

  function showPass(value: number) {
    setPassIndex(Math.floor(value));
  }

  function commitPass(value: number) {
    const nextIndex = Math.floor(value);
    setPassIndex(nextIndex);
    setParam("pass", String(nextIndex));
  }

  const playback = usePlayback({
    value: passIndex,
    min: 0,
    max: pairs.length - 1,
    unitsPerSecond: passesPerSecond,
    onFrame: showPass,
    onStop: commitPass,
  });

  function changeShow(value: string) {
    playback.pause();
    setParam("show", value === "radar" ? "radar" : null);
  }

  function scrub(value: number) {
    playback.pause();
    commitPass(value);
  }

  function togglePlay() {
    if (playback.isPlaying) {
      playback.pause();
    } else {
      playback.play();
    }
  }

  const baselineYears = defaultYear - currentYear;
  const summaryBowl = selectedBowl ?? bowls.toSorted((a, b) => b.rateAfterBanMmYr - a.rateAfterBanMmYr)[0];
  const summaryPrediction = predictionFor(summaryBowl.id, selectedBowl?.id ?? null, { years, withBan }, baselineYears);
  const summaryYear = currentYear + summaryPrediction.years;
  const summaryDrop = dropMeters(summaryBowl, summaryPrediction.years, summaryPrediction.withBan);

  function describeView() {
    if (!isBowls) {
      return fill(t.radarSummary, {
        start: formatDate(locale, pair.referenceDate),
        end: formatDate(locale, pair.secondaryDate),
        days: Math.round((Date.parse(pair.secondaryDate) - Date.parse(pair.referenceDate)) / 86_400_000),
      });
    }
    const values = { name: summaryBowl.name, meters: summaryDrop.toFixed(2), year: summaryYear };
    if (summaryPrediction.withBan) {
      return fill(t.bowlSummary, values);
    }
    const extra = summaryDrop - dropMeters(summaryBowl, summaryPrediction.years, true);
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
            onChange={(value) => selectBowl(value === allBowls ? null : value)}
          />
        )}
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Switch
              size="sm"
              checked={is2d}
              onCheckedChange={(checked) => setParam("view", checked ? "2d" : null)}
            />
            {t.view2d}
          </label>
          <LanguageSwitch locale={locale} label={labels.common.switchLanguage} />
          <Button size="sm" nativeButton={false} render={<Link href={`/${locale}`} />}>
            {labels.common.openDesk}
          </Button>
        </div>
        <p className="w-full text-sm text-muted-foreground" aria-live={playback.isPlaying ? "off" : "polite"}>
          {describeView()}
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="relative min-h-0 flex-1">
          <Map
            center={startPosition?.center ?? [112, -2]}
            zoom={startPosition?.zoom ?? 2.6}
            pitch={startPosition && !is2d ? overviewCamera.pitch : 0}
            bearing={startPosition ? overviewCamera.bearing : 0}
            projection={globe}
            maxPitch={maxPitch}
            onViewportChange={rememberPosition}
          >
            <BuildingsLayer />
            {isBowls ? (
              <BowlLayer
                bowls={bowls}
                years={years}
                withBan={withBan}
                baselineYears={baselineYears}
                selectedBowlId={selectedBowl?.id ?? null}
                onSelect={selectBowl}
                onDeselect={() => selectBowl(null)}
              />
            ) : (
              <InterferogramLayer pair={pair} />
            )}
            <MapCamera bowl={selectedBowl} is2d={is2d} hasStartPosition={startPosition !== null} />
          </Map>
          <div
            className={`absolute top-4 left-4 flex max-w-64 flex-col gap-2 glass rounded-4xl border border-transparent p-3 text-xs text-muted-foreground shadow-md ${selectedBowl ? "max-lg:hidden" : ""}`}
          >
            {isBowls ? (
              <>
                <div className="h-2 rounded-full bg-linear-to-r from-rate-slow via-rate-middle to-rate-fast" />
                <div className="flex justify-between tabular-nums">
                  <span>{slowRateMmYr} mm/yr</span>
                  <span>{fastRateMmYr} mm/yr</span>
                </div>
                <p>{fill(t.rateLegend, { year: defaultYear })}</p>
              </>
            ) : (
              <>
                <div className="phase-cycle-legend h-2 rounded-full" />
                <p>{t.phaseLegend}</p>
              </>
            )}
          </div>
          {isBowls && (
            <MapBowlList
              bowls={bowls}
              selectedBowlId={selectedBowl?.id ?? null}
              years={years}
              withBan={withBan}
              baselineYears={baselineYears}
              onSelect={selectBowl}
              title={t.listTitle}
              rankTemplate={t.rankLabel}
              showLabel={t.showList}
              hideLabel={t.hideList}
            />
          )}
          {!isBowls && (
            <MapTimeline
              isPlaying={playback.isPlaying}
              onTogglePlay={togglePlay}
              playLabel={t.play}
              pauseLabel={t.pause}
              sliderLabel={t.pass}
              min={0}
              max={pairs.length - 1}
              value={passIndex}
              onValueChange={scrub}
              valueLabel={`${passIndex + 1}/${pairs.length}`}
            >
              <p className="text-xs text-muted-foreground tabular-nums">
                {formatDate(locale, pair.referenceDate)} – {formatDate(locale, pair.secondaryDate)}
              </p>
            </MapTimeline>
          )}
        </div>
        {isBowls ? (
          <div
            inert={!isDetailOpen}
            className={cn(
              "overflow-hidden transition-panel-resize md:shrink-0",
              isDetailOpen ? "h-2/5 md:h-auto md:w-md" : "h-0 md:w-0",
            )}
          >
            {detailBowl && detailSeries ? (
              <MapBowlDetail
                key={detailBowl.id}
                locale={locale}
                bowl={detailBowl}
                series={detailSeries}
                banDate={banDate}
                year={year}
                withBan={withBan}
                onYearChange={changeYear}
                onBanChange={changeBan}
                onClose={() => selectBowl(null)}
                labels={labels}
              />
            ) : null}
          </div>
        ) : null}
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
