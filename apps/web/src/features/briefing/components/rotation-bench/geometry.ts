import {
  circleRing,
  depthOf,
  extrude,
  insetPlan,
  knurl,
  onTop,
  pathOf,
  planOutline,
  radialTicks,
  ringOf,
  sideArc,
  sideTicks,
  slabOf,
  topMatrix,
  topTicks,
  type Flat,
  type Plan,
  type Plane,
  type Point3,
  type SolidPaths,
} from "@/components/iso/iso-kit";
import { MOISTURE_LEVEL, seasonRain } from "./model";
import {
  AZIMUTH,
  BASE,
  BASE_H,
  CAP_H,
  COLLAR_H,
  DETENT_R,
  DIAL,
  DIAL_H,
  DIAL_R,
  DIAL_SWEEP,
  DIAL_TOP,
  DIAL_Z,
  FACE_Y,
  FOOT_H,
  GAP_SIDE,
  GAUGE_Y,
  GAUGE_Z,
  KNOB_DEPTH,
  KNOB_R,
  KNOB_Z,
  MM,
  P,
  POST,
  POST_X,
  RAIL_D,
  RAIL_H,
  RAIL_Z,
  RIM_Z,
  SOIL_Z,
  TRAY_D,
  TRAY_W,
  TRAY_X,
  TRAY_Y,
  TRAY_Z,
  TUBE_R,
  TUBE_TOP,
  WALL,
  WATER_R,
  at,
  gaugePoint,
  knobMatrix,
} from "./view";

const RADIANS = Math.PI / 180;

function slab(plan: Plan, z: number, height: number, steps = 6, bevel = 0) {
  return slabOf(plan, z, height, P, steps, bevel);
}

function disc(cx: number, cy: number, radius: number, z: number, height: number, steps = 32) {
  return extrude(circleRing(cx, cy, radius, steps), z, height, P, { convex: true });
}

function flatRing(cx: number, cy: number, radius: number, z: number, steps = 40) {
  return onTop(circleRing(cx, cy, radius, steps), z, P, true);
}

function segment(a: Point3, b: Point3) {
  return pathOf([at(a), at(b)]);
}

function join(paths: string[]) {
  return paths.join("");
}

function merge(list: SolidPaths[]): SolidPaths {
  return {
    fill: join(list.map((item) => item.fill)),
    outline: join(list.map((item) => item.outline)),
    crease: join(list.map((item) => item.crease)),
    top: join(list.map((item) => item.top)),
    shades: [0, 1, 2, 3].map((shade) => join(list.map((item) => item.shades[shade] ?? ""))),
  };
}

function seeded(seed: number) {
  const raw = Math.sin(seed * 12.9898) * 43758.5453;
  return raw - Math.floor(raw);
}

function hull(points: Flat[]): Flat[] {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Flat, a: Flat, b: Flat) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: Flat[]) => {
    const out: Flat[] = [];
    for (const point of list) {
      while (out.length >= 2 && cross(out[out.length - 2]!, out[out.length - 1]!, point) <= 0) out.pop();
      out.push(point);
    }
    out.pop();
    return out;
  };
  return [...half(sorted), ...half([...sorted].reverse())];
}

function areaOf(ring: Flat[]) {
  let sum = 0;
  ring.forEach(([x, y], index) => {
    const [nx, ny] = ring[(index + 1) % ring.length]!;
    sum += x * ny - nx * y;
  });
  return sum;
}

function oriented(ring: Flat[]) {
  return areaOf(ring) < 0 ? [...ring].reverse() : ring;
}

function flatShape(ring: Flat[], spine: Flat[] = []): SolidPaths {
  const outline = pathOf(oriented(ring), true);
  return { fill: outline, outline, crease: spine.length ? pathOf(spine) : "", top: "", shades: ["", "", "", ""] };
}

function facePoints(cx: number, y: number, cz: number, list: Plane[]): Flat[] {
  return list.map(([u, v]) => at([cx + u, y, cz - v]));
}

