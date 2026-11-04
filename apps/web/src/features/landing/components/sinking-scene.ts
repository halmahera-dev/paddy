import {
  boxCorners,
  corners,
  cylinder,
  fitProjection,
  haloOf,
  iso,
  knurl,
  pathOf,
  pointsAt,
  ring,
  sideArc,
  slabOf,
  translateAlong,
  type Flat,
  type Plan,
  type Point3,
} from "@/components/iso/iso-kit";

const X0 = -150;
const X1 = 150;
const Y0 = -70;
const Y1 = 70;
const FOOT = 4;
const BASE_TOP = 12;
const AQUIFER_TOP = 56;
const CLAY_TOP = 80;
const TOP = 100;
const SEA = 88;
const MAX_SINK = 26;
const MAX_DRAWDOWN = 28;
const BOWL_WIDTH = 58;
const CELL = 6;
const ROW = 20;
const HOUSE_LEAN = 0.6;
const CASING_RADIUS = 6;
const CRACK_FROM_LEVEL = 0.3;
export const MAX_CM_PER_YEAR = 11;

// The pump head stands behind the cut face. Its axis lines up on screen with the casing drawn on the face.
const PUMP: [number, number] = [-12, 58];
const TANK: [number, number] = [100, 40];
const TANK_RADIUS = 14;
const TANK_HEIGHT = 24;
const STAFF: [number, number] = [24, 18];
const STAFF_HEIGHT = 36;
const HOUSES = [
  { x: -100, y: -35 },
  { x: -45, y: -38 },
  { x: 45, y: -38 },
];
const INFLOW_LEVELS = [22, 30, 38];
const CRACKS: Point3[][] = [
  [
    [-50, -2, 0],
    [-45, 10, 0],
    [-51, 22, 0],
    [-46, 34, 0],
  ],
  [
    [50, 4, 0],
    [45, 16, 0],
    [51, 28, 0],
    [46, 40, 0],
  ],
];

const BLOCK: Plan = { x: X0, y: Y0, w: X1 - X0, d: Y1 - Y0, r: 3 };

export const WIDTH = 640;
export const HEIGHT = 340;

export const P = fitProjection(
  [
    ...boxCorners(BLOCK, -FOOT, TOP),
    [PUMP[0], PUMP[1], TOP + 32],
    [TANK[0], TANK[1], TOP + 34],
  ],
  WIDTH,
  HEIGHT,
  { pad: 20 },
);

function at(x: number, y: number, z: number): Flat {
  return iso([x, y, z], P);
}

function bowl(x: number) {
  return Math.exp(-((x / BOWL_WIDTH) ** 2));
}

function ellipseAt(cx: number, cy: number, rx: number, ry: number) {
  return `M${(cx - rx).toFixed(1)} ${cy.toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(cx + rx).toFixed(1)} ${cy.toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(cx - rx).toFixed(1)} ${cy.toFixed(1)}Z`;
}

function frontArc(cx: number, cy: number, rx: number, ry: number) {
  return `M${(cx - rx).toFixed(1)} ${cy.toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 0 ${(cx + rx).toFixed(1)} ${cy.toFixed(1)}`;
}

function bandAt(cx: number, from: number, to: number, top: number, bottom: number) {
  return pathOf(
    [
      [cx + from, top],
      [cx + to, top],
      [cx + to, bottom],
      [cx + from, bottom],
    ],
    true,
  );
}

// A vertical cylinder seen from the side: three tone bands, a curved lower end and an elliptical top.
function tubeAt(cx: number, half: number, top: number, bottom: number) {
  const ry = half * P_FLATTEN;
  return {
    left: bandAt(cx, -half, -half * 0.35, top, bottom),
    middle: bandAt(cx, -half * 0.35, half * 0.15, top, bottom),
    right: bandAt(cx, half * 0.15, half, top, bottom),
    lowerCap: `M${(cx - half).toFixed(1)} ${bottom.toFixed(1)}A${half.toFixed(1)} ${ry.toFixed(1)} 0 0 0 ${(cx + half).toFixed(1)} ${bottom.toFixed(1)}Z`,
    upperCap: ellipseAt(cx, top, half, ry),
    edges: pathOf([[cx - half, top], [cx - half, bottom]]) + pathOf([[cx + half, top], [cx + half, bottom]]) + frontArc(cx, bottom, half, ry),
    rings: (offsets: number[]) => offsets.map((offset) => frontArc(cx, bottom + offset, half, ry)).join(""),
  };
}

