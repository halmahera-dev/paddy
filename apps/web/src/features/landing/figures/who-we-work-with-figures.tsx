import "@/components/iso/iso.css";
import {
  boxCorners,
  corners,
  cylinder,
  depthOf,
  fitProjection,
  insetPlan,
  lineOnTop,
  planOutline,
  pointsAt,
  ring,
  rise,
  segment,
  slabOf,
  type Plan,
  type Point3,
} from "@/components/iso/iso-kit";
import * as G from "@/components/iso/lathe.mjs";
import { Dots, IsoFigure, Line, Solid } from "@/components/iso/react/draw";
import "@/features/landing/figures/what-we-build-figures.css";
import "@/features/landing/figures/who-we-work-with-figures.css";

const WIDTH = 280;
const HEIGHT = 170;
const BENCH: Plan = { x: -80, y: -58, w: 160, d: 116, r: 10 };
const FLOOR = 5;
const UP: Point3 = [0, 0, 1];

const P = fitProjection(
  [...boxCorners(BENCH, 0, FLOOR), [0, 0, FLOOR + 84], [-50, 0, FLOOR + 80], [50, 0, FLOOR + 80]],
  WIDTH,
  HEIGHT,
  { pad: 6, azimuth: 45, elevation: 30 },
);

type Hue = "rose" | "blue" | "amber" | "green" | "violet" | "cyan";

function frameAt(x: number, y: number, z: number) {
  return G.frameOf([x, y, z], UP, [1, 0, 0], [0, 1, 0]);
}

function nearerLast<T>(items: T[], pointOf: (item: T) => Point3) {
  return [...items].sort(function byDepth(a, b) {
    return depthOf(pointOf(a), P) - depthOf(pointOf(b), P);
  });
}

function around(radius: number, count: number, phase = 0): [number, number][] {
  return Array.from({ length: count }, function place(_, index) {
    const angle = phase + (index / count) * Math.PI * 2;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  });
}

function span(
  axis: "x" | "y",
  fixed: number,
  from: number,
  to: number,
  level: number,
  key: string,
) {
  const start: Point3 = axis === "x" ? [fixed, from, level] : [from, fixed, level];
  const end: Point3 = axis === "x" ? [fixed, to, level] : [to, fixed, level];
  return <Line key={key} d={segment(start, end, P)} tone="faint" />;
}

function mullion(axis: "x" | "y", fixed: number, at: number, z0: number, z1: number) {
  const point: [number, number] = axis === "x" ? [fixed, at] : [at, fixed];
  return <Line key={`${axis}${at}${z0}`} d={rise(point, z0, z1, P)} tone="faint" />;
}