function faceSlot(cx: number, y: number, cz: number, width: number, height: number) {
  const ring = ringOf({ x: -width / 2, y: -height / 2, w: width, d: height, r: Math.min(width, height) / 2 - 0.05 }, 5);
  return pathOf(facePoints(cx, y, cz, ring), true);
}

function faceCylinder(cx: number, y: number, cz: number, radius: number, depth: number): SolidPaths {
  const ringAt = (plane: number) =>
    Array.from({ length: 32 }, (_, step) => {
      const angle = (step / 32) * Math.PI * 2;
      return at([cx + radius * Math.cos(angle), plane, cz + radius * Math.sin(angle)]);
    });
  const front = ringAt(y + depth);
  const body = pathOf(hull([...front, ...ringAt(y)]), true);
  const face = pathOf(front, true);
  return { fill: body, outline: body + face, crease: "", top: face, shades: ["", "", body, ""] };
}

function byDepth<T>(items: T[], pointOf: (item: T) => Point3) {
  return [...items].sort((a, b) => depthOf(pointOf(a), P) - depthOf(pointOf(b), P));
}

const SEATS = TRAY_X.map((x): Plan => ({ x: x - TRAY_W / 2 - 3, y: TRAY_Y - 3, w: TRAY_W + 6, d: TRAY_D + 6, r: 4 }));
const STRIP: Plan = { x: -150, y: 50, w: 262, d: 8, r: 1 };
const LABEL: Plan = { x: 122, y: 48, w: 64, d: 12, r: 2 };
const FEET: Plane[] = [
  [BASE.x + 18, BASE.y + 16],
  [BASE.x + BASE.w - 18, BASE.y + 16],
  [BASE.x + 18, BASE.y + BASE.d - 16],
  [BASE.x + BASE.w - 18, BASE.y + BASE.d - 16],
];
const SCREWS: Plane[] = [
  [BASE.x + 8, BASE.y + 8],
  [BASE.x + BASE.w - 8, BASE.y + 8],
  [BASE.x + 8, BASE.y + BASE.d - 8],
  [BASE.x + BASE.w - 8, BASE.y + BASE.d - 8],
];
const STRIP_TICKS = topTicks(STRIP.x + 4, STRIP.x + STRIP.w - 4, 4, 5, STRIP.y + STRIP.d, 0.6, [-2, -3.6], P);

export const BASE_ART = {
  halo: slab(BASE, -BASE_H - FOOT_H, BASE_H).fill,
  feet: byDepth(FEET, ([x, y]) => [x, y, 0]).map(([x, y]) => [disc(x!, y!, 7, -BASE_H - FOOT_H, 1.6), disc(x!, y!, 5.5, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6)]),
  slab: slab(BASE, -BASE_H, BASE_H, 8, 1.6),
  groove: planOutline(insetPlan(BASE, 4.5), 0, P),
  screwRings: join(SCREWS.map(([x, y]) => flatRing(x!, y!, 2.2, 0, 16))),
  screws: SCREWS.map(([x, y]) => at([x!, y!, 0])),
  seats: SEATS.map((plan) => slab(plan, 0, 1.2, 6, 0.4)),
  seatLines: SEATS.map((plan) => planOutline(insetPlan(plan, 1.6), 1.2, P)),
  strip: slab(STRIP, 0, 0.6, 3),
  stripMinor: STRIP_TICKS.minor,
  stripMajor: STRIP_TICKS.major,
  plate: slab(LABEL, 0, 0.8, 4),
  plateLine: planOutline(insetPlan(LABEL, 1.6), 0.8, P),
  plateRule: join([0, 1, 2].map((row) => onTop([[LABEL.x + 8, LABEL.y + 3.4 + row * 2.6], [LABEL.x + (row === 1 ? 36 : 50), LABEL.y + 3.4 + row * 2.6]], 0.8, P))),
  plateScrews: [at([LABEL.x + 3.5, LABEL.y + LABEL.d / 2, 0.8]), at([LABEL.x + LABEL.w - 3.5, LABEL.y + LABEL.d / 2, 0.8])],
};

