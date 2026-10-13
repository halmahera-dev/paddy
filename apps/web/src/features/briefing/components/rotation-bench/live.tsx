"use client";

import * as React from "react";
import { follow, spring, useInView, useLoop, useReadout, type Spring } from "@/components/iso/react/live";
import {
  CROPS,
  REST_PLAN,
  TOUR_PLANS,
  cropNeed,
  nextCrop,
  nitrogenBalance,
  readoutOf,
  seasonRain,
  trayLabel,
  turnsBetween,
  type Plan,
} from "./model";
import { COLLAR_H, HEIGHT, MM, WIDTH, collarShift, gapPath, knobTransform, needlePath } from "./view";

const COLLAR_STIFFNESS = 60;
const KNOB_STIFFNESS = 110;
const NEEDLE_STIFFNESS = 40;
const FADE_SECONDS = 0.07;
const KNOB_TURN = 120;
const TOUR_STEP = 3.5;
const TOUR_FIRST = 1.4;
const RESUME_MS = 9000;
const MIN_GAP = 1;

interface Bench {
  plan: Plan;
  collars: Spring[];
  knobs: Spring[];
  knobGoals: number[];
  needle: Spring;
  fades: number[][];
  touring: boolean;
  tourClock: number;
  tourIndex: number;
  touchedAt: number;
  hovering: boolean;
  focused: boolean;
}

interface Gap {
  group: SVGGElement | null;
  line: SVGPathElement | null;
  low: SVGCircleElement | null;
  high: SVGCircleElement | null;
}

interface Nodes {
  collarBack: (SVGGElement | null)[];
  collarFront: (SVGGElement | null)[];
  gaps: Gap[];
  knobs: (SVGGElement | null)[];
  crops: (SVGGElement | null)[][];
  trays: (SVGGElement | null)[];
  needle: SVGPathElement | null;
}

function needOf(plan: Plan, tray: number) {
  return cropNeed[plan[tray]!][tray]!;
}

function makeBench(): Bench {
  const plan = REST_PLAN;
  return {
    plan,
    collars: plan.map((_, tray) => ({ at: needOf(plan, tray), rate: 0 })),
    knobs: plan.map((crop) => ({ at: CROPS.indexOf(crop) * KNOB_TURN, rate: 0 })),
    knobGoals: plan.map((crop) => CROPS.indexOf(crop) * KNOB_TURN),
    needle: { at: nitrogenBalance(plan), rate: 0 },
    fades: plan.map((crop) => CROPS.map((option) => (option === crop ? 1 : 0))),
    touring: false,
    tourClock: 0,
    tourIndex: -1,
    touchedAt: Number.NEGATIVE_INFINITY,
    hovering: false,
    focused: false,
  };
}

function move(state: Spring, goal: number, dt: number, stiffness: number, calm: boolean) {
  if (calm) {
    state.at = goal;
    state.rate = 0;
    return true;
  }
  return spring(state, goal, dt, stiffness, 2 * Math.sqrt(stiffness));
}

function gapOf(tray: number, collarMm: number) {
  const rain = seasonRain[tray]!;
  const visible = (collarMm - rain) * MM - COLLAR_H / 2 > MIN_GAP;
  return { ...gapPath(tray, rain, collarMm), visible };
}

function trayOf(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const node = target.closest<SVGGElement>('[data-part="tray"]');
  return node ? Number(node.dataset.tray) : null;
}

interface Props {
  label: string;
  base: React.ReactNode;
  gauges: { pedestal: React.ReactNode; collarBack: React.ReactNode; tube: React.ReactNode; collarFront: React.ReactNode; cap: React.ReactNode }[];
  rail: React.ReactNode;
  trays: { ring: React.ReactNode; back: React.ReactNode; crops: React.ReactNode[]; front: React.ReactNode; knob: React.ReactNode }[];
  dial: React.ReactNode;
  hub: React.ReactNode;
}

