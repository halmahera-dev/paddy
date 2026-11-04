"use client";

import { cn } from "@hollou/ui/lib/utils";
import { useRef, useState } from "react";

import { Dots, Line, Solid } from "@/components/iso/react/draw";
import { follow, useInView, useLoop } from "@/components/iso/react/live";
import {
  HEIGHT,
  PARTS,
  START_LEVEL,
  TOUR_SECONDS,
  WIDTH,
  levelFacts,
  sceneAt,
} from "@/features/landing/components/sinking-scene";
import type { Dictionary } from "@/lib/i18n";
import "@/components/iso/iso.css";
import "@/features/landing/components/sinking-figure.css";

const TOUR_PHASE = Math.acos(1 - 2 * START_LEVEL);
const FOLLOW_SECONDS = 0.3;

function tourAt(seconds: number) {
  return 0.5 - 0.5 * Math.cos(TOUR_PHASE + (2 * Math.PI * seconds) / TOUR_SECONDS);
}

export function SinkingFigure({ t }: { t: Dictionary["landing"]["problem"]["figure"] }) {
  const [shown, setShown] = useState(START_LEVEL);
  const [target, setTarget] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const level = useRef(START_LEVEL);
  const clock = useRef(0);
  const isInView = useInView(stageRef);

  const kick = useLoop((dt, isCalm) => {
    clock.current += dt;
    const goal = target ?? (isCalm ? START_LEVEL : tourAt(clock.current));
    level.current = follow(level.current, goal, dt, FOLLOW_SECONDS, isCalm);
    setShown(level.current);
    return target === null ? !isCalm : level.current !== goal;
  }, isInView);

  const scene = sceneAt(shown);
  const facts = levelFacts(shown);

  return (
    <figure className="grid gap-6 rounded-4xl bg-card p-4 shadow-card sm:p-6">
      <div ref={stageRef} className="iso">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={t.description}
          className="iso-svg"
        >
          <path className="iso-halo" d={PARTS.halo} />
          {PARTS.feet.map((foot, index) => {
            return <Solid key={index} paths={foot} tone="lo" />;
          })}
          <Solid paths={PARTS.base} tone="lo" />
          <Line d={PARTS.baseTicks.minor} tone="lo" />
          <Line d={PARTS.baseTicks.major} tone="mid" />
          <Dots points={PARTS.baseScrews} size={0.5} />

          <g>
            <path className="iso-shade" data-shade="0" d={scene.sideBands.soil + scene.sideBands.clay + scene.sideBands.aquifer} />
            <path className="fill-chart-3/20" d={scene.sideBands.soil} />
            <path className="fill-foreground/10" d={scene.sideBands.clay} />
            <path className="fill-chart-2/35" d={scene.sideBands.aquifer} />
            <Line d={scene.sideBands.clayLines} tone="faint" />
            <Line d={scene.sideBands.clayLine} tone="lo" />
            <Line d={scene.sideBands.aquiferLine} tone="lo" />
            <Line d={scene.edges.rightBack} tone="mid" />
          </g>

          <g className="iso-solid" data-seamless="">
            {scene.cells.map((cell, index) => {
              if (cell.kind === "water") {
                return (
                  <path key={index} className="sinking-water" d={cell.d} />
                );
              }
              if (cell.kind === "top") return <path key={index} className="iso-top" d={cell.d} />;
              return <path key={index} className="iso-shade" data-shade={cell.kind} d={cell.d} />;
            })}
          </g>
          <Line d={scene.edges.back} tone="mid" />
          <Line d={scene.edges.right} tone="hi" />
          <g opacity={scene.crackOpacity}>
            {scene.cracks.map((crack, index) => {
              return <Line key={index} d={crack} tone="mid" />;
            })}
          </g>

          <g>
            <path className="iso-shade" data-shade="3" d={scene.front.whole} />
            <path className="fill-chart-3/20" d={scene.front.soil} />
            <path className="fill-foreground/10" d={scene.front.clay} />
            <path className="fill-chart-3/10" d={scene.front.dry} />
            <path className="fill-chart-2/35" d={scene.front.wet} />
            <Dots points={PARTS.sand} size={0.45} tone="lo" />
            {scene.front.clayLines.map((line, index) => {
              return <Line key={index} d={line} tone="faint" />;
            })}
            <Line d={scene.front.clayLine} tone="lo" />
            <Line d={scene.front.aquiferLine} tone="lo" />
            <Line d={scene.front.waterLine} tone="blue" />
            <Line d={scene.front.seaLine} tone="blue" dashed />
            <Line d={scene.front.groundLine} tone="hi" />
            <Line d={scene.front.leftEdge} tone="hi" />
            <Line d={scene.front.rightEdge} tone="hi" />
            <Line d={PARTS.depthRuler.minor} tone="lo" />
            <Line d={PARTS.depthRuler.major} tone="mid" />
            {scene.front.inflow.map((line, index) => {
              return <Line key={index} d={line} tone="blue" flow free />;
            })}
          </g>

          {PARTS.houses.map((house, index) => {
            return (
              <g key={house.key} transform={scene.houses[index]}>
                <Solid paths={house.body} tone="mid" />
                <Line d={house.windows} tone="lo" />
                <Line d={house.mullions} tone="faint" />
                <Solid paths={house.chimney} tone="mid" />
                <Solid paths={house.roof} tone="hi" />
                <Line d={house.ridge} tone="faint" />
              </g>
            );
          })}

          <g>
            <Pipe tube={scene.casing} />
            <Pipe tube={scene.submersible} tone="hi" isDark />
            <Line d={scene.cable} tone="mid" />
            <Pipe tube={scene.intakeScreen} isWet />
            <Line d={scene.slots} tone="mid" />
          </g>
          <g transform={scene.pumpTransform}>
            <Solid paths={PARTS.pumpPlate} tone="mid" />
            <Dots points={PARTS.pumpScrews} size={0.45} />
            <Solid paths={PARTS.pumpMotor} tone="hi" />
            <Line d={PARTS.pumpRibs} tone="lo" />
            <Line d={PARTS.pumpFlange} tone="faint" />
            <Solid paths={PARTS.pumpBox} tone="mid" />
            <Solid paths={PARTS.pumpCap} tone="hi" lit />
            <Line d={PARTS.pumpBolts} tone="mid" />
          </g>

          <Solid paths={PARTS.tank} tone="mid" />
          <Line d={PARTS.tankBands} tone="faint" />
          <Line d={scene.tankLevel} tone="blue" />
          <Solid paths={PARTS.tankLid} tone="mid" />
          <Solid paths={PARTS.tankHatch} tone="hi" />
          <g transform={scene.staffTransform}>
            <Solid paths={PARTS.staff} tone="mid" />
            <Line d={PARTS.staffTicks.minor} tone="lo" />
            <Line d={PARTS.staffTicks.major} tone="hi" />
            <Line d={PARTS.staffTop} tone="mid" />
          </g>
          {scene.isStaffWet ? <Line d={PARTS.seaRing} tone="blue" /> : null}
          <g className="sinking-stream" opacity={Math.min(1, shown * 6)}>
            <Line d={scene.stream} tone="blue" flow />
            <Dots points={scene.streamEnds} size={1.1} tone="hi" />
          </g>
        </svg>
      </div>

      <div className="grid gap-4 sm:flex sm:items-end sm:gap-8">
        <label className="grid flex-1 gap-2">
          <span className="flex items-baseline justify-between">
            <span className="type-label-mono text-muted-foreground">{t.pumpLabel}</span>
            <span className="font-heading text-2xl font-medium tabular-nums">{facts.percent}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={facts.percent}
            onChange={(event) => {
              setTarget(Number(event.target.value) / 100);
              kick();
            }}
            className="w-full accent-brand"
          />
        </label>

        <dl className="grid grid-cols-2 gap-6 sm:gap-8">
          <div>
            <dt className="type-caption text-muted-foreground">{t.water}</dt>
            <dd className="font-heading text-2xl font-medium tabular-nums">{facts.waterLeft}%</dd>
          </div>
          <div>
            <dt className="type-caption text-muted-foreground">{t.overPump}</dt>
            <dd
              className={cn(
                "font-heading text-2xl font-medium tabular-nums",
                facts.isBelowSea && "text-destructive",
              )}
            >
              −{facts.cmPerYear} {t.perYear}
            </dd>
          </div>
        </dl>
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 type-caption text-muted-foreground">
        <span>{t.note}</span>
        <span className={cn("type-label-mono", facts.isBelowSea && "text-destructive")}>
          {facts.isBelowSea ? t.belowSea : t.aboveSea}
        </span>
      </figcaption>
    </figure>
  );
}

function Pipe({
  tube,
  tone = "mid",
  isDark = false,
  isWet = false,
}: {
  tube: ReturnType<typeof sceneAt>["casing"];
  tone?: "mid" | "hi";
  isDark?: boolean;
  isWet?: boolean;
}) {
  const body = isDark ? 0 : 2;
  return (
    <g>
      <path className="iso-shade" data-shade={isDark ? 1 : 2} d={tube.lowerCap} />
      <path className="iso-shade" data-shade={isDark ? 1 : 3} d={tube.left} />
      <path className="iso-top" d={tube.middle} />
      <path className="iso-shade" data-shade={body} d={tube.right} />
      {isWet ? <path className="fill-chart-2/35" d={tube.left + tube.middle + tube.right + tube.lowerCap} /> : null}
      <path className="iso-top" d={tube.upperCap} />
      <Line d={tube.edges} tone={tone} />
      <Line d={tube.upperCap} tone={tone} />
    </g>
  );
}