function tubeTicks(tray: number) {
  const minor: string[] = [];
  const major: string[] = [];
  const rule = 12;
  for (let step = 0; step <= 20; step++) {
    const big = step % 5 === 0;
    const z = GAUGE_Z + step * 60 * MM;
    const start = gaugePoint(tray, rule, z, TUBE_R);
    const end = gaugePoint(tray, rule - (big ? 34 : 18), z, TUBE_R);
    (big ? major : minor).push(pathOf([start, end]));
  }
  return { minor: join(minor), major: join(major), rule: pathOf([gaugePoint(tray, rule, GAUGE_Z, TUBE_R), gaugePoint(tray, rule, TUBE_TOP, TUBE_R)]) };
}

function crescent(cx: number, cy: number, from: number, to: number, z: number): SolidPaths {
  const ring: Plane[] = [];
  const steps = 14;
  for (let step = 0; step <= steps; step++) {
    const angle = (from + ((to - from) * step) / steps) * RADIANS;
    ring.push([cx + (TUBE_R + 1.8) * Math.cos(angle), cy + (TUBE_R + 1.8) * Math.sin(angle)]);
  }
  for (let step = steps; step >= 0; step--) {
    const angle = (from + ((to - from) * step) / steps) * RADIANS;
    ring.push([cx + TUBE_R * Math.cos(angle), cy + TUBE_R * Math.sin(angle)]);
  }
  return extrude(ring, z, COLLAR_H, P, { convex: false });
}

export const GAUGE_ART = TRAY_X.map(function gaugeOf(cx, tray) {
  const ticks = tubeTicks(tray);
  const collarZ = GAUGE_Z - COLLAR_H / 2;
  return {
    flange: disc(cx, GAUGE_Y, 9, 0, 1.6),
    foot: disc(cx, GAUGE_Y, 7.4, 1.6, GAUGE_Z - 1.6),
    footSeam: sideArc(cx, GAUGE_Y, 7.4, 5.5, P, 20),
    tube: disc(cx, GAUGE_Y, TUBE_R, GAUGE_Z, TUBE_TOP - GAUGE_Z),
    water: disc(cx, GAUGE_Y, WATER_R, GAUGE_Z, seasonRain[tray]! * MM, 28),
    meniscus: flatRing(cx, GAUGE_Y, WATER_R, GAUGE_Z + seasonRain[tray]! * MM, 28),
    shine: pathOf([gaugePoint(tray, 78, GAUGE_Z + 1, TUBE_R), gaugePoint(tray, 78, TUBE_TOP - 1, TUBE_R)]),
    rule: ticks.rule,
    ticksMinor: ticks.minor,
    ticksMajor: ticks.major,
    collarBack: crescent(cx, GAUGE_Y, AZIMUTH + 90, AZIMUTH + 270, collarZ),
    collarFront: crescent(cx, GAUGE_Y, AZIMUTH - 90, AZIMUTH + 90, collarZ),
    collarScrew: [at([cx + (TUBE_R + 1.8) * Math.cos((AZIMUTH + 28) * RADIANS), GAUGE_Y + (TUBE_R + 1.8) * Math.sin((AZIMUTH + 28) * RADIANS), collarZ + COLLAR_H / 2])],
    cap: disc(cx, GAUGE_Y, TUBE_R + 1.2, TUBE_TOP, CAP_H),
    gapSide: GAP_SIDE,
  };
});

const POST_PLANS = POST_X.map((x): Plan => ({ x: x - POST / 2, y: GAUGE_Y - POST / 2, w: POST, d: POST, r: 1.5 }));
const RAIL: Plan = { x: POST_X[0]! - 8, y: GAUGE_Y - RAIL_D / 2, w: POST_X[1]! - POST_X[0]! + 16, d: RAIL_D, r: 2 };
const RAIL_TOP = RAIL_Z + RAIL_H;
const RAIL_TICKS = sideTicks(POST_X[0]! + 8, POST_X[1]! - 8, 6, 5, RAIL.y + RAIL.d, RAIL_TOP - 0.1, [1.6, 3], P);