function segments(pairs: [Point3, Point3][]) {
  return pairs.map(([from, to]) => pathOf([at(...from), at(...to)])).join("");
}

const P_FLATTEN = 0.5;

const XS = Array.from({ length: (X1 - X0) / 5 + 1 }, (_, index) => {
  return X0 + index * 5;
});

type Surface = (x: number) => number;

export function levelFacts(level: number) {
  const groundAtPump = TOP - MAX_SINK * level;
  const waterAtPump = AQUIFER_TOP - MAX_DRAWDOWN * level;
  return {
    percent: Math.round(level * 100),
    cmPerYear: Math.round(level * MAX_CM_PER_YEAR),
    waterLeft: Math.round(((waterAtPump - BASE_TOP) / (AQUIFER_TOP - BASE_TOP)) * 100),
    isBelowSea: groundAtPump < SEA,
  };
}

function face(upper: Surface, lower: Surface) {
  const top = XS.map((x) => at(x, Y1, upper(x)));
  const bottom = [...XS].reverse().map((x) => at(x, Y1, lower(x)));
  return pathOf([...top, ...bottom], true);
}

function sideBand(from: number, to: number) {
  return pathOf([at(X1, Y0, to), at(X1, Y1, to), at(X1, Y1, from), at(X1, Y0, from)], true);
}

type CellKind = "top" | "water" | 0 | 1 | 2 | 3;

function kindOf(left: number, right: number): CellKind {
  if ((left + right) / 2 < SEA) return "water";
  const slope = (right - left) / CELL;
  if (Math.abs(slope) < 0.05) return "top";
  const lit = 0.5 - (slope / Math.hypot(1, slope)) * 1.1;
  return Math.min(3, Math.max(0, Math.floor(lit * 4))) as 0 | 1 | 2 | 3;
}

function surfaceCells(ground: Surface) {
  const columns = (X1 - X0) / CELL;
  const cells: { d: string; kind: CellKind }[] = [];
  for (let y = Y0; y < Y1; y += ROW) {
    let runFrom = 0;
    let runKind: CellKind | null = null;
    for (let column = 0; column <= columns; column++) {
      const x = X0 + column * CELL;
      const kind = column < columns ? kindOf(ground(x), ground(x + CELL)) : null;
      if (kind === runKind) continue;
      if (runKind !== null) {
        const heightAt = runKind === "water" ? () => SEA : ground;
        const xs = Array.from({ length: column - runFrom + 1 }, (_, step) => X0 + (runFrom + step) * CELL);
        const back = xs.map((value) => at(value, y, heightAt(value)));
        const front = [...xs].reverse().map((value) => at(value, y + ROW, heightAt(value)));
        cells.push({ d: pathOf([...back, ...front], true), kind: runKind });
      }
      runFrom = column;
      runKind = kind;
    }
  }
  return cells;
}

function inflowLines(water: Surface) {
  const lines: string[] = [];
  for (const z of INFLOW_LEVELS) {
    const reachable = XS.filter((x) => Math.abs(x) > 14 && Math.abs(x) < 130 && water(x) > z + 1);
    const left = reachable.filter((x) => x < 0);
    const right = reachable.filter((x) => x > 0).reverse();
    for (const run of [left, right]) {
      if (run.length > 1) lines.push(pathOf(run.map((x) => at(x, Y1, z))));
    }
  }
  return lines;
}

