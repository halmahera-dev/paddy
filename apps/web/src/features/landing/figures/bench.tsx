import "@/components/iso/iso.css";
import {
  boxCorners,
  corners,
  fitProjection,
  insetPlan,
  iso,
  pathOf,
  planOutline,
  pointsAt,
  ring,
  slabOf,
  type Plan,
  type Point3,
} from "@/components/iso/iso-kit";
import * as G from "@/components/iso/lathe.mjs";
import { Dots, IsoFigure, Line, Solid } from "@/components/iso/react/draw";
import "@/features/landing/figures/what-we-build-figures.css";
import "@/features/landing/figures/start-figures.css";

const WIDTH = 280;
const HEIGHT = 170;
const BENCH: Plan = { x: -58, y: -40, w: 116, d: 80, r: 8 };
export const FLOOR = 5;
const UP: Point3 = [0, 0, 1];

export const P = fitProjection(
  [...boxCorners(BENCH, 0, FLOOR), [0, 0, FLOOR + 66]],
  WIDTH,
  HEIGHT,
  { pad: 6, azimuth: 45, elevation: 30 },
);

export type Hue = "rose" | "blue" | "amber" | "green" | "violet" | "cyan";

export function frameAt(x: number, y: number, z: number) {
  return G.frameOf([x, y, z], UP, [1, 0, 0], [0, 1, 0]);
}

export function slab(plan: Plan, z: number, height: number, tone: "lo" | "mid" = "mid") {
  return <Solid paths={slabOf(plan, z, height, P, 4, 0.4)} tone={tone} />;
}

export function faceBox(
  axis: "x" | "y",
  fixed: number,
  from: number,
  to: number,
  bottom: number,
  top: number,
) {
  const corners: Point3[] =
    axis === "y"
      ? [
          [from, fixed, bottom],
          [to, fixed, bottom],
          [to, fixed, top],
          [from, fixed, top],
        ]
      : [
          [fixed, from, bottom],
          [fixed, to, bottom],
          [fixed, to, top],
          [fixed, from, top],
        ];
  return pathOf(
    corners.map(function project(point) {
      return iso(point, P);
    }),
    true,
  );
}

export function pathThrough(points: Point3[]) {
  const flat = points.map(function project(point) {
    return iso(point, P);
  });
  const lengths = [0];
  for (let index = 1; index < flat.length; index++) {
    const step = Math.hypot(
      flat[index][0] - flat[index - 1][0],
      flat[index][1] - flat[index - 1][1],
    );
    lengths.push(lengths[index - 1] + step);
  }
  const total = lengths[lengths.length - 1];
  return {
    d: pathOf(flat),
    fractions: lengths.map(function fractionOf(length) {
      return length / total;
    }),
  };
}

export function Flyer({
  home,
  path,
  className,
  style,
  children,
}: {
  home: Point3;
  path: string;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const [x, y] = iso(home, P);
  return (
    <g
      className={className}
      style={{ ...style, "--path": `path("${path}")` } as React.CSSProperties}
    >
      <g className={`${className}-turn`}>
        <g transform={`translate(${-x} ${-y})`}>{children}</g>
      </g>
    </g>
  );
}

export function Glow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <g className={className ? `wwb-glow ${className}` : "wwb-glow"}>{children}</g>;
}

export function Bench({
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
  const screws = corners(BENCH, 8).map(function onFloor([x, y]): Point3 {
    return [x, y, FLOOR];
  });
  const paint = {
    "--top-fill": `url(#${id}-top)`,
    "--glow-fill": `url(#${id}-glow)`,
  } as React.CSSProperties;
  return (
    <div className="iso">
      <IsoFigure width={WIDTH} height={HEIGHT} label={label}>
        <Solid paths={slabOf(BENCH, 0, FLOOR, P, 8, 0.6)} tone="lo" />
        <Line d={planOutline(insetPlan(BENCH, 4), FLOOR, P)} tone="faint" />
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
          <path className="wwb-pool" d={ring(0, 0, 46, FLOOR, P, 48)} fill={`url(#${id}-pool)`} />
          <g className="wwb-object">{children}</g>
        </g>
      </IsoFigure>
    </div>
  );
}