export const RAIL_ART = {
  feet: POST_PLANS.map((plan) => slab(insetPlan(plan, -3), 0, 2, 4)),
  footScrews: POST_PLANS.flatMap((plan) => [at([plan.x - 1.3, plan.y + POST / 2, 2]), at([plan.x + POST + 1.3, plan.y + POST / 2, 2])]),
  posts: POST_PLANS.map((plan) => slab(plan, 2, RAIL_Z - 2, 4, 0.4)),
  postLines: POST_PLANS.map((plan) => segment([plan.x + POST, plan.y + POST, 2], [plan.x + POST, plan.y + POST, RAIL_Z])),
  rail: slab(RAIL, RAIL_Z, RAIL_H, 4, 0.8),
  ticksMinor: RAIL_TICKS.minor,
  ticksMajor: RAIL_TICKS.major,
  screws: POST_PLANS.map((plan) => at([plan.x + POST / 2, GAUGE_Y, RAIL_TOP])),
  stops: [RAIL.x + 2, RAIL.x + RAIL.w - 5].map((x) => slab({ x, y: RAIL.y - 0.5, w: 3, d: RAIL_D + 1, r: 0.8 }, RAIL_TOP, 2.4, 3)),
};

const [DX, DY] = DIAL;
const DIAL_STAND: Plan = { x: DX - 23, y: DY - 23, w: 46, d: 46, r: 4 };
const DIAL_TICKS = radialTicks(DX, DY, DIAL_R - 2.6, 12, 3, DIAL_TOP, [1.4, 2.8], P, -DIAL_SWEEP, DIAL_SWEEP * 2);
const ZERO_RADIUS = DIAL_R - 2.6;

export const DIAL_ART = {
  stand: slab(DIAL_STAND, 0, 3, 5, 0.6),
  standScrews: [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => at([DX + sx! * 19.4, DY + sy! * 19.4, 3])),
  pillar: disc(DX, DY, 6.5, 3, DIAL_Z - 3),
  pillarSeam: sideArc(DX, DY, 6.5, 5.5, P, 16),
  puck: disc(DX, DY, DIAL_R, DIAL_Z, DIAL_H, 56),
  band: sideArc(DX, DY, DIAL_R, DIAL_Z + DIAL_H - 3, P, 40),
  knurl: knurl(DX, DY, DIAL_R, DIAL_Z + DIAL_H - 3, DIAL_TOP, 56, P),
  bezel: flatRing(DX, DY, DIAL_R - 1, DIAL_TOP, 56),
  face: flatRing(DX, DY, DIAL_R - 2.6, DIAL_TOP, 56),
  ticksMinor: DIAL_TICKS.minor,
  ticksMajor: DIAL_TICKS.major,
  zero: onTop([[DX, DY - ZERO_RADIUS], [DX, DY - ZERO_RADIUS + 4.8]], DIAL_TOP, P),
  label: topMatrix([DX, DY + 7], DIAL_TOP, P, "x"),
  crown: slab({ x: DX + DIAL_R - 0.6, y: DY - 2.4, w: 4.4, d: 4.8, r: 1.2 }, DIAL_Z + 2, 4, 3),
  crownCap: slab({ x: DX + DIAL_R + 3.6, y: DY - 3.2, w: 2.6, d: 6.4, r: 1.2 }, DIAL_Z + 1.2, 5.6, 3),
  lug: slab({ x: DX - 3, y: DY - DIAL_R - 3.4, w: 6, d: 4, r: 1.2 }, DIAL_Z + 1.5, 5, 3),
  hub: disc(DX, DY, 2.4, DIAL_TOP + 0.8, 1.4, 20),
};

function soilPlan(cx: number) {
  return insetPlan({ x: cx - TRAY_W / 2, y: TRAY_Y, w: TRAY_W, d: TRAY_D, r: 3 }, WALL);
}

