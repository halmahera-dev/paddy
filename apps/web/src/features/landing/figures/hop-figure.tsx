import {
  corners,
  cylinder,
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

const DAYS = 14;
const PAD_X = 30;
const APEX = 40;

export function HopFigure() {
  const floorTop = FLOOR + 3;
  const moon: Plan = { x: -52, y: -30, w: 104, d: 60, r: 12 };
  const padTop = floorTop + 1.6;
  const legs = 4;
  const centerZ = padTop + legs + 4;
  const arc = pathThrough(
    Array.from({ length: 49 }, function arcAt(_, index): Point3 {
      const t = index / 48;
      return [-PAD_X + 2 * PAD_X * t, 0, centerZ + APEX * 4 * t * (1 - t)];
    }),
  );
  const lamps = Array.from({ length: DAYS }, function lampAt(_, index) {
    const x = -19 + (index * 38) / (DAYS - 1);
    const reached = arc.fractions[Math.round(((x + PAD_X) / (2 * PAD_X)) * 48)];
    return { index, x, reached };
  });
  const craters = [
    { x: -10, y: 17, r: 5 },
    { x: 8, y: -18, r: 4 },
    { x: 20, y: 19, r: 3 },
    { x: -44, y: 18, r: 3.5 },
    { x: -18, y: -20, r: 2.5 },
  ];
  const rocks: [number, number, number][] = [
    [-2, 22, 1.3],
    [-38, -18, 1.1],
    [40, 20, 1.4],
    [14, -22, 1],
  ];
  const consoleBase: Plan = { x: 41, y: -9, w: 9, d: 18, r: 1 };
  const baseTop = floorTop + 2.5;
  const bezelTop = baseTop + 22;
  const glassBottom = baseTop + 2.5;
  const glassFace = 48.3;
  const padLights = Array.from({ length: 6 }, function lightAt(_, index): [number, number] {
    const angle = (index / 6) * Math.PI * 2;
    return [PAD_X + Math.cos(angle) * 6.6, Math.sin(angle) * 6.6];
  });
  const screws = corners(moon, 6).map(function onMoon([x, y]): Point3 {
    return [x, y, floorTop];
  });
  const planetIcon = Array.from({ length: 24 }, function iconAt(_, index): Point3 {
    const angle = (index / 24) * Math.PI * 2;
    return [glassFace, -3.6 + Math.cos(angle) * 3, glassBottom + 10.4 + Math.sin(angle) * 3];
  });

  function pad(x: number, key: string) {
    return (
      <g key={key}>
        <Solid paths={cylinder(x, 0, 8.4, floorTop, 1.6, P, 40, 0.3)} tone="mid" />
        <Line d={ring(x, 0, 6, padTop, P, 32)} tone="faint" />
        <Line d={ring(x, 0, 3, padTop, P, 24)} tone="faint" />
        {[45, 135, 225, 315].map(function lug(degrees) {
          const angle = (degrees * Math.PI) / 180;
          return (
            <g key={degrees}>
              {slab(
                {
                  x: x + Math.cos(angle) * 7.4 - 0.9,
                  y: Math.sin(angle) * 7.4 - 0.9,
                  w: 1.8,
                  d: 1.8,
                  r: 0.3,
                },
                padTop,
                1.2,
                "lo",
              )}
            </g>
          );
        })}
      </g>
    );
  }

  function lander() {
    const baseZ = centerZ - 4;
    return (
      <>
        {[
          [-2.4, -2.4],
          [2.4, -2.4],
        ].map(function backLeg([x, y]) {
          return (
            <Solid
              key={`${x}${y}`}
              paths={cylinder(-PAD_X + x, y, 0.5, centerZ - 8, 4, P, 8)}
              tone="lo"
              crease="none"
            />
          );
        })}
        <Glow>
          <Solid
            paths={G.solidOf(
              [
                [0, 2.8],
                [1, 3.1, 1],
                [6, 3.1],
                [8, 2, 1],
                [9, 0.4],
              ],
              frameAt(-PAD_X, 0, baseZ),
              P,
            )}
            tone="hi"
          />
        </Glow>
        <Line d={ring(-PAD_X, 0, 3.1, baseZ + 3, P, 20)} tone="lo" />
        <Line d={ring(-PAD_X, 0, 3.1, baseZ + 5.4, P, 20)} tone="lo" />
        {[
          [-2.4, 2.4],
          [2.4, 2.4],
        ].map(function frontLeg([x, y]) {
          return (
            <Solid
              key={`${x}${y}`}
              paths={cylinder(-PAD_X + x, y, 0.5, centerZ - 8, 4, P, 8)}
              tone="lo"
              crease="none"
            />
          );
        })}
        <Solid paths={cylinder(-PAD_X, 0, 0.3, baseZ + 9, 3, P, 8)} tone="mid" crease="none" />
      </>
    );
  }

  return (
    <Bench
      hue="amber"
      id="hts-hop"
      label="A lander hops from one pad to another across a moon. Fourteen beacons light as it passes, and a ground screen switches on when it lands."
    >
      {slab(moon, FLOOR, 3, "lo")}
      <Line d={planOutline(insetPlan(moon, 3), floorTop, P)} tone="faint" />
      <Dots points={pointsAt(screws, P)} size={0.45} tone="mid" />
      {craters.map(function crater(item) {
        return (
          <g key={`${item.x}${item.y}`}>
            <Solid
              paths={cylinder(item.x, item.y, item.r, floorTop, 0.5, P, 24)}
              tone="lo"
              crease="none"
            />
            <Line d={ring(item.x, item.y, item.r * 0.55, floorTop + 0.5, P, 18)} tone="faint" />
          </g>
        );
      })}
      {rocks.map(function rock([x, y, r]) {
        return (
          <Solid key={`${x}${y}`} paths={G.sphereOf([x, y, floorTop + r * 0.6], r, P)} tone="lo" />
        );
      })}
      {pad(-PAD_X, "launch")}
      {pad(PAD_X, "landing")}
      {padLights.map(function offLight([x, y]) {
        return (
          <Solid key={`${x}${y}`} paths={G.sphereOf([x, y, padTop + 0.4], 0.8, P)} tone="lo" />
        );
      })}
      <Line
        d={pathOf(
          Array.from({ length: 49 }, function traceAt(_, index) {
            const t = index / 48;
            return iso([-PAD_X + 2 * PAD_X * t, 0, centerZ + APEX * 4 * t * (1 - t)], P);
          }),
        )}
        tone="faint"
        dotted
      />
      {lamps.map(function renderLamp(lamp) {
        return (
          <g key={lamp.index}>
            <Solid paths={cylinder(lamp.x, 0, 0.6, floorTop, 3, P, 10)} tone="mid" crease="none" />
            <Solid paths={G.sphereOf([lamp.x, 0, floorTop + 3.7], 0.95, P)} tone="lo" />
          </g>
        );
      })}
      <Solid paths={slabOf(consoleBase, floorTop, 2.5, P, 4, 0.4)} tone="lo" />
      <Solid
        paths={slabOf({ x: 42, y: -9, w: 5, d: 2, r: 0.4 }, baseTop, 6, P, 4, 0.3)}
        tone="lo"
      />
      <Solid paths={slabOf({ x: 42, y: 7, w: 5, d: 2, r: 0.4 }, baseTop, 6, P, 4, 0.3)} tone="lo" />
      <Solid
        paths={slabOf({ x: 45, y: -8, w: 2.5, d: 16, r: 1 }, baseTop, 22, P, 4, 0.5)}
        tone="mid"
      />
      <Dots
        points={pointsAt(
          [
            [47.5, -7, bezelTop - 1.2],
            [47.5, 7, bezelTop - 1.2],
            [47.5, -7, baseTop + 1.2],
            [47.5, 7, baseTop + 1.2],
          ],
          P,
        )}
        size={0.4}
        tone="mid"
      />
      <Solid
        paths={slabOf({ x: 47.5, y: -6.5, w: 0.8, d: 13, r: 0.4 }, glassBottom, 17, P, 4, 0.2)}
        tone="lo"
      />
      <g className="hts-sprint">
        {lamps.map(function renderLit(lamp) {
          const style = { "--at": lamp.reached } as React.CSSProperties;
          return (
            <g key={lamp.index} className="hts-cell" style={style}>
              <Glow>
                <Solid paths={G.sphereOf([lamp.x, 0, floorTop + 3.7], 0.95, P)} tone="hi" />
              </Glow>
            </g>
          );
        })}
        <g className="hts-screen">
          <Glow>
            <Solid
              paths={slabOf(
                { x: 47.5, y: -6.5, w: 0.8, d: 13, r: 0.4 },
                glassBottom,
                17,
                P,
                4,
                0.2,
              )}
              tone="hi"
            />
          </Glow>
          {padLights.map(function onLight([x, y]) {
            return (
              <Solid key={`${x}${y}`} paths={G.sphereOf([x, y, padTop + 0.4], 0.8, P)} tone="hi" />
            );
          })}
        </g>
        <Flyer home={[-PAD_X, 0, centerZ]} path={arc.d} className="hts-flyer">
          {lander()}
        </Flyer>
      </g>
      <Line d={faceBox("x", glassFace, -5, 5, glassBottom + 14, glassBottom + 16)} tone="lo" />
      <Line
        d={pathOf(
          planetIcon.map(function project(point) {
            return iso(point, P);
          }),
          true,
        )}
        tone="mid"
      />
      <Line d={faceBox("x", glassFace, -5, 5, glassBottom + 1.4, glassBottom + 4)} tone="mid" />
      <Line
        d={pathOf([
          iso([glassFace, 1, glassBottom + 11], P),
          iso([glassFace, 5, glassBottom + 11], P),
        ])}
        tone="lo"
        free
      />
      <Line
        d={pathOf([
          iso([glassFace, 1, glassBottom + 8.4], P),
          iso([glassFace, 4, glassBottom + 8.4], P),
        ])}
        tone="lo"
        free
      />
    </Bench>
  );
}
