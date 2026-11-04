import {
  axisVector,
  corners,
  cylinder,
  insetPlan,
  iso,
  lineOnTop,
  pathOf,
  planOutline,
  pointsAt,
  ring,
  slabOf,
  type Plan,
  type Point3,
} from "@/components/iso/iso-kit";
import * as G from "@/components/iso/lathe.mjs";
import { Dots, Line, Solid } from "@/components/iso/react/draw";
import {
  Bench,
  FLOOR,
  Flyer,
  Glow,
  P,
  faceBox,
  frameAt,
  pathThrough,
  slab,
} from "@/features/landing/figures/bench";

const LAUNCH_X = -36;
const LAND_X = 42;
const APEX_Z = 58;
const PLANET = { x: 2, z: 30, r: 11 };

function vectorOf(by: Point3) {
  const [x, y] = axisVector(P, by);
  return `${x}px ${y}px`;
}

export function LaunchFigure() {
  const floorTop = FLOOR + 3;
  const moon: Plan = { x: -52, y: -30, w: 104, d: 60, r: 12 };
  const padTop = floorTop + 1.6;
  const centerZ = padTop + 7.5;
  const flight = pathThrough(
    Array.from({ length: 61 }, (_, index): Point3 => {
      const t = index / 60;
      const along = 3 * t * t - 2 * t ** 3;
      return [
        LAUNCH_X + (LAND_X - LAUNCH_X) * along,
        0,
        centerZ + (APEX_Z - centerZ) * Math.sin(Math.PI * t),
      ];
    }),
  );
  const table: Plan = { x: -46, y: -27, w: 16, d: 12, r: 0.8 };
  const tableTop = floorTop + 10;
  const sheet = insetPlan(table, 2);
  const lampAt = { x: -44, y: -25 };
  const lampHead = tableTop + 13;
  const planetFrame = frameAt(PLANET.x, 0, PLANET.z);
  const planetCenter = iso([PLANET.x, 0, PLANET.z], P);
  const ringSolids = [
    [14.5, 16.5],
    [17.5, 20.5],
  ].map(([inner, outer]) => {
    const d = ring(PLANET.x, 0, outer, PLANET.z, P, 64) + ring(PLANET.x, 0, inner, PLANET.z, P, 64);
    return (
      <g key={inner}>
        <path className="iso-top" fillRule="evenodd" d={d} />
        <path className="iso-line iso-edge" data-tone="lo" d={d} />
      </g>
    );
  });
  const bands = [-4.5, 0.5, 4, 7];
  const clampIn = vectorOf([0, 3.8, 0]);
  const clampOut = vectorOf([0, -3.8, 0]);
  const screws = corners(moon, 6).map(([x, y]): Point3 => {
    return [x, y, floorTop];
  });
  const landingLamps = [30, 150, 270].map((degrees): [number, number] => {
    const angle = (degrees * Math.PI) / 180;
    return [LAND_X + Math.cos(angle) * 11, Math.sin(angle) * 11];
  });
  const rocketBase = centerZ - 7.5;
  const rocketProfile: [number, number, number?][] = [
    [0, 2.7],
    [1, 3.2, 1],
    [9.5, 3.2],
    [13, 1.8, 1],
    [15, 0.3],
  ];

  function pad(x: number) {
    return (
      <>
        <Solid paths={cylinder(x, 0, 8.4, floorTop, 1.6, P, 40, 0.3)} tone="mid" />
        <Line d={ring(x, 0, 6, padTop, P, 32)} tone="faint" />
        <Line d={ring(x, 0, 3, padTop, P, 24)} tone="faint" />
      </>
    );
  }

  function planetBands() {
    return (
      <>
        {bands.map((height) => {
          const radius = Math.sqrt(PLANET.r ** 2 - height ** 2);
          return (
            <Line
              key={height}
              d={G.arcOf(planetFrame, height, radius, P, { slope: -height / radius })}
              tone={height === 0.5 ? "mid" : "faint"}
            />
          );
        })}
      </>
    );
  }

  function rocket() {
    const back = [
      { key: "w", plan: { x: LAUNCH_X - 4.8, y: -0.35, w: 2, d: 0.7, r: 0.15 } },
      { key: "n", plan: { x: LAUNCH_X - 0.35, y: -4.8, w: 0.7, d: 2, r: 0.15 } },
    ];
    const front = [
      { key: "e", plan: { x: LAUNCH_X + 2.8, y: -0.35, w: 2, d: 0.7, r: 0.15 } },
      { key: "s", plan: { x: LAUNCH_X - 0.35, y: 2.8, w: 0.7, d: 2, r: 0.15 } },
    ];
    return (
      <>
        {back.map((fin) => {
          return <g key={fin.key}>{slab(fin.plan, rocketBase, 4)}</g>;
        })}
        <Glow>
          <Solid paths={G.solidOf(rocketProfile, frameAt(LAUNCH_X, 0, rocketBase), P)} tone="hi" />
        </Glow>
        <Line d={ring(LAUNCH_X, 0, 3.2, rocketBase + 5, P, 20)} tone="lo" />
        <Line d={ring(LAUNCH_X, 0, 3.2, rocketBase + 8, P, 20)} tone="lo" />
        {front.map((fin) => {
          return <g key={fin.key}>{slab(fin.plan, rocketBase, 4)}</g>;
        })}
      </>
    );
  }

  return (
    <Bench
      hue="green"
      id="hts-launch"
      label="A drafting table, a build clamp and a launch pad. A rocket is built on the pad, then flies a long arc over a ringed planet to a far landing pad."
    >
      <clipPath id="hts-ring-front">
        <rect x={0} y={planetCenter[1]} width={280} height={170} />
      </clipPath>
      {slab(moon, FLOOR, 3, "lo")}
      <Line d={planOutline(insetPlan(moon, 3), floorTop, P)} tone="faint" />
      <Dots points={pointsAt(screws, P)} size={0.45} tone="mid" />

      {[
        [table.x + 1.6, table.y + 1.6],
        [table.x + table.w - 1.6, table.y + 1.6],
        [table.x + 1.6, table.y + table.d - 1.6],
        [table.x + table.w - 1.6, table.y + table.d - 1.6],
      ].map(([x, y]) => {
        return (
          <Solid
            key={`${x}${y}`}
            paths={cylinder(x, y, 0.9, floorTop, 10, P, 10)}
            tone="lo"
            crease="none"
          />
        );
      })}
      <Solid paths={slabOf(table, tableTop - 2, 2, P, 4, 0.4)} tone="mid" />
      <Solid paths={slabOf(sheet, tableTop, 0.5, P, 4, 0.2)} tone="lo" crease="none" />
      {[-3, 0, 3].map((offset) => {
        const y = sheet.y + sheet.d / 2 + offset;
        return (
          <Line
            key={`r${offset}`}
            d={lineOnTop([sheet.x, y], [sheet.x + sheet.w, y], tableTop + 0.5, P)}
            tone="faint"
          />
        );
      })}
      {[-4, 0, 4].map((offset) => {
        const x = sheet.x + sheet.w / 2 + offset;
        return (
          <Line
            key={`c${offset}`}
            d={lineOnTop([x, sheet.y], [x, sheet.y + sheet.d], tableTop + 0.5, P)}
            tone="faint"
          />
        );
      })}
      <Line
        d={ring(sheet.x + sheet.w / 2 + 2, sheet.y + sheet.d / 2, 2.8, tableTop + 0.5, P, 24)}
        tone="mid"
      />
      <Solid paths={cylinder(lampAt.x, lampAt.y, 2, tableTop, 1, P, 16, 0.2)} tone="lo" />
      <Solid
        paths={cylinder(lampAt.x, lampAt.y, 0.5, tableTop + 1, 11, P, 8)}
        tone="mid"
        crease="none"
      />
      <Solid paths={cylinder(lampAt.x, lampAt.y, 2.6, lampHead - 1.4, 1.4, P, 16, 0.2)} tone="lo" />
      <Solid paths={G.sphereOf([lampAt.x, lampAt.y, lampHead - 1.8], 1.7, P)} tone="lo" />
      <g className="hts-lamp">
        <Glow>
          <Solid paths={G.sphereOf([lampAt.x, lampAt.y, lampHead - 1.8], 1.7, P)} tone="hi" />
        </Glow>
      </g>

      <Solid
        paths={slabOf({ x: -47, y: -12, w: 4, d: 4, r: 0.4 }, floorTop, 36, P, 4, 0.4)}
        tone="mid"
      />
      {[10, 18, 26].map((z) => {
        return (
          <Line
            key={z}
            d={faceBox("y", -8, -46.4, -43.6, floorTop + z, floorTop + z + 2)}
            tone="faint"
          />
        );
      })}
      <Solid paths={cylinder(-45, -10, 1, floorTop + 36, 2, P, 10, 0.2)} tone="lo" />
      <Solid paths={G.sphereOf([-45, -10, floorTop + 40], 1.6, P)} tone="lo" />
      <g className="hts-ready">
        <Glow>
          <Solid paths={G.sphereOf([-45, -10, floorTop + 40], 1.6, P)} tone="hi" />
        </Glow>
      </g>

      {pad(LAUNCH_X)}
      <Solid paths={cylinder(LAUNCH_X, -13.5, 0.8, floorTop, 9, P, 10)} tone="mid" crease="none" />
      <g className="hts-clamp" style={{ "--clamp": clampIn } as React.CSSProperties}>
        {slab({ x: LAUNCH_X - 1.2, y: -12, w: 2.4, d: 5, r: 0.3 }, rocketBase + 3.5, 2.2)}
      </g>

      <Solid paths={cylinder(PLANET.x, 0, 7, floorTop, 3, P, 32, 0.4)} tone="mid" />
      <Line d={ring(PLANET.x, 0, 4.6, floorTop + 3, P, 24)} tone="faint" />
      <Solid paths={cylinder(PLANET.x, 0, 2.2, floorTop + 3, 13, P, 14)} tone="mid" crease="none" />
      {ringSolids}
      <Solid
        paths={G.sphereOf([PLANET.x, 0, PLANET.z], PLANET.r, P)}
        tone="mid"
        inner={planetBands()}
      />
      <g clipPath="url(#hts-ring-front)">{ringSolids}</g>

      {pad(LAND_X)}
      {landingLamps.map(([x, y]) => {
        return (
          <g key={`${x}${y}`}>
            <Solid paths={cylinder(x, y, 0.6, padTop, 3, P, 10)} tone="mid" crease="none" />
            <Solid paths={G.sphereOf([x, y, padTop + 3.8], 1.1, P)} tone="lo" />
          </g>
        );
      })}
      <g className="hts-beacon">
        {landingLamps.map(([x, y]) => {
          return (
            <Glow key={`${x}${y}`}>
              <Solid paths={G.sphereOf([x, y, padTop + 3.8], 1.1, P)} tone="hi" />
            </Glow>
          );
        })}
      </g>

      <g className="hts-plume">
        {[0, 90, 180, 270].map((degrees) => {
          const angle = (degrees * Math.PI) / 180;
          return (
            <Glow key={degrees}>
              <Solid
                paths={G.sphereOf(
                  [LAUNCH_X + Math.cos(angle) * 4.6, Math.sin(angle) * 4.6, padTop + 1.4],
                  1.6,
                  P,
                )}
                tone="hi"
              />
            </Glow>
          );
        })}
      </g>

      <Line
        d={pathOf(
          Array.from({ length: 61 }, (_, index) => {
            const t = index / 60;
            const along = 3 * t * t - 2 * t ** 3;
            return iso(
              [
                LAUNCH_X + (LAND_X - LAUNCH_X) * along,
                0,
                centerZ + (APEX_Z - centerZ) * Math.sin(Math.PI * t),
              ],
              P,
            );
          }),
        )}
        tone="faint"
        dotted
      />
      <g className="hts-flight">
        <Flyer home={[LAUNCH_X, 0, centerZ]} path={flight.d} className="hts-rocket">
          {rocket()}
        </Flyer>
      </g>

      <g className="hts-clamp" style={{ "--clamp": clampOut } as React.CSSProperties}>
        {slab({ x: LAUNCH_X - 1.2, y: 7, w: 2.4, d: 5, r: 0.3 }, rocketBase + 3.5, 2.2)}
      </g>
      <Solid paths={cylinder(LAUNCH_X, 13.5, 0.8, floorTop, 9, P, 10)} tone="mid" crease="none" />
    </Bench>
  );
}