function wallPlans(cx: number) {
  const left = cx - TRAY_W / 2;
  const edge = TRAY_Y + TRAY_D;
  return {
    back: { x: left, y: TRAY_Y, w: TRAY_W, d: WALL, r: 1 },
    left: { x: left, y: TRAY_Y + WALL, w: WALL, d: TRAY_D - WALL * 2, r: 0.6 },
    right: { x: left + TRAY_W - WALL, y: TRAY_Y + WALL, w: WALL, d: TRAY_D - WALL * 2, r: 0.6 },
    front: { x: left, y: edge - WALL, w: TRAY_W, d: WALL, r: 1 },
  };
}

function soilGrains(cx: number, tray: number) {
  const dots: Flat[] = [];
  for (let index = 0; index < 26; index++) {
    const x = cx - 36 + seeded(index * 3 + tray * 71 + 1) * 72;
    const y = TRAY_Y + WALL + 2 + seeded(index * 5 + tray * 53 + 2) * (TRAY_D - WALL * 2 - 4);
    dots.push(at([x, y, SOIL_Z + 0.2]));
  }
  return dots;
}

function furrows(cx: number) {
  const from = cx - TRAY_W / 2 + WALL;
  const to = cx + TRAY_W / 2 - WALL;
  const rows = [0, 6.5, 13, 19.5, 26, 32.5].map((offset) => TRAY_Y + WALL + 3 + offset);
  return join(rows.map((y) => onTop([[from, y], [to, y]], SOIL_Z + 0.2, P)));
}

const PROBE_Y = -6;

function probeOf(cx: number) {
  return { px: cx - 30, face: PROBE_Y + 2.5, headZ: SOIL_Z + 11 };
}

function probeBar(cx: number, tray: number) {
  const { px, face, headZ } = probeOf(cx);
  const level = MOISTURE_LEVEL[tray]!;
  const bottom = headZ + 1.8;
  const top = bottom + 5.4 * level;
  const left = px - 1.4;
  const right = px + 1.4;
  return pathOf([at([left, face, bottom]), at([right, face, bottom]), at([right, face, top]), at([left, face, top])], true);
}

export const TRAY_ART = TRAY_X.map(function trayOf(cx, tray) {
  const plans = wallPlans(cx);
  const { px, face, headZ } = probeOf(cx);
  const height = RIM_Z - TRAY_Z;
  return {
    ring: planOutline(insetPlan(SEATS[tray]!, -3), 0.4, P, 8),
    back: slab(plans.back, TRAY_Z, height, 4, 0.8),
    left: slab(plans.left, TRAY_Z, height, 3, 0.8),
    soil: slab(soilPlan(cx), SOIL_Z, 0.2, 5),
    soilLine: planOutline(insetPlan(soilPlan(cx), 1.2), SOIL_Z + 0.2, P, 5),
    grains: soilGrains(cx, tray),
    furrows: furrows(cx),
    stake: slab({ x: px - 1, y: PROBE_Y - 1, w: 2, d: 2, r: 0.4 }, SOIL_Z, headZ - SOIL_Z, 3),
    head: slab({ x: px - 5, y: PROBE_Y - 2.5, w: 10, d: 5, r: 1 }, headZ, 9, 4, 0.5),
    window: faceSlot(px, face, headZ + 4.8, 4.6, 6.6),
    bar: probeBar(cx, tray),
    headDot: at([px, PROBE_Y, headZ + 9]),
    right: slab(plans.right, TRAY_Z, height, 3, 0.8),
    front: slab(plans.front, TRAY_Z, height, 4, 0.8),
    frontLine: onTop([[plans.front.x + 2, plans.front.y + 0.5], [plans.front.x + plans.front.w - 2, plans.front.y + 0.5]], RIM_Z, P),
    rimScrews: [plans.front.x + 4, plans.front.x + plans.front.w - 4].map((x) => at([x, plans.front.y + WALL / 2, RIM_Z])),
    slots: join([-33, -23, 23, 33].map((offset) => faceSlot(cx + offset, FACE_Y, 8.4, 1.8, 6.4))),
    boss: faceCylinder(cx, FACE_Y, KNOB_Z, KNOB_R + 1.3, 1.2),
    knob: faceCylinder(cx, FACE_Y + 1.2, KNOB_Z, KNOB_R, KNOB_DEPTH - 1.2),
    detents: [-90, 30, 150].map((degrees) => at([cx + DETENT_R * Math.cos(degrees * RADIANS), FACE_Y, KNOB_Z - DETENT_R * Math.sin(degrees * RADIANS)])),
    knobMatrix: knobMatrix(tray),
    knobTicks: join(
      Array.from({ length: 24 }, (_, step) => {
        const angle = (step / 24) * Math.PI * 2;
        const inner = KNOB_R - (step % 6 === 0 ? 1.7 : 1.1);
        return `M${(inner * Math.cos(angle)).toFixed(2)} ${(inner * Math.sin(angle)).toFixed(2)}L${(KNOB_R * Math.cos(angle)).toFixed(2)} ${(KNOB_R * Math.sin(angle)).toFixed(2)}`;
      }),
    ),
    pointer: `M0 0L0 ${-(KNOB_R - 0.6)}`,
  };
});