function houseDetails(house: { x: number; y: number }) {
  const front = house.y + 11;
  const side = house.x + 13;
  function pane(x: number, z: number): [number, number, number][] {
    return [
      [x - 3, front, z],
      [x + 3, front, z],
      [x + 3, front, z + 6],
      [x - 3, front, z + 6],
    ];
  }
  const sidePane = [
    [side, house.y - 5, TOP + 7],
    [side, house.y + 5, TOP + 7],
    [side, house.y + 5, TOP + 13],
    [side, house.y - 5, TOP + 13],
  ] as Point3[];
  const frontPane = pathOf(pane(house.x - 7, TOP + 8).map((p) => at(...p)), true);
  const sideWindow = pathOf(sidePane.map((p) => at(...p)), true);
  const door = pathOf([
    at(house.x + 3, front, TOP),
    at(house.x + 3, front, TOP + 11),
    at(house.x + 9, front, TOP + 11),
    at(house.x + 9, front, TOP),
  ]);
  const mullions = segments([
    [
      [house.x - 7, front, TOP + 8],
      [house.x - 7, front, TOP + 14],
    ],
    [
      [side, house.y, TOP + 7],
      [side, house.y, TOP + 13],
    ],
  ]);
  const ridge = pathOf([at(house.x - 15, house.y, TOP + 21), at(house.x + 15, house.y, TOP + 21)]);
  return { windows: frontPane + sideWindow + door, mullions, ridge };
}

const BASE_TICKS = (() => {
  const minor: [Point3, Point3][] = [];
  const major: [Point3, Point3][] = [];
  for (let x = -120; x <= 120; x += 8) {
    const long = x % 40 === 0;
    (long ? major : minor).push([
      [x, Y1, 9.8],
      [x, Y1, long ? 6.4 : 8],
    ]);
  }
  return { minor: segments(minor), major: segments(major) };
})();

const DEPTH_RULER = (() => {
  const minor: [Point3, Point3][] = [];
  const major: [Point3, Point3][] = [];
  for (let z = BASE_TOP + 4; z < TOP; z += 4) {
    const long = (z - BASE_TOP) % 20 === 4;
    (long ? major : minor).push([
      [X0, Y1, z],
      [X0 + (long ? 9 : 5), Y1, z],
    ]);
  }
  return { minor: segments(minor), major: segments(major) };
})();

const SAND = (() => {
  const points: Flat[] = [];
  for (let row = 0; row < 4; row++) {
    for (let x = -134 + (row % 2) * 9; x <= 134; x += 18) {
      points.push(at(x, Y1, 19 + row * 10));
    }
  }
  return points;
})();

const STAFF_TICKS = (() => {
  const minor: [Point3, Point3][] = [];
  const major: [Point3, Point3][] = [];
  for (let step = 1; step * 5 < STAFF_HEIGHT; step++) {
    const long = step % 3 === 0;
    (long ? major : minor).push([
      [STAFF[0] - 2, STAFF[1] + 2, TOP + step * 5],
      [STAFF[0] - 2 + (long ? 4 : 2.4), STAFF[1] + 2, TOP + step * 5],
    ]);
  }
  return { minor: segments(minor), major: segments(major) };
})();

