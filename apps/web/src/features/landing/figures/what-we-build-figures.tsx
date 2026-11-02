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
  sideRing,
  sideSeam,
  slabOf,
  type Plan,
  type Point3,
} from "@/components/iso/iso-kit";
import * as G from "@/components/iso/lathe.mjs";
import { Dots, IsoFigure, Line, Solid } from "@/components/iso/react/draw";
import "@/features/landing/figures/what-we-build-figures.css";

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

function frameAt(x: number, y: number, z: number) {
  return G.frameOf([x, y, z], UP, [1, 0, 0], [0, 1, 0]);
}

function nearerLast<T>(items: T[], pointOf: (item: T) => Point3) {
  return [...items].sort(function byDepth(a, b) {
    return depthOf(pointOf(a), P) - depthOf(pointOf(b), P);
  });
}

function around(radius: number, count: number): [number, number][] {
  return Array.from({ length: count }, function place(_, index) {
    const angle = (index / count) * Math.PI * 2;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  });
}

type Hue = "rose" | "blue" | "amber" | "green" | "violet" | "cyan";

function Glow({ on = true, children }: { on?: boolean; children: React.ReactNode }) {
  return on ? <g className="wwb-glow">{children}</g> : children;
}

function Bench({ hue, label, children }: { hue: Hue; label: string; children: React.ReactNode }) {
  const screws = corners(BENCH, 11).map(function onFloor([x, y]): Point3 {
    return [x, y, FLOOR];
  });
  const id = `wwb-${hue}`;
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

export function ServiceBellFigure() {
  const lipTop = FLOOR + 6;
  const arc = [10, 25, 40, 55, 70, 80].map(function onDome(degrees): [number, number, number] {
    const angle = (degrees * Math.PI) / 180;
    return [2 + 22 * Math.sin(angle), 27 * Math.cos(angle), 1];
  });
  const profile: [number, number, number?][] = [[0, 27], [2, 27], ...arc];
  const domeTop = lipTop + arc[arc.length - 1][0];
  const buttonBase = domeTop + 4;
  const screws = around(30.5, 6).map(function onTier([x, y]): Point3 {
    return [x, y, lipTop];
  });

  return (
    <Bench hue="rose" label="A service bell on a bench. The button on top glows.">
      <Solid paths={cylinder(0, 0, 40, FLOOR, 3, P, 56, 0.5)} tone="lo" />
      <Solid paths={cylinder(0, 0, 34, FLOOR + 3, 3, P, 56, 0.5)} tone="mid" />
      <Dots points={pointsAt(screws, P)} size={0.5} tone="mid" />
      <Solid paths={G.solidOf(profile, frameAt(0, 0, lipTop), P)} tone="mid" />
      <Solid paths={cylinder(0, 0, 2.4, domeTop, 4, P, 16)} tone="mid" crease="none" />
      <Glow>
        <Solid paths={cylinder(0, 0, 7, buttonBase, 3.5, P, 32, 0.6)} tone="hi" />
      </Glow>
      <Line d={ring(0, 0, 4.4, buttonBase + 3.5, P, 24)} tone="lo" />
    </Bench>
  );
}

export function DealBoardFigure() {
  const deck: Plan = { x: -70, y: -28, w: 140, d: 56, r: 5 };
  const deckTop = FLOOR + 3;
  const columns = [
    { x: -52, height: 18 },
    { x: -17, height: 32 },
    { x: 17, height: 46 },
    { x: 52, height: 26 },
  ];
  const flagged = columns[2];
  const flagBase = deckTop + flagged.height;

  return (
    <Bench
      hue="blue"
      label="A board of four columns of different heights. A glowing flag stands on the tallest one."
    >
      <Solid paths={slabOf(deck, FLOOR, 3, P, 6, 0.5)} tone="lo" />
      {columns.map(function renderColumn(column) {
        const plan: Plan = { x: column.x - 15, y: -22, w: 30, d: 44, r: 3 };
        const top = deckTop + column.height;
        return (
          <g key={column.x}>
            <Solid
              paths={slabOf(plan, deckTop, column.height, P, 4, 0.5)}
              tone="mid"
              inner={<Line d={sideSeam(plan, deckTop + column.height / 2, P, 4)} tone="faint" />}
            />
            <Line d={planOutline(insetPlan(plan, 4), top, P, 4)} tone="faint" />
          </g>
        );
      })}
      <Solid paths={cylinder(flagged.x, 0, 1.3, flagBase, 26, P, 12)} tone="mid" crease="none" />
      <Glow>
        <Solid
          paths={slabOf(
            { x: flagged.x + 1.3, y: -0.7, w: 16, d: 1.4, r: 0.4 },
            flagBase + 16,
            9,
            P,
            2,
          )}
          tone="hi"
        />
      </Glow>
    </Bench>
  );
}

export function ConveyorFigure() {
  const legTop = FLOOR + 14;
  const bed: Plan = { x: -62, y: -24, w: 124, d: 48, r: 5 };
  const belt: Plan = { x: -64, y: -20, w: 128, d: 40, r: 3 };
  const beltBase = FLOOR + 21;
  const beltTop = beltBase + 1.6;
  const rollerCentre = beltTop - 6;
  const legs: [number, number][] = [
    [-52, -17],
    [-52, 17],
    [52, -17],
    [52, 17],
  ];
  const slats = Array.from({ length: 9 }, function slatAt(_, index) {
    return lineOnTop([-56 + index * 14, -20], [-56 + index * 14, 20], beltTop, P);
  }).join("");
  const boxes = [
    { x: -36, y: 0, height: 16 },
    { x: -2, y: 2, height: 12 },
    { x: 32, y: -2, height: 18 },
  ];

  function roller(x: number, key: string) {
    return (
      <Solid
        key={key}
        paths={G.disc(0, 44, 6, G.frameAlong([x, -22, rollerCentre], [0, 1, 0]), P)}
        tone="lo"
      />
    );
  }

  return (
    <Bench hue="amber" label="A conveyor belt carrying three boxes. The nearest box glows.">
      {nearerLast(legs, function legPoint([x, y]) {
        return [x, y, FLOOR];
      }).map(function renderLeg([x, y]) {
        return <Solid key={`${x}${y}`} paths={cylinder(x, y, 3.2, FLOOR, 14, P, 16)} tone="lo" />;
      })}
      {roller(-70, "roller-far")}
      <Solid paths={slabOf(bed, legTop, 7, P, 4, 0.5)} tone="mid" />
      <Solid paths={slabOf(belt, beltBase, 1.6, P, 4)} tone="lo" />
      <Line d={slats} tone="faint" />
      {boxes.map(function renderBox(box, index) {
        const plan: Plan = { x: box.x - 13, y: box.y - 12, w: 26, d: 24, r: 2 };
        const top = beltTop + box.height;
        return (
          <g key={box.x}>
            <Glow on={index === boxes.length - 1}>
              <Solid paths={slabOf(plan, beltTop, box.height, P, 3, 0.5)} tone="mid" />
            </Glow>
            <Line d={lineOnTop([box.x, plan.y], [box.x, plan.y + plan.d], top, P)} tone="lo" />
          </g>
        );
      })}
      {roller(70, "roller-near")}
    </Bench>
  );
}

export function AbacusFigure() {
  const postHeight = 80;
  const rodLength = 84;
  const rodHeights = [20, 34, 48, 62].map(function aboveFloor(height) {
    return FLOOR + height;
  });
  const leftCounts = [3, 2, 4, 1];
  const beadProfile: [number, number][] = [
    [0, 4],
    [1.2, 6],
    [5.8, 6],
    [7, 4],
  ];

  function beadAt(x: number, z: number) {
    return G.solidOf(beadProfile, G.frameAlong([x, 0, z], [1, 0, 0]), P, { smooth: false });
  }

  return (
    <Bench hue="green" label="An abacus with four rods of beads. One bead glows.">
      <Solid
        paths={slabOf({ x: -50, y: -5, w: 8, d: 10, r: 1.5 }, FLOOR, postHeight, P, 3, 0.4)}
        tone="mid"
      />
      <Solid
        paths={slabOf({ x: -42, y: -5, w: 84, d: 10, r: 1.5 }, FLOOR, 8, P, 3, 0.4)}
        tone="mid"
      />
      <Solid
        paths={slabOf(
          { x: -42, y: -5, w: 84, d: 10, r: 1.5 },
          FLOOR + postHeight - 8,
          8,
          P,
          3,
          0.4,
        )}
        tone="mid"
      />
      {rodHeights.map(function renderRod(z) {
        return (
          <Solid
            key={z}
            paths={G.disc(0, rodLength, 1.3, G.frameAlong([-42, 0, z], [1, 0, 0]), P)}
            tone="lo"
            crease="none"
          />
        );
      })}
      {rodHeights.map(function renderBeads(z, rod) {
        return Array.from({ length: 5 }, function renderBead(_, index) {
          const x = index < leftCounts[rod] ? -42 + index * 7 : 42 - (5 - index) * 7;
          const isLit = rod === 2 && index === leftCounts[rod];
          return (
            <Glow key={`${rod}-${index}`} on={isLit}>
              <Solid paths={beadAt(x, z)} tone="mid" />
            </Glow>
          );
        });
      })}
      <Solid
        paths={slabOf({ x: 42, y: -5, w: 8, d: 10, r: 1.5 }, FLOOR, postHeight, P, 3, 0.4)}
        tone="mid"
      />
    </Bench>
  );
}

export function DocumentTrayFigure() {
  const tray: Plan = { x: -62, y: -48, w: 124, d: 96, r: 4 };
  const trayFloor = FLOOR + 4;
  const sheets = Array.from({ length: 9 }, function sheetAt(_, index): Plan {
    const drift = [0, 2, -1.5, 1, -2, 1.5, -1, 2, 0][index];
    return { x: -46 + drift, y: -36 - drift / 2, w: 90, d: 72, r: 1 };
  });
  const topSheet = sheets[sheets.length - 1];
  const topZ = trayFloor + sheets.length * 1.3;
  const rules = [
    [0.25, 1],
    [0.38, 0.9],
    [0.5, 1],
    [0.62, 0.7],
    [0.74, 0.85],
  ];
  const field: Plan = {
    x: topSheet.x + 8,
    y: topSheet.y + topSheet.d * 0.8 - 4,
    w: 36,
    d: 8,
    r: 1,
  };

  return (
    <Bench
      hue="violet"
      label="A paper tray with a stack of sheets. The top sheet has lines of text and one glowing field."
    >
      <Solid paths={slabOf(tray, FLOOR, 4, P, 4, 0.5)} tone="lo" />
      <Solid
        paths={slabOf({ x: tray.x, y: tray.y, w: 4, d: tray.d, r: 1 }, trayFloor, 22, P, 2, 0.4)}
        tone="mid"
      />
      <Solid
        paths={slabOf(
          { x: tray.x + 4, y: tray.y, w: tray.w - 4, d: 4, r: 1 },
          trayFloor,
          22,
          P,
          2,
          0.4,
        )}
        tone="mid"
      />
      {sheets.map(function renderSheet(sheet, index) {
        return (
          <Solid
            key={index}
            paths={slabOf(sheet, trayFloor + index * 1.3, 1.3, P, 2)}
            tone="mid"
            crease="none"
          />
        );
      })}
      {rules.map(function renderRule([across, length]) {
        const y = topSheet.y + topSheet.d * across;
        return (
          <Line
            key={across}
            d={lineOnTop([topSheet.x + 8, y], [topSheet.x + 8 + 74 * length, y], topZ, P)}
            tone="lo"
            free
          />
        );
      })}
      <Glow>
        <Solid paths={slabOf(field, topZ, 0.8, P, 2)} tone="hi" crease="none" />
      </Glow>
      <Solid
        paths={slabOf(
          { x: tray.x + 4, y: tray.y + tray.d - 4, w: tray.w - 4, d: 4, r: 1 },
          trayFloor,
          7,
          P,
          2,
          0.4,
        )}
        tone="mid"
      />
      <Solid
        paths={slabOf(
          { x: tray.x + tray.w - 4, y: tray.y + 4, w: 4, d: tray.d - 8, r: 1 },
          trayFloor,
          7,
          P,
          2,
          0.4,
        )}
        tone="mid"
      />
    </Bench>
  );
}

export function SensorMastFigure() {
  const poleBase = FLOOR + 8;
  const poleTop = FLOOR + 50;
  const head: Plan = { x: -14, y: -10, w: 28, d: 20, r: 3 };
  const headTop = poleTop + 14;
  const bolts = around(18, 4).map(function onBase([x, y]): Point3 {
    return [x, y, FLOOR + 4];
  });

  return (
    <Bench
      hue="cyan"
      label="A sensor mast. A box with a lens sits on a pole. A glowing beacon sits on the box."
    >
      <Solid paths={cylinder(0, 0, 24, FLOOR, 4, P, 40, 0.5)} tone="lo" />
      <Dots points={pointsAt(bolts, P)} size={0.5} tone="mid" />
      <Solid paths={cylinder(0, 0, 10, FLOOR + 4, 4, P, 28, 0.4)} tone="mid" />
      <Solid
        paths={cylinder(0, 0, 3, poleBase, poleTop - poleBase, P, 20)}
        tone="mid"
        crease="none"
      />
      <Solid paths={slabOf(head, poleTop, 14, P, 4, 0.5)} tone="mid" />
      <Line d={sideRing([14, 0, poleTop + 7], 4.2, "x", P)} tone="lo" />
      <Line d={sideRing([14, 0, poleTop + 7], 2, "x", P)} tone="faint" />
      <Solid paths={cylinder(-8, -4, 1.2, headTop, 20, P, 12)} tone="mid" crease="none" />
      <Solid paths={cylinder(6, 0, 6, headTop, 2, P, 24, 0.3)} tone="mid" />
      <Glow>
        <Solid paths={G.sphereOf([6, 0, headTop + 2 + 5], 5, P)} tone="hi" />
      </Glow>
    </Bench>
  );
}