interface Blade {
  root: Point3;
  degrees: number;
  length: number;
  width: number;
  rise: number;
  droop: number;
}

function bladeOf({ root, degrees, length, width, rise, droop }: Blade): SolidPaths {
  const dx = Math.cos(degrees * RADIANS);
  const dy = Math.sin(degrees * RADIANS);
  const left: Flat[] = [];
  const right: Flat[] = [];
  const spine: Flat[] = [];
  const steps = 7;
  for (let step = 0; step <= steps; step++) {
    const t = step / steps;
    const reach = length * t;
    const z = root[2] + rise * Math.sin((t * Math.PI) / 2) - droop * t * t;
    const half = (width * Math.sin(Math.PI * t) ** 0.85) / 2;
    const x = root[0] + dx * reach;
    const y = root[1] + dy * reach;
    left.push(at([x - dy * half, y + dx * half, z]));
    right.push(at([x + dy * half, y - dx * half, z]));
    spine.push(at([x, y, z]));
  }
  return flatShape([...left, ...right.reverse()], spine.slice(0, -1));
}

function facesViewer(degrees: number) {
  return Math.cos((degrees - AZIMUTH) * RADIANS) > 0;
}

function leaves(blades: Blade[]) {
  return {
    back: merge(blades.filter((blade) => !facesViewer(blade.degrees)).map(bladeOf)),
    front: merge(blades.filter((blade) => facesViewer(blade.degrees)).map(bladeOf)),
  };
}

function stemOf(x: number, y: number, radius: number, z: number, height: number) {
  return extrude(circleRing(x, y, radius, 10), z, height, P, { convex: true });
}

const WATER_Z = SOIL_Z + 2.4;

function riceOf(cx: number, tray: number) {
  const hills: Plane[] = [-26, 0, 26].flatMap((dx, column) => [8, 29].map((y, row): Plane => [cx + dx + (seeded(column * 7 + row + tray) - 0.5) * 6, y + (seeded(column + row * 5 + tray * 3) - 0.5) * 4]));
  const stems: string[] = [];
  const heads: string[] = [];
  const bases: Flat[] = [];
  const ripples: string[] = [];
  for (const [hx, hy] of byDepth(hills, ([x, y]) => [x, y, 0])) {
    bases.push(at([hx!, hy!, WATER_Z]));
    ripples.push(onTop(circleRing(hx!, hy!, 3.6, 18), WATER_Z, P, true));
    for (let tiller = 0; tiller < 6; tiller++) {
      const degrees = tiller * 60 + seeded(hx! + tiller) * 30;
      const dx = Math.cos(degrees * RADIANS);
      const dy = Math.sin(degrees * RADIANS);
      const lean = 3 + seeded(hy! + tiller * 2) * 3;
      const height = 15 + seeded(hx! * 2 + tiller) * 6;
      const point = (reach: number, rise: number): Point3 => [hx! + dx * reach, hy! + dy * reach, WATER_Z + rise];
      const top = point(lean * 0.85, height * 0.85);
      stems.push(pathOf([at(point(0.5, 0)), at(point(lean * 0.3, height * 0.45)), at(top)]));
      heads.push(pathOf([at(top), at(point(lean * 1.05 + 0.6, height * 0.97)), at(point(lean * 1.15 + 1.1, height * 0.92))]));
    }
  }
  return {
    sheet: slab(insetPlan(soilPlan(cx), 0.8), WATER_Z, 0.2, 5),
    ripples: join(ripples),
    bases,
    stems: join(stems),
    heads: join(heads),
  };
}