export function sceneAt(level: number) {
  const sink = MAX_SINK * level;
  function ground(x: number) {
    return TOP - sink * bowl(x);
  }
  function clay(x: number) {
    return CLAY_TOP - sink * 0.9 * bowl(x);
  }
  function water(x: number) {
    return AQUIFER_TOP - MAX_DRAWDOWN * level * bowl(x);
  }
  function aquiferTop(_x: number) {
    return AQUIFER_TOP;
  }
  function baseTop(_x: number) {
    return BASE_TOP;
  }
  function sea(_x: number) {
    return SEA;
  }

  const houses = HOUSES.map((house) => {
    const slope = (ground(house.x + 1) - ground(house.x - 1)) / 2;
    const lean = -HOUSE_LEAN * Math.atan(slope) * (180 / Math.PI);
    const [cx, cy] = at(house.x, house.y, TOP);
    return `${translateAlong(P, [0, 0, ground(house.x) - TOP])} rotate(${lean.toFixed(2)} ${cx.toFixed(1)} ${cy.toFixed(1)})`;
  });

  const pumpDrop = ground(PUMP[0]) - TOP;
  const head = at(PUMP[0], PUMP[1], TOP + pumpDrop);
  const intake = at(0, Y1, BASE_TOP + 14);
  const half = CASING_RADIUS * P.scale * 1.265;
  const screenHalf = half * 1.5;
  const casing = tubeAt(head[0], half, head[1], intake[1]);
  const submersible = tubeAt(head[0], half * 0.7, intake[1] - 26, intake[1] - 9);
  const intakeScreen = tubeAt(head[0], screenHalf, intake[1] - 7, intake[1] + 7);
  const slots = intakeScreen.rings([-11, -7, -3.5]);
  const cable = pathOf([
    [head[0] + half * 0.45, head[1] + 4],
    [head[0] + half * 0.45, intake[1] - 26],
  ]);

  const streamFrom: Point3 = [PUMP[0], PUMP[1], TOP + 23 + pumpDrop];
  const streamTo: Point3 = [TANK[0], TANK[1], TOP + TANK_HEIGHT + 3];
  const stream = pathOf(
    Array.from({ length: 16 }, (_, index) => {
      const t = index / 15;
      return at(
        streamFrom[0] + (streamTo[0] - streamFrom[0]) * t,
        streamFrom[1] + (streamTo[1] - streamFrom[1]) * t,
        streamFrom[2] + (streamTo[2] - streamFrom[2]) * t + 16 * 4 * t * (1 - t),
      );
    }),
  );

  const clayLines = [0.25, 0.5, 0.75].map((share) =>
    pathOf(XS.map((x) => at(x, Y1, AQUIFER_TOP + share * (clay(x) - AQUIFER_TOP)))),
  );
  const sideClayLines = [0.25, 0.5, 0.75]
    .map((share) => {
      const z = AQUIFER_TOP + share * (CLAY_TOP - AQUIFER_TOP);
      return pathOf([at(X1, Y0, z), at(X1, Y1, z)]);
    })
    .join("");

  const cracks = CRACKS.map((points) => pathOf(points.map(([x, y]) => at(x, y, ground(x)))));
  const staffDrop = ground(STAFF[0]) - TOP;

  return {
    cells: surfaceCells(ground),
    sideBands: {
      soil: sideBand(CLAY_TOP, TOP),
      clay: sideBand(AQUIFER_TOP, CLAY_TOP),
      aquifer: sideBand(BASE_TOP, AQUIFER_TOP),
      clayLine: pathOf([at(X1, Y0, CLAY_TOP), at(X1, Y1, CLAY_TOP)]),
      aquiferLine: pathOf([at(X1, Y0, AQUIFER_TOP), at(X1, Y1, AQUIFER_TOP)]),
      clayLines: sideClayLines,
    },
    front: {
      whole: face(ground, baseTop),
      soil: face(ground, clay),
      clay: face(clay, aquiferTop),
      dry: face(aquiferTop, water),
      wet: face(water, baseTop),
      groundLine: pathOf(XS.map((x) => at(x, Y1, ground(x)))),
      clayLine: pathOf(XS.map((x) => at(x, Y1, clay(x)))),
      clayLines,
      aquiferLine: pathOf([at(X0, Y1, AQUIFER_TOP), at(X1, Y1, AQUIFER_TOP)]),
      waterLine: pathOf(XS.map((x) => at(x, Y1, water(x)))),
      seaLine: pathOf(XS.map((x) => at(x, Y1, sea(x)))),
      leftEdge: pathOf([at(X0, Y1, ground(X0)), at(X0, Y1, BASE_TOP)]),
      rightEdge: pathOf([at(X1, Y1, ground(X1)), at(X1, Y1, BASE_TOP)]),
      inflow: inflowLines(water),
    },
    edges: {
      back: pathOf(XS.map((x) => at(x, Y0, ground(x)))),
      right: pathOf([at(X1, Y0, ground(X1)), at(X1, Y1, ground(X1))]),
      rightBack: pathOf([at(X1, Y0, ground(X1)), at(X1, Y0, BASE_TOP)]),
    },
    cracks,
    crackOpacity: Math.min(1, Math.max(0, (level - CRACK_FROM_LEVEL) * 3)),
    houses,
    pumpTransform: translateAlong(P, [0, 0, pumpDrop]),
    staffTransform: translateAlong(P, [0, 0, staffDrop]),
    isStaffWet: ground(STAFF[0]) < SEA,
    casing,
    intakeScreen,
    slots,
    submersible,
    cable,
    stream,
    streamEnds: [at(...streamFrom), at(...streamTo)] satisfies Flat[],
    tankLevel: sideArc(TANK[0], TANK[1], TANK_RADIUS, TOP + 3 + (TANK_HEIGHT - 8) * level, P, 24),
  };
}

