import {
  corners,
  cylinder,
  iso,
  pathOf,
  pointsAt,
  ring,
  rise,
  segment,
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
  frameAt,
  pathThrough,
  slab,
} from "@/features/landing/figures/bench";

const PLANET = { z: 40, r: 13 };
const ORBIT_R = 26;
const DEGREES = Math.PI / 180;

function orbitPoint(degrees: number, z: number = PLANET.z): Point3 {
  return [Math.cos(degrees * DEGREES) * ORBIT_R, Math.sin(degrees * DEGREES) * ORBIT_R, z];
}

function orbitArc(from: number, to: number, count: number) {
  return Array.from({ length: count + 1 }, (_, index) => {
    return orbitPoint(from + ((to - from) * index) / count);
  });
}

function arcPath(points: Point3[]) {
  return pathOf(
    points.map((point) => {
      return iso(point, P);
    }),
  );
}

export function OrreryFigure() {
  const floorTop = FLOOR + 3;
  const frame = frameAt(0, 0, PLANET.z);
  const entry = orbitPoint(-45);
  const start: Point3 = [entry[0] - 15.5, entry[1] - 15.5, PLANET.z + 12];
  const approach = Array.from({ length: 13 }, (_, index): Point3 => {
    const t = index / 12;
    return [
      start[0] + (entry[0] - start[0]) * t,
      start[1] + (entry[1] - start[1]) * t,
      start[2] + (entry[2] - start[2]) * t,
    ];
  });
  const flight = pathThrough([...approach, ...orbitArc(-45, 675, 96).slice(1)]);
  const approachEnd = flight.fractions[12] * 100;
  const flightStyle = { "--approach": `${approachEnd}%` } as React.CSSProperties;
  const latitudes = [-7.5, -3, 4.5, 9];
  const lights = [0, 22, 46, 70, 94, 116].map((degrees): Point3 => {
    return [
      Math.cos(degrees * DEGREES) * (PLANET.r + 0.1),
      Math.sin(degrees * DEGREES) * (PLANET.r + 0.1),
      PLANET.z,
    ];
  });
  const screws = Array.from({ length: 8 }, (_, index): Point3 => {
    const angle = (index / 8) * Math.PI * 2 + Math.PI / 8;
    return [Math.cos(angle) * 35.5, Math.sin(angle) * 35.5, floorTop];
  });
  const ticks = Array.from({ length: 36 }, (_, index) => {
    const angle = (index / 36) * Math.PI * 2;
    const major = index % 3 === 0;
    const inner = major ? 27.5 : 29;
    return (
      <Line
        key={index}
        d={segment(
          [Math.cos(angle) * inner, Math.sin(angle) * inner, floorTop + 2],
          [Math.cos(angle) * 31, Math.sin(angle) * 31, floorTop + 2],
          P,
        )}
        tone={major ? "mid" : "lo"}
      />
    );
  });
  const latitudeLines = (
    <>
      {latitudes.map((height) => {
        const radius = Math.sqrt(PLANET.r ** 2 - height ** 2);
        return (
          <Line
            key={height}
            d={G.arcOf(frame, height, radius, P, { slope: -height / radius })}
            tone={height === -3 ? "mid" : "faint"}
          />
        );
      })}
    </>
  );

  function craft() {
    const base = PLANET.z - 5;
    return (
      <>
        <Solid paths={cylinder(0, 0, 1.3, base - 1.2, 1.4, P, 12, 0.2)} tone="lo" />
        {[-1, 1].map((side) => {
          const plan = { x: -0.4, y: side > 0 ? 2.6 : -8.6, w: 0.8, d: 6, r: 0.15 };
          return (
            <g key={side}>
              {slab(plan, PLANET.z - 2, 4)}
              <Line d={rise([0.4, plan.y + 2], PLANET.z - 2, PLANET.z + 2, P)} tone="faint" />
              <Line d={rise([0.4, plan.y + 4], PLANET.z - 2, PLANET.z + 2, P)} tone="faint" />
            </g>
          );
        })}
        <Glow>
          <Solid
            paths={G.solidOf(
              [
                [0, 2.2],
                [1, 2.6, 1],
                [7, 2.6],
                [9, 1.7, 1],
                [10.4, 0.3],
              ],
              frameAt(0, 0, base),
              P,
            )}
            tone="hi"
          />
        </Glow>
        <Line d={ring(0, 0, 2.6, base + 4, P, 16)} tone="lo" />
        <Solid paths={cylinder(0, 0, 0.3, base + 10.4, 3, P, 8)} tone="mid" crease="none" />
      </>
    );
  }

  return (
    <Bench
      hue="violet"
      id="hts-orrery"
      label="A planet on a stand. A small glowing craft flies in from outside and joins the planet's orbit, and the planet lights up."
    >
      <Solid paths={cylinder(0, 0, 38, FLOOR, 3, P, 64, 0.5)} tone="lo" />
      <Solid paths={cylinder(0, 0, 33, floorTop, 2, P, 64, 0.4)} tone="mid" />
      <Line d={ring(0, 0, 31.5, floorTop + 2, P, 64)} tone="faint" />
      {ticks}
      <Line d={ring(0, 0, 26, floorTop + 2, P, 64)} tone="faint" />
      <Dots points={pointsAt(screws, P)} size={0.5} tone="mid" />
      <Solid paths={cylinder(0, 0, 10, floorTop + 2, 4, P, 36, 0.4)} tone="mid" />
      <Line d={ring(0, 0, 7, floorTop + 6, P, 28)} tone="lo" />
      <Dots
        points={pointsAt(
          corners({ x: -8, y: -8, w: 16, d: 16, r: 0 }, 0).map(([x, y]): Point3 => {
            return [x * 0.75, y * 0.75, floorTop + 6];
          }),
          P,
        )}
        size={0.4}
        tone="mid"
      />
      <Solid paths={cylinder(0, 0, 4.4, floorTop + 6, 2, P, 24, 0.3)} tone="lo" />
      <Solid
        paths={cylinder(0, 0, 2.8, floorTop + 8, PLANET.z - floorTop - 5, P, 16)}
        tone="mid"
        crease="none"
      />
      <Line d={arcPath(orbitArc(135, 315, 48))} tone="hi" dotted />
      <Flyer home={[0, 0, PLANET.z]} path={flight.d} className="hts-behind" style={flightStyle}>
        {craft()}
      </Flyer>
      <Solid paths={G.sphereOf([0, 0, PLANET.z], PLANET.r, P)} tone="mid" inner={latitudeLines} />
      <Dots points={pointsAt(lights, P)} size={0.5} tone="hi" />
      <g className="hts-planet-lit">
        <Glow>
          <Solid paths={G.sphereOf([0, 0, PLANET.z], PLANET.r, P)} tone="hi" />
        </Glow>
      </g>
      <Line d={arcPath(orbitArc(-45, 135, 48))} tone="hi" dotted />
      <Line d={arcPath(approach)} tone="faint" dotted />
      <Flyer home={[0, 0, PLANET.z]} path={flight.d} className="hts-front" style={flightStyle}>
        {craft()}
      </Flyer>
    </Bench>
  );
}