export function RotationBenchLive(props: Props) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const root = React.useRef<HTMLDivElement | null>(null);
  const status = React.useRef<HTMLParagraphElement | null>(null);
  const bench = React.useRef<Bench>(makeBench());
  const resume = React.useRef(0);
  const nodes = React.useRef<Nodes>({
    collarBack: [],
    collarFront: [],
    gaps: [{ group: null, line: null, low: null, high: null }, { group: null, line: null, low: null, high: null }, { group: null, line: null, low: null, high: null }],
    knobs: [],
    crops: [[], [], []],
    trays: [],
    needle: null,
  });
  const inView = useInView(root);
  const start = bench.current;

  function announce() {
    const { plan } = bench.current;
    const text = readoutOf(plan);
    say(text);
    if (status.current) status.current.textContent = text;
    plan.forEach((_, tray) => nodes.current.trays[tray]?.setAttribute("aria-label", trayLabel(plan, tray)));
  }

  function draw() {
    const b = bench.current;
    const n = nodes.current;
    b.plan.forEach((_, tray) => {
      const shift = collarShift(b.collars[tray]!.at);
      n.collarBack[tray]?.setAttribute("transform", shift);
      n.collarFront[tray]?.setAttribute("transform", shift);
      n.knobs[tray]?.setAttribute("transform", knobTransform(tray, b.knobs[tray]!.at));
      const gap = gapOf(tray, b.collars[tray]!.at);
      const parts = n.gaps[tray]!;
      parts.group?.setAttribute("opacity", gap.visible ? "1" : "0");
      parts.line?.setAttribute("d", gap.d);
      parts.low?.setAttribute("cx", `${gap.low[0]}`);
      parts.low?.setAttribute("cy", `${gap.low[1]}`);
      parts.high?.setAttribute("cx", `${gap.high[0]}`);
      parts.high?.setAttribute("cy", `${gap.high[1]}`);
      CROPS.forEach((_, crop) => n.crops[tray]![crop]?.setAttribute("opacity", `${b.fades[tray]![crop]}`));
    });
    n.needle?.setAttribute("d", needlePath(b.needle.at));
  }

  function show(next: Plan) {
    const b = bench.current;
    next.forEach((crop, tray) => {
      b.knobGoals[tray]! += turnsBetween(b.plan[tray]!, crop) * KNOB_TURN;
    });
    b.plan = next;
    announce();
  }

  function advanceTour(dt: number, calm: boolean) {
    const b = bench.current;
    const wanted = !calm && !b.hovering && !b.focused && performance.now() - b.touchedAt > RESUME_MS;
    if (!wanted) {
      b.touring = false;
      return;
    }
    if (!b.touring) {
      b.touring = true;
      b.tourClock = Number.isFinite(b.touchedAt) ? 0 : -TOUR_FIRST;
      b.tourIndex = -1;
    }
    b.tourClock += dt;
    if (b.tourClock < 0) return;
    const index = Math.floor(b.tourClock / TOUR_STEP) % TOUR_PLANS.length;
    if (index === b.tourIndex) return;
    b.tourIndex = index;
    show(TOUR_PLANS[index]!);
  }

  function tick(dt: number, calm: boolean) {
    const b = bench.current;
    advanceTour(dt, calm);
    let settled = true;
    b.plan.forEach((crop, tray) => {
      if (!move(b.collars[tray]!, needOf(b.plan, tray), dt, COLLAR_STIFFNESS, calm)) settled = false;
      if (!move(b.knobs[tray]!, b.knobGoals[tray]!, dt, KNOB_STIFFNESS, calm)) settled = false;
      CROPS.forEach((option, index) => {
        const goal = option === crop ? 1 : 0;
        b.fades[tray]![index] = follow(b.fades[tray]![index]!, goal, dt, FADE_SECONDS, calm);
        if (b.fades[tray]![index] !== goal) settled = false;
      });
    });
    if (!move(b.needle, nitrogenBalance(b.plan), dt, NEEDLE_STIFFNESS, calm)) settled = false;
    draw();
    return !settled || b.touring;
  }

  const kick = useLoop(tick, inView);

  function touch() {
    bench.current.touchedAt = performance.now();
    window.clearTimeout(resume.current);
    resume.current = window.setTimeout(kick, RESUME_MS + 50);
  }

  function cycle(tray: number) {
    const next: Plan = [...bench.current.plan];
    next[tray] = nextCrop(next[tray]!);
    show(next);
    touch();
    kick();
  }

  React.useEffect(() => {
    announce();
    return () => window.clearTimeout(resume.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={(node) => {
        root.current = node;
        anchor.current = node;
      }}
      className="rb-stage"
      role="group"
      aria-label="Crop rotation bench"
      onClick={(event) => {
        const tray = trayOf(event.target);
        if (tray !== null) cycle(tray);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const tray = trayOf(event.target);
        if (tray === null) return;
        event.preventDefault();
        if (!event.repeat) cycle(tray);
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        bench.current.hovering = true;
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        bench.current.hovering = false;
        touch();
      }}
      onFocus={() => {
        bench.current.focused = true;
      }}
      onBlur={() => {
        bench.current.focused = false;
        touch();
      }}
    >
      <svg className="iso-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="group" aria-label={props.label} focusable="false">
        {props.base}
        {props.gauges.map((gauge, tray) => {
          const gap = gapOf(tray, start.collars[tray]!.at);
          const shift = collarShift(start.collars[tray]!.at);
          return (
            <g key={tray}>
              {gauge.pedestal}
              <g
                ref={(node) => {
                  nodes.current.collarBack[tray] = node;
                }}
                transform={shift}
              >
                {gauge.collarBack}
              </g>
              {gauge.tube}
              <g
                ref={(node) => {
                  nodes.current.gaps[tray]!.group = node;
                }}
                className="iso-wire rb-gap"
                data-tone="hi"
                opacity={gap.visible ? 1 : 0}
              >
                <path
                  ref={(node) => {
                    nodes.current.gaps[tray]!.line = node;
                  }}
                  className="iso-line"
                  data-tone="hi"
                  data-dashed=""
                  d={gap.d}
                />
                <circle
                  ref={(node) => {
                    nodes.current.gaps[tray]!.low = node;
                  }}
                  className="iso-wire-end"
                  cx={gap.low[0]}
                  cy={gap.low[1]}
                  r={1.1}
                />
                <circle
                  ref={(node) => {
                    nodes.current.gaps[tray]!.high = node;
                  }}
                  className="iso-wire-end"
                  cx={gap.high[0]}
                  cy={gap.high[1]}
                  r={1.1}
                />
              </g>
              <g
                ref={(node) => {
                  nodes.current.collarFront[tray] = node;
                }}
                transform={shift}
              >
                {gauge.collarFront}
              </g>
              {gauge.cap}
            </g>
          );
        })}
        {props.rail}
        {props.trays.map((tray, index) => (
          <g
            key={index}
            ref={(node) => {
              nodes.current.trays[index] = node;
            }}
            className="rb-tray"
            data-part="tray"
            data-tray={index}
            role="button"
            tabIndex={0}
            aria-label={trayLabel(start.plan, index)}
          >
            {tray.ring}
            {tray.back}
            {tray.crops.map((crop, option) => (
              <g
                key={option}
                ref={(node) => {
                  nodes.current.crops[index]![option] = node;
                }}
                opacity={start.fades[index]![option]}
              >
                {crop}
              </g>
            ))}
            {tray.front}
            <g
              ref={(node) => {
                nodes.current.knobs[index] = node;
              }}
              transform={knobTransform(index, start.knobs[index]!.at)}
            >
              {tray.knob}
            </g>
          </g>
        ))}
        {props.dial}
        <path
          ref={(node) => {
            nodes.current.needle = node;
          }}
          className="iso-line"
          data-tone="lit"
          data-free=""
          d={needlePath(start.needle.at)}
        />
        {props.hub}
      </svg>
      <p ref={status} className="sr-only" role="status">
        {readoutOf(start.plan)}
      </p>
    </div>
  );
}