function maizeOf(cx: number, tray: number) {
  const spots: Plane[] = [[cx - 24, 6], [cx - 6, 26], [cx + 15, 10]];
  return byDepth(spots, ([x, y]) => [x, y, 0]).map(([x, y], plant) => {
    const height = 34 + seeded(plant + tray * 4) * 5;
    const blades: Blade[] = [];
    for (let node = 0; node < 5; node++) {
      blades.push({
        root: [x!, y!, SOIL_Z + 6 + node * 6],
        degrees: plant * 40 + node * 137,
        length: 15 - node * 1.2,
        width: 3.4,
        rise: 5,
        droop: 9 - node * 0.6,
      });
    }
    const top: Point3 = [x!, y!, SOIL_Z + height];
    const tassel = join([-60, 0, 60, 120, 200].map((degrees) => segment(top, [x! + 3.6 * Math.cos(degrees * RADIANS), y! + 3.6 * Math.sin(degrees * RADIANS), SOIL_Z + height + 3.4])));
    return {
      ...leaves(blades),
      stem: stemOf(x!, y!, 1.1, SOIL_Z, height),
      nodes: join([12, 24].map((z) => sideArc(x!, y!, 1.1, SOIL_Z + z, P, 6))),
      cob: stemOf(x! + 1.9 * Math.cos((AZIMUTH + 30) * RADIANS), y! + 1.9 * Math.sin((AZIMUTH + 30) * RADIANS), 1.5, SOIL_Z + 14, 6.5),
      tassel,
      base: at([x!, y!, SOIL_Z]),
    };
  });
}

function soybeanOf(cx: number) {
  const spots: Plane[] = [[cx - 26, 8], [cx - 9, 27], [cx + 9, 10], [cx + 25, 28]];
  return byDepth(spots, ([x, y]) => [x, y, 0]).map(([x, y], plant) => {
    const blades: Blade[] = [];
    for (let node = 0; node < 3; node++) {
      for (const side of [0, 1]) {
        blades.push({
          root: [x!, y!, SOIL_Z + 4 + node * 3.4],
          degrees: plant * 53 + node * 70 + side * 170 + 20,
          length: 8 - node * 0.6,
          width: 5,
          rise: 2,
          droop: 3.4,
        });
      }
    }
    const pods = [0, 1, 2, 3].map((pod) => {
      const angle = (plant * 50 + pod * 95) * RADIANS;
      const px = x! + Math.cos(angle) * 3.4;
      const py = y! + Math.sin(angle) * 3.4;
      const along = pod % 2 === 0;
      return slab({ x: px - (along ? 1.5 : 0.6), y: py - (along ? 0.6 : 1.5), w: along ? 3 : 1.2, d: along ? 1.2 : 3, r: 0.5 }, SOIL_Z + 2.4 + pod * 1.6, 1, 3);
    });
    return {
      ...leaves(blades),
      stem: stemOf(x!, y!, 0.8, SOIL_Z, 12),
      pods: merge(pods),
      base: at([x!, y!, SOIL_Z]),
    };
  });
}

export const CROP_ART = TRAY_X.map((cx, tray) => ({
  rice: riceOf(cx, tray),
  maize: maizeOf(cx, tray),
  soybean: soybeanOf(cx),
}));