function Bench({
  hue,
  id,
  label,
  children,
}: {
  hue: Hue;
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  const screws = corners(BENCH, 11).map(function onFloor([x, y]): Point3 {
    return [x, y, FLOOR];
  });
  const paint = {
    "--top-fill": `url(#${id}-top)`,
    "--glow-fill": `url(#${id}-glow)`,
  } as React.CSSProperties;
  return (
    <div className="iso">
      <IsoFigure width={WIDTH} height={HEIGHT} label={label}>
        <Solid paths={slabOf(BENCH, 0, FLOOR, P, 8, 0.8)} tone="lo" />
        <Line d={planOutline(insetPlan(BENCH, 5), FLOOR, P)} tone="faint" />
        <Dots points={pointsAt(screws, P)} size={0.5} tone="mid" />
        <g className={`wwb-${hue}`} style={paint}>
          <defs>
            <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" className="wwb-top-start" />
              <stop offset="1" className="wwb-top-end" />
            </linearGradient>
            <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5" fx="0.34" fy="0.3">
              <stop offset="0" className="wwb-glow-hot" />
              <stop offset="0.5" className="wwb-glow-body" />
              <stop offset="1" className="wwb-glow-edge" />
            </radialGradient>
            <radialGradient id={`${id}-pool`}>
              <stop offset="0" className="wwb-pool-core" />
              <stop offset="1" className="wwb-pool-rim" />
            </radialGradient>
          </defs>
          <path className="wwb-pool" d={ring(0, 0, 50, FLOOR, P, 48)} fill={`url(#${id}-pool)`} />
          <g className="wwb-object">{children}</g>
        </g>
      </IsoFigure>
    </div>
  );
}

function slab(plan: Plan, z: number, height: number, tone: "lo" | "mid" = "mid") {
  return <Solid paths={slabOf(plan, z, height, P, 4, 0.4)} tone={tone} />;
}

export function OfficeBlockFigure() {
  const floorTop = FLOOR + 3;
  const wallH = 46;
  const roofZ = floorTop + wallH;
  const roofH = 3.5;
  const roofTop = roofZ + roofH;
  const foot: Plan = { x: -30, y: -32, w: 64, d: 60, r: 1.5 };
  const west: Plan = { x: -30, y: -32, w: 4, d: 60, r: 0 };
  const north: Plan = { x: -26, y: -32, w: 60, d: 4, r: 0 };
  const east: Plan = { x: 30, y: -32, w: 4, d: 30, r: 0 };
  const south: Plan = { x: -26, y: 24, w: 32, d: 4, r: 0 };
  const low = [floorTop + 8, floorTop + 16];
  const high = [floorTop + 30, floorTop + 38];
  const levels = [...low, ...high];
  const rackX = 10;
  const rackY = 2;
  const rackW = 16;
  const rackD = 14;
  const rackBase = floorTop + 1;
  const rackH = 22;
  const shelves = [4, 9, 14, 19];
  const ledClass = ["", "www-led-b", "www-led-c", "www-led-d"];
  const bolts = corners(foot, 4).map(function onFloor([x, y]): Point3 {
    return [x, y, floorTop];
  });

  return (
    <Bench
      hue="blue"
      id="www-companies"
      label="An office block with the near corner open. A server rack stands inside, and its lights flash."
    >
      {slab(foot, FLOOR, 3, "lo")}
      <Line d={planOutline(insetPlan(foot, 3), floorTop, P, 4)} tone="faint" />
      <Dots points={pointsAt(bolts, P)} size={0.45} tone="mid" />
      <Solid
        paths={slabOf(west, floorTop, wallH, P, 2, 0.3)}
        tone="mid"
        inner={
          <>
            {levels.map(function band(level) {
              return span("x", west.x + west.w, west.y, west.y + west.d, level, `w${level}`);
            })}
            {[-16, 0, 16].map(function post(at) {
              return (
                <g key={at}>
                  {mullion("x", west.x + west.w, at, low[0], low[1])}
                  {mullion("x", west.x + west.w, at, high[0], high[1])}
                </g>
              );
            })}
          </>
        }
      />
      <Solid
        paths={slabOf(north, floorTop, wallH, P, 2, 0.3)}
        tone="mid"
        inner={
          <>
            {levels.map(function band(level) {
              return span("y", north.y + north.d, north.x, north.x + north.w, level, `n${level}`);
            })}
            {[-8, 10, 24].map(function post(at) {
              return (
                <g key={at}>
                  {mullion("y", north.y + north.d, at, low[0], low[1])}
                  {mullion("y", north.y + north.d, at, high[0], high[1])}
                </g>
              );
            })}
          </>
        }
      />
      <Solid
        paths={slabOf(east, floorTop, wallH, P, 2, 0.3)}
        tone="mid"
        inner={
          <>
            {levels.map(function band(level) {
              return span("x", east.x + east.w, east.y, east.y + east.d, level, `e${level}`);
            })}
            {[-22, -10].map(function post(at) {
              return (
                <g key={at}>
                  {mullion("x", east.x + east.w, at, low[0], low[1])}
                  {mullion("x", east.x + east.w, at, high[0], high[1])}
                </g>
              );
            })}
          </>
        }
      />
      <Solid
        paths={slabOf(south, floorTop, wallH, P, 2, 0.3)}
        tone="mid"
        inner={
          <>
            {high.map(function band(level) {
              return span("y", south.y + south.d, south.x, south.x + south.w, level, `s${level}`);
            })}
            {low.map(function band(level) {
              return (
                <g key={level}>
                  {span("y", south.y + south.d, south.x, -14, level, `sl${level}`)}
                  {span("y", south.y + south.d, -6, south.x + south.w, level, `sr${level}`)}
                </g>
              );
            })}
            {mullion("y", south.y + south.d, -20, low[0], low[1])}
            {mullion("y", south.y + south.d, 0, low[0], low[1])}
            {mullion("y", south.y + south.d, -20, high[0], high[1])}
            {mullion("y", south.y + south.d, -10, high[0], high[1])}
            {mullion("y", south.y + south.d, 0, high[0], high[1])}
            <Line d={segment([-14, 28, floorTop], [-6, 28, floorTop], P)} tone="lo" />
            <Line d={rise([-14, 28], floorTop, floorTop + 14, P)} tone="lo" />
            <Line d={rise([-6, 28], floorTop, floorTop + 14, P)} tone="lo" />
            <Line d={segment([-14, 28, floorTop + 14], [-6, 28, floorTop + 14], P)} tone="lo" />
          </>
        }
      />
      {slab({ x: -15, y: 28, w: 12, d: 6, r: 0.4 }, FLOOR, 3, "lo")}
      {slab({ x: -15.5, y: 28, w: 13, d: 1.4, r: 0.2 }, floorTop + 14, 1.6)}
      <Line
        d={segment([18, rackY, rackBase + 8], [18, north.y + north.d, rackBase + 8], P)}
        tone="lo"
      />
      {slab({ x: rackX, y: rackY, w: rackW, d: 2, r: 0.2 }, rackBase, rackH, "lo")}
      {slab({ x: rackX, y: rackY, w: 2, d: rackD, r: 0.2 }, rackBase, rackH)}
      {slab({ x: rackX + rackW - 2, y: rackY, w: 2, d: rackD, r: 0.2 }, rackBase, rackH)}
      {shelves.map(function renderShelf(offset, index) {
        const plan: Plan = { x: rackX + 2, y: rackY + 2, w: rackW - 4, d: rackD - 4, r: 0.2 };
        const top = rackBase + offset + 1;
        return (
          <g key={offset}>
            {slab(plan, rackBase + offset, 1, "lo")}
            <Line
              d={lineOnTop([plan.x, plan.y + 3], [plan.x + plan.w, plan.y + 3], top, P)}
              tone="lo"
            />
            <Line
              d={lineOnTop([plan.x, plan.y + 7], [plan.x + plan.w, plan.y + 7], top, P)}
              tone="lo"
            />
            <g className={`www-led ${ledClass[index]}`}>
              <GlowLed x={plan.x + 3} y={plan.y + plan.d} z={top} />
              <GlowLed x={plan.x + plan.w - 3} y={plan.y + plan.d} z={top} />
            </g>
          </g>
        );
      })}
      {slab({ x: rackX, y: rackY, w: rackW, d: rackD, r: 0.3 }, rackBase + rackH, 1.6)}
      <Solid paths={cylinder(6, 20, 1.5, floorTop, wallH - 3, P, 16)} tone="mid" />
      <Solid paths={cylinder(28, 20, 1.5, floorTop, wallH - 3, P, 16)} tone="mid" />
      {slab({ x: 4.4, y: 18.6, w: 25.2, d: 2.8, r: 0.2 }, roofZ - 3, 3)}
      {slab(foot, roofZ, roofH, "lo")}
      {slab({ x: -30, y: -32, w: 64, d: 2.4, r: 0 }, roofTop, 2.6)}
      {slab({ x: -30, y: 25.6, w: 64, d: 2.4, r: 0 }, roofTop, 2.6)}
      {slab({ x: -30, y: -29.6, w: 2.4, d: 55.2, r: 0 }, roofTop, 2.6)}
      {slab({ x: 31.6, y: -29.6, w: 2.4, d: 55.2, r: 0 }, roofTop, 2.6)}
      {slab({ x: -14, y: -24, w: 16, d: 12, r: 0.6 }, roofTop, 7)}
      <Solid paths={cylinder(-6, -18, 1.6, roofTop + 7, 6, P, 12)} tone="lo" crease="none" />
      {slab({ x: 6, y: -20, w: 8, d: 6, r: 0.3 }, roofTop, 1.4, "lo")}
    </Bench>
  );
}

function GlowLed({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <g className="wwb-glow">
      <Solid paths={G.sphereOf([x, y, z], 0.9, P)} tone="hi" />
    </g>
  );
}

export function RocketPadFigure() {
  const padTop = FLOOR + 4;
  const lip = FLOOR + 9;
  const profile: [number, number, number?][] = [
    [0, 7.2],
    [1.6, 7.2, 1],
    [4.2, 5.4, 1],
    [7, 3.6],
    [9.2, 5, 1],
    [13, 7],
    [40, 7],
    [46, 5.4, 1],
    [52, 2.4, 1],
    [56, 0.35],
  ];
  const finZ = lip + 12;
  const finH = 14;
  const fins = [
    { key: "fin-e", plan: { x: 7, y: -1, w: 7, d: 2, r: 0.3 } as Plan },
    { key: "fin-w", plan: { x: -14, y: -1, w: 7, d: 2, r: 0.3 } as Plan },
    { key: "fin-s", plan: { x: -1, y: 7, w: 2, d: 7, r: 0.3 } as Plan },
    { key: "fin-n", plan: { x: -1, y: -14, w: 2, d: 7, r: 0.3 } as Plan },
  ];
  const clamps = around(16, 4, Math.PI / 4);
  const vents = [
    { key: "a", className: "www-steam", at: [5.2, 2.4] as [number, number], r: 1.5 },
    { key: "b", className: "www-steam www-steam-b", at: [-1.8, 5.4] as [number, number], r: 1.9 },
    { key: "c", className: "www-steam www-steam-c", at: [-4.6, -3.2] as [number, number], r: 1.35 },
  ];
  const armZ = lip + 34;
  const bolts = around(26, 8).map(function onPad([x, y]): Point3 {
    return [x, y, padTop];
  });

  return (
    <Bench
      hue="amber"
      id="www-startups"
      label="A small rocket on a launch pad. Steam rises from the engine."
    >
      <Solid paths={cylinder(0, 0, 34, FLOOR, 4, P, 48, 0.6)} tone="lo" />
      <Solid paths={cylinder(0, 0, 20, padTop, 2, P, 40, 0.3)} tone="mid" />
      <Line d={ring(0, 0, 27, padTop, P, 40)} tone="faint" />
      <Line d={ring(0, 0, 12, padTop + 2, P, 32)} tone="lo" />
      <Dots points={pointsAt(bolts, P)} size={0.45} tone="mid" />
      {clamps.map(function renderClamp([x, y]) {
        const plan: Plan = { x: x - 2.2, y: y - 1.6, w: 4.4, d: 3.2, r: 0.4 };
        return <g key={`${x}${y}`}>{slab(plan, padTop + 2, 3.2, "lo")}</g>;
      })}
      <Solid paths={cylinder(-28, -4, 1.7, padTop, 48, P, 14)} tone="mid" />
      <Solid paths={cylinder(-28, -4, 2.6, padTop + 48, 2, P, 16, 0.3)} tone="lo" />
      {slab({ x: -26.3, y: -5.1, w: 14, d: 2.2, r: 0.3 }, armZ, 2)}
      <Line d={segment([-12.3, -4, armZ + 1], [-7, 0, armZ + 1], P)} tone="lo" />
      <Line d={rise([-30.6, -4], padTop, padTop + 48, P)} tone="faint" />
      {[8, 16, 24, 32].map(function rung(step) {
        return (
          <Line
            key={step}
            d={segment([-30.6, -4, padTop + step], [-29.7, -4, padTop + step], P)}
            tone="faint"
          />
        );
      })}
      <Solid paths={G.solidOf(profile, frameAt(0, 0, lip), P)} tone="mid" />
      <Line d={ring(0, 0, 7.15, lip + 28, P, 28)} tone="lo" />
      <Line d={ring(0, 0, 7.15, lip + 32, P, 28)} tone="faint" />
      {nearerLast(fins, function finPoint(fin) {
        return [fin.plan.x + fin.plan.w / 2, fin.plan.y + fin.plan.d / 2, finZ];
      }).map(function renderFin(fin) {
        return <g key={fin.key}>{slab(fin.plan, finZ, finH)}</g>;
      })}
      {vents.map(function renderVent(vent) {
        return (
          <g key={vent.key} className={vent.className}>
            <Solid paths={G.sphereOf([vent.at[0], vent.at[1], lip - 3.4], vent.r, P)} tone="hi" />
          </g>
        );
      })}
      <g className="wwb-glow">
        <Solid paths={G.sphereOf([0, 0, lip - 2.6], 2.1, P)} tone="hi" />
      </g>
    </Bench>
  );
}

export function CivicBuildingFigure() {
  const step = 3;
  const platform = FLOOR + step * 3;
  const hall: Plan = { x: -12, y: -32, w: 46, d: 30, r: 0.6 };
  const tower: Plan = { x: -34, y: -32, w: 22, d: 20, r: 0.6 };
  const hallH = 26;
  const hallTop = platform + hallH;
  const towerH = 48;
  const towerTop = platform + towerH;
  const shaftH = 20;
  const columns = [-2, 8, 18, 28];
  const front = hall.y + hall.d;
  const levels = [platform + 8, platform + 14, platform + 20];
  const towerLevels = [hallTop + 6, hallTop + 14, hallTop + 22];
  const mastTop = towerTop + 15;
  const dome: [number, number, number?][] = [
    [0, 11],
    [1.5, 10.8, 1],
    [5, 9.2, 1],
    [9, 5.6, 1],
    [12, 1.6, 1],
    [13.2, 0],
  ];

  return (
    <Bench
      hue="cyan"
      id="www-government"
      label="A civic building with a columned front and a tower. The antenna light blinks."
    >
      {slab({ x: -42, y: -36, w: 88, d: 70, r: 2 }, FLOOR, step, "lo")}
      {slab({ x: -38, y: -36, w: 80, d: 60, r: 1.5 }, FLOOR + step, step, "lo")}
      {slab({ x: -36, y: -34, w: 74, d: 50, r: 1.2 }, FLOOR + step * 2, step, "lo")}
      <Line
        d={planOutline(insetPlan({ x: -36, y: -34, w: 74, d: 50, r: 1.2 }, 3), platform, P, 4)}
        tone="faint"
      />
      <Solid
        paths={slabOf(tower, platform, towerH, P, 3, 0.4)}
        tone="mid"
        inner={
          <>
            {towerLevels.map(function band(level) {
              return span(
                "y",
                tower.y + tower.d,
                tower.x + 2,
                tower.x + tower.w - 2,
                level,
                `tf${level}`,
              );
            })}
            {towerLevels.map(function band(level) {
              return span(
                "x",
                tower.x + tower.w,
                tower.y + 2,
                tower.y + tower.d - 2,
                level,
                `tr${level}`,
              );
            })}
            {mullion("y", tower.y + tower.d, tower.x + 7, towerLevels[0], towerLevels[2])}
            {mullion("y", tower.y + tower.d, tower.x + 15, towerLevels[0], towerLevels[2])}
            <Line
              d={rise([tower.x + 11, tower.y + tower.d], platform, platform + 12, P)}
              tone="lo"
            />
            <Line
              d={segment(
                [tower.x + 8, tower.y + tower.d, platform],
                [tower.x + 14, tower.y + tower.d, platform],
                P,
              )}
              tone="lo"
            />
            <Line
              d={segment(
                [tower.x + 8, tower.y + tower.d, platform + 12],
                [tower.x + 14, tower.y + tower.d, platform + 12],
                P,
              )}
              tone="lo"
            />
            <Line
              d={rise([tower.x + 8, tower.y + tower.d], platform, platform + 12, P)}
              tone="lo"
            />
            <Line
              d={rise([tower.x + 14, tower.y + tower.d], platform, platform + 12, P)}
              tone="lo"
            />
          </>
        }
      />
      <Solid
        paths={slabOf(hall, platform, hallH, P, 3, 0.4)}
        tone="mid"
        inner={
          <>
            {levels.map(function band(level) {
              return span("x", hall.x + hall.w, hall.y + 3, front - 3, level, `hr${level}`);
            })}
            {mullion("x", hall.x + hall.w, hall.y + 10, levels[0], levels[2])}
            {mullion("x", hall.x + hall.w, hall.y + 20, levels[0], levels[2])}
            {span("y", front, hall.x + 3, 5, platform + 16, "hfl")}
            {span("y", front, 19, hall.x + hall.w - 3, platform + 16, "hfr")}
            {span("y", front, hall.x + 3, hall.x + hall.w - 3, platform + 22, "hf")}
            <Line d={segment([9, front, platform], [17, front, platform], P)} tone="lo" />
            <Line d={rise([9, front], platform, platform + 12, P)} tone="lo" />
            <Line d={rise([17, front], platform, platform + 12, P)} tone="lo" />
            <Line d={segment([9, front, platform + 12], [17, front, platform + 12], P)} tone="lo" />
          </>
        }
      />
      {columns.map(function renderColumn(x) {
        return (
          <g key={x}>
            <Solid paths={cylinder(x, 6, 2.8, platform, 1.6, P, 20, 0.2)} tone="lo" />
            <Solid
              paths={cylinder(x, 6, 1.9, platform + 1.6, shaftH, P, 18)}
              tone="mid"
              crease="none"
            />
            <Solid
              paths={cylinder(x, 6, 2.6, platform + 1.6 + shaftH, 1.8, P, 20, 0.2)}
              tone="lo"
            />
          </g>
        );
      })}
      {slab({ x: -8, y: front, w: 40, d: 12, r: 0.4 }, platform + 1.6 + shaftH + 1.8, 3)}
      <Solid paths={G.solidOf(dome, frameAt(11, -17, hallTop), P)} tone="mid" />
      <Line d={ring(11, -17, 11.1, hallTop, P, 32)} tone="lo" />
      <Solid paths={cylinder(-23, -22, 0.7, towerTop, 15, P, 12)} tone="mid" crease="none" />
      {slab({ x: -28.7, y: -22.45, w: 5, d: 0.9, r: 0.15 }, mastTop - 2.2, 0.9, "lo")}
      {slab({ x: -22.3, y: -22.45, w: 5, d: 0.9, r: 0.15 }, mastTop - 2.2, 0.9, "lo")}
      {slab({ x: -23.45, y: -27.7, w: 0.9, d: 5, r: 0.15 }, mastTop - 2.2, 0.9, "lo")}
      {slab({ x: -23.45, y: -21.3, w: 0.9, d: 5, r: 0.15 }, mastTop - 2.2, 0.9, "lo")}
      <Solid paths={cylinder(-23, -22, 1.35, mastTop, 1.3, P, 14, 0.2)} tone="lo" />
      <g className="www-blink wwb-glow">
        <Solid paths={G.sphereOf([-23, -22, mastTop + 1.3 + 2], 2, P)} tone="hi" />
      </g>
    </Bench>
  );
}
