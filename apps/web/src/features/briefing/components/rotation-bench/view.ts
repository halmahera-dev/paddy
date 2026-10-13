import { fitProjection, iso, screenRise, sideMatrix, type Flat, type Plan, type Point3 } from "@/components/iso/iso-kit";
import { GAUGE_MAX_MM, NITROGEN_LIMIT } from "./model";

export const WIDTH = 640;
export const HEIGHT = 400;
export const AZIMUTH = 57;

export const BASE: Plan = { x: -178, y: -74, w: 380, d: 144, r: 8 };
export const BASE_H = 8;
export const FOOT_H = 5;

export const TRAY_X = [-118, -20, 78];
export const TRAY_Y = -14;
export const TRAY_W = 84;
export const TRAY_D = 56;
export const WALL = 3.5;
export const TRAY_Z = 1.2;
export const SOIL_Z = 9;
export const RIM_Z = 16.2;

export const KNOB_Z = 8.7;
export const KNOB_DEPTH = 4;
export const KNOB_R = 4.6;
export const DETENT_R = 6.9;
export const FACE_Y = TRAY_Y + TRAY_D;

export const GAUGE_Y = -50;
export const GAUGE_Z = 10;
export const MM = 0.07;
export const TUBE_R = 5.6;
export const WATER_R = 4.4;
export const COLLAR_H = 3;
export const TUBE_TOP = GAUGE_Z + GAUGE_MAX_MM * MM;
export const CAP_H = 4;
export const RAIL_Z = TUBE_TOP + CAP_H;
export const RAIL_H = 6;
export const RAIL_D = 8;
export const POST_X = [-160, 118];
export const POST = 8;

export const DIAL: Flat = [158, 2];
export const DIAL_R = 19;
export const DIAL_Z = 9;
export const DIAL_H = 7;
export const DIAL_TOP = DIAL_Z + DIAL_H;
export const DIAL_SWEEP = (135 * Math.PI) / 180;

function cornersOf({ x, y, w, d }: Plan, z0: number, z1: number) {
  const out: Point3[] = [];
  for (const px of [x, x + w]) for (const py of [y, y + d]) for (const z of [z0, z1]) out.push([px, py, z]);
  return out;
}

export const P = fitProjection(
  [
    ...cornersOf(BASE, -BASE_H - FOOT_H, 0),
    ...cornersOf({ x: POST_X[0]! - 6, y: GAUGE_Y - 8, w: POST_X[1]! - POST_X[0]! + 20, d: 16, r: 0 }, 0, RAIL_Z + RAIL_H + 2),
  ],
  WIDTH,
  HEIGHT,
  { pad: 12, azimuth: AZIMUTH },
);

export function at(point: Point3) {
  return iso(point, P);
}

export const RISE = screenRise(1, P);

function fine(value: number) {
  return Math.round(value * 100) / 100;
}

export function collarShift(mm: number) {
  return `translate(0 ${fine(-RISE * mm * MM)})`;
}

export function waterTopZ(mm: number) {
  return GAUGE_Z + mm * MM;
}

export function knobMatrix(tray: number) {
  return sideMatrix([TRAY_X[tray]!, FACE_Y + KNOB_DEPTH], KNOB_Z, P, "left");
}

export function knobTransform(tray: number, degrees: number) {
  return `${knobMatrix(tray)} rotate(${fine(degrees)})`;
}

export function needleAngle(balance: number) {
  return (balance / NITROGEN_LIMIT) * DIAL_SWEEP;
}

export function needlePath(balance: number) {
  const angle = needleAngle(balance);
  const sx = Math.sin(angle);
  const sy = -Math.cos(angle);
  const z = DIAL_TOP + 0.8;
  const tip = at([DIAL[0] + sx * (DIAL_R - 3), DIAL[1] + sy * (DIAL_R - 3), z]);
  const tail = at([DIAL[0] - sx * 4.5, DIAL[1] - sy * 4.5, z]);
  return `M${fine(tail[0])} ${fine(tail[1])}L${fine(tip[0])} ${fine(tip[1])}`;
}

export function gaugePoint(tray: number, degrees: number, z: number, radius: number): Flat {
  const angle = ((AZIMUTH + degrees) * Math.PI) / 180;
  return at([TRAY_X[tray]! + radius * Math.cos(angle), GAUGE_Y + radius * Math.sin(angle), z]);
}

export const GAP_SIDE = -30;

export function gapPath(tray: number, rainMm: number, needMm: number) {
  const low = gaugePoint(tray, GAP_SIDE, waterTopZ(rainMm), TUBE_R);
  const high = gaugePoint(tray, GAP_SIDE, waterTopZ(needMm) - COLLAR_H / 2, TUBE_R);
  return { d: `M${fine(low[0])} ${fine(low[1])}L${fine(high[0])} ${fine(high[1])}`, low, high };
}