const feet = corners(BLOCK, 16).sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
const pumpPlate: Plan = { x: PUMP[0] - 11, y: PUMP[1] - 11, w: 22, d: 22, r: 3 };

export const PARTS = {
  halo: haloOf(BLOCK, -FOOT, BASE_TOP + FOOT, P),
  feet: feet.map(([x, y]) => cylinder(x, y, 7, -FOOT, FOOT, P, 20)),
  base: slabOf(BLOCK, 0, BASE_TOP, P, 4, 0.6),
  baseTicks: BASE_TICKS,
  baseScrews: pointsAt(
    [
      [-132, Y1, 5],
      [132, Y1, 5],
      [X1, -52, 5],
      [X1, 52, 5],
    ],
    P,
  ),
  depthRuler: DEPTH_RULER,
  sand: SAND,
  houses: HOUSES.map((house) => {
    const body: Plan = { x: house.x - 13, y: house.y - 11, w: 26, d: 22, r: 1.5 };
    const roof: Plan = { x: house.x - 15, y: house.y - 13, w: 30, d: 26, r: 1.5 };
    return {
      key: house.x,
      body: slabOf(body, TOP, 18, P, 3, 0.4),
      roof: slabOf(roof, TOP + 18, 3, P, 3, 0.4),
      chimney: slabOf({ x: house.x + 5, y: house.y - 9, w: 5, d: 5, r: 0.5 }, TOP + 21, 7, P, 2),
      ...houseDetails(house),
    };
  }),
  pumpPlate: slabOf(pumpPlate, TOP, 3, P, 4, 0.5),
  pumpScrews: pointsAt(
    corners(pumpPlate, 3).map(([x, y]): Point3 => [x, y, TOP + 3]),
    P,
  ),
  pumpMotor: cylinder(PUMP[0], PUMP[1], 7.5, TOP + 3, 16, P, 32, 0.5),
  pumpRibs: knurl(PUMP[0], PUMP[1], 7.5, TOP + 5.5, TOP + 18, 20, P, 0.3),
  pumpFlange: sideArc(PUMP[0], PUMP[1], 7.5, TOP + 5, P, 20),
  pumpBox: slabOf({ x: PUMP[0] + 5, y: PUMP[1] - 3.5, w: 9, d: 7, r: 1 }, TOP + 6, 7, P, 3, 0.4),
  pumpCap: cylinder(PUMP[0], PUMP[1], 4.5, TOP + 19, 4, P, 24),
  pumpBolts: ring(PUMP[0], PUMP[1], 2.6, TOP + 23, P, 12),
  tank: cylinder(TANK[0], TANK[1], TANK_RADIUS, TOP - 1.5, TANK_HEIGHT + 1.5, P, 40, 0.5),
  tankBands: [TOP + 6, TOP + 17].map((z) => sideArc(TANK[0], TANK[1], TANK_RADIUS, z, P, 24)).join(""),
  tankLid: cylinder(TANK[0], TANK[1], TANK_RADIUS + 1, TOP + TANK_HEIGHT, 1.8, P, 40, 0.4),
  tankHatch: cylinder(TANK[0], TANK[1], 3.6, TOP + TANK_HEIGHT + 1.8, 1.6, P, 20),
  staff: slabOf({ x: STAFF[0] - 2, y: STAFF[1] - 2, w: 4, d: 4, r: 0.6 }, TOP, STAFF_HEIGHT, P, 2, 0.3),
  staffTicks: STAFF_TICKS,
  staffTop: ring(STAFF[0], STAFF[1], 1, TOP + STAFF_HEIGHT, P, 8),
  seaRing: ring(STAFF[0], STAFF[1], 5, SEA, P, 20),
};

export const TOUR_SECONDS = 14;
export const START_LEVEL = 0.7;
