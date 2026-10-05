"use client";

import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@paddy-field/ui/components/button";
import { Slider } from "@paddy-field/ui/components/slider";
import { useEffect, useState } from "react";

import type { Farm } from "@/features/farm/farm-queries";

import { daysBetween } from "@/features/farm/crop-progress";

import { type FieldMoment, momentAt, seasonSpanDays, seasonStart } from "../field-timeline";
import { FieldDiorama } from "./field-diorama";

const speeds = [
  { label: "1 wk/s", daysPerSecond: 7 },
  { label: "2 wk/s", daysPerSecond: 14 },
];

export function FieldStage({ farm }: { farm: Farm }) {
  const spanDays = seasonSpanDays(farm);
  const [day, setDay] = useState(spanDays);
  const [playing, setPlaying] = useState(false);
  const [daysPerSecond, setDaysPerSecond] = useState(speeds[0].daysPerSecond);
  const isPlaying = playing && day < spanDays;
  const moment = momentAt(farm, day);

  useEffect(() => {
    if (!isPlaying) return;
    let frame = 0;
    let last = performance.now();
    function tick(now: number) {
      const elapsedSeconds = Math.max(now - last, 0) / 1000;
      last = now;
      setDay(function advance(current) {
        return Math.min(current + elapsedSeconds * daysPerSecond, spanDays);
      });
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, daysPerSecond, spanDays]);

  function togglePlaying() {
    if (day >= spanDays) setDay(0);
    setPlaying(!isPlaying);
  }

  function jumpTo(nextDay: number) {
    setPlaying(false);
    setDay(nextDay);
  }

  return (
    <div className="relative h-full w-full bg-linear-to-b from-muted to-background">
      <FieldDiorama farm={farm} moment={moment} day={day} />
      <DayCard moment={moment} isToday={day >= spanDays} />
      <div className="absolute inset-x-4 bottom-4 mx-auto max-w-3xl rounded-3xl border bg-card/85 p-4 shadow-lg backdrop-blur-xl md:group-has-data-[state=expanded]/sidebar-wrapper:left-(--sidebar-width)">
        <div className="mb-3 flex items-center gap-3">
          <Button
            size="icon-sm"
            onClick={togglePlaying}
            aria-label={isPlaying ? "Pause" : day >= spanDays ? "Replay season" : "Play"}
          >
            <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} />
          </Button>
          <span className="text-sm font-semibold tabular-nums">{formatDate(moment.date)}</span>
          <span className="text-sm text-muted-foreground">{moment.stage}</span>
          <div className="ml-auto flex gap-1">
            {speeds.map((speed) => (
              <Button
                key={speed.label}
                size="xs"
                variant={speed.daysPerSecond === daysPerSecond ? "secondary" : "ghost"}
                onClick={() => setDaysPerSecond(speed.daysPerSecond)}
              >
                {speed.label}
              </Button>
            ))}
          </div>
        </div>
        <SeasonStrip farm={farm} spanDays={spanDays} onJump={jumpTo} />
        <Slider
          aria-label="Season day"
          min={0}
          max={spanDays}
          step={0.25}
          value={[day]}
          onValueChange={(value) => jumpTo(Array.isArray(value) ? value[0] : value)}
        />
      </div>
    </div>
  );
}

function SeasonStrip({
  farm,
  spanDays,
  onJump,
}: {
  farm: Farm;
  spanDays: number;
  onJump: (day: number) => void;
}) {
  const start = seasonStart(farm);
  const tallestMm = Math.max(
    ...farm.weeklyWater.map((week) => Math.max(week.rainMm, week.demandMm?.[1] ?? 0)),
  );

  return (
    <div className="relative mb-2 h-12">
      <div className="flex h-full items-end gap-0.5">
        {farm.weeklyWater.map((week) => (
          <div
            key={week.startsOn}
            className="relative h-full flex-1"
            title={`${week.week}: ${week.rainMm} mm rain`}
          >
            <div
              className="absolute inset-x-0 bottom-0 h-(--rain) rounded-t-sm bg-primary/70"
              style={{ "--rain": `${(week.rainMm / tallestMm) * 100}%` } as React.CSSProperties}
            />
            {week.demandMm && (
              <div
                className="absolute inset-x-0 bottom-(--demand) border-t-2 border-dashed border-chart-2"
                style={
                  {
                    "--demand": `${((week.demandMm[0] + week.demandMm[1]) / 2 / tallestMm) * 100}%`,
                  } as React.CSSProperties
                }
              />
            )}
          </div>
        ))}
      </div>
      {farm.alerts.map((alert) => {
        const alertDay = Math.max(daysBetween(start, alert.observedFrom), 0);
        return (
          <button
            key={alert.id}
            type="button"
            onClick={() => onJump(alertDay)}
            className="absolute -top-1 left-(--at) size-3 -translate-x-1/2 rounded-full border-2 border-card bg-destructive transition-transform hover:scale-125"
            style={{ "--at": `${(alertDay / spanDays) * 100}%` } as React.CSSProperties}
            aria-label={`Jump to ${alert.title}, ${alert.observed}`}
            title={`${alert.title} · ${alert.observed}`}
          />
        );
      })}
    </div>
  );
}

function DayCard({ moment, isToday }: { moment: FieldMoment; isToday: boolean }) {
  const { week } = moment;
  const demandMidMm = week.demandMm ? (week.demandMm[0] + week.demandMm[1]) / 2 : null;

  return (
    <div className="absolute top-4 right-4 w-64 rounded-3xl border bg-card/85 p-4 text-sm shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Week of {week.week}</span>
        {isToday && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
            Today
          </span>
        )}
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-y-1.5">
        <dt className="text-muted-foreground">Rain</dt>
        <dd className="text-right font-medium tabular-nums">{week.rainMm} mm</dd>
        <dt className="text-muted-foreground">Crop demand</dt>
        <dd className="text-right font-medium tabular-nums">
          {week.demandMm ? `${week.demandMm[0]}–${week.demandMm[1]} mm` : "Not planted"}
        </dd>
        {demandMidMm !== null && (
          <>
            <dt className="text-muted-foreground">Rain covers</dt>
            <dd className="text-right font-medium tabular-nums">
              ~{Math.round((week.rainMm / demandMidMm) * 100)}%
            </dd>
          </>
        )}
      </dl>
      {moment.activeAlerts.map((alert) => (
        <p key={alert.id} className="mt-3 rounded-xl bg-destructive/10 px-2.5 py-1.5 text-xs">
          {alert.title} · {alert.observed}
        </p>
      ))}
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
