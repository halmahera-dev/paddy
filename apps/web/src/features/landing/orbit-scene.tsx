"use client";

import "@/components/iso/iso.css";
import { cn } from "@hollou/ui/lib/utils";
import * as React from "react";

import {
  follow,
  spring,
  type Spring,
  useInView,
  useLoop,
  useStillness,
} from "@/components/iso/react/live";

type Vec3 = [number, number, number];

interface Ring {
  radius: number;
  tiltX: number;
  tiltZ: number;
  secondsPerTurn: number;
  glyphs: number;
}

interface Glyph {
  ring: number;
  slot: number;
  character: string;
  heat: number;
  x: number;
  y: number;
  z: number;
  perspective: number;
}

interface Palette {
  glyph: string;
  brand: string;
  purple: string;
  line: string;
  indigo: string;
  coreBrand: string[];
  coreIndigo: string[];
  additive: boolean;
  font: string;
}

interface Scene {
  glyphs: Glyph[];
  clock: number;
  swapClock: number;
  burnLeft: number;
  burn: number;
  calm: boolean;
  pointer: { x: number; y: number; glow: number; inside: boolean };
  turn: { yaw: Spring; pitch: Spring };
  center: { x: number; y: number };
  scale: number;
  dpr: number;
  palette: Palette | null;
  atlas: Atlas | null;
}

interface Atlas {
  key: string;
  canvas: HTMLCanvasElement;
  cell: number;
}

type ScreenPoint = { x: number; y: number } | null;

const CHARACTERS = "#S08Xx+=-;:. @";
const RINGS: Ring[] = [
  { radius: 1.7, tiltX: 0.32, tiltZ: -0.28, secondsPerTurn: 60, glyphs: 56 },
  { radius: 2.25, tiltX: -0.22, tiltZ: 0.34, secondsPerTurn: -90, glyphs: 72 },
];
const WIREFRAME = buildWireframe();
const GLYPH_SIZE = 0.075;
const COLOR_FADE_SECONDS = 0.055;
const SWAP_SECONDS = 0.15;
const BURN_SECONDS = 1.2;
const BURN_RISE_SECONDS = 0.25;
const BURN_FALL_SECONDS = 0.8;
const BURN_SPEEDUP = 8;
const CORE_SECONDS_PER_TURN = 14;
// Offset and opacity pairs that make a radial gradient fall off like a blur.
const CORE_FALLOFF = [
  [0, 100],
  [0.3, 55],
  [0.65, 15],
  [1, 0],
] as const;
const CORE_INDIGO = "oklch(58.5% 0.233 277)";
const MAX_TURN = 0.35;
const HOVER_REACH = 90;
const HOVER_BLUR = 8;
// Same lightness as --brand, so the hover gradient reads as one light.
const HOVER_PURPLE = "oklch(64.5% 0.24 305)";
// motion's default spring, { bounce: 0, duration: 0.4 }, as stiffness and damping.
const TURN_STIFFNESS = ((2 * Math.PI) / 0.4) ** 2;
const TURN_DAMPING = 2 * Math.sqrt(TURN_STIFFNESS);
const CAMERA_DISTANCE = 7;
// Glyphs grow up to ~1.5x with perspective, so the atlas is drawn larger than the base size.
const ATLAS_OVERSAMPLE = 1.5;

export function OrbitScene({ className }: { className?: string }) {
  const wrapper = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const probe = React.useRef<HTMLSpanElement>(null);
  const moonButton = React.useRef<HTMLButtonElement>(null);
  const scene = React.useRef<Scene>({
    glyphs: [],
    clock: 0,
    swapClock: 0,
    burnLeft: 0,
    burn: 0,
    calm: false,
    pointer: { x: 0, y: 0, glow: 0, inside: false },
    turn: { yaw: { at: 0, rate: 0 }, pitch: { at: 0, rate: 0 } },
    center: { x: 0, y: 0 },
    scale: 1,
    dpr: 1,
    palette: null,
    atlas: null,
  });
  const inView = useInView(wrapper);
  const still = useStillness();

  const draw = React.useCallback(function draw() {
    const context = canvas.current?.getContext("2d");
    const current = scene.current;
    if (!context || !current.palette) return;
    drawScene(context, current, current.palette);
  }, []);

  const kick = useLoop(function tick(dt, calm) {
    const current = scene.current;
    current.calm = calm;
    current.burnLeft = Math.max(0, current.burnLeft - dt);
    const burning = current.burnLeft > 0;
    current.burn = follow(
      current.burn,
      burning ? 1 : 0,
      dt,
      burning ? BURN_RISE_SECONDS : BURN_FALL_SECONDS,
    );
    if (!calm) {
      const speed = 1 + current.burn * BURN_SPEEDUP;
      current.clock += dt * speed;
      swapCharacters(current, dt * speed);
    }
    current.pointer.glow = follow(
      current.pointer.glow,
      current.pointer.inside ? 1 : 0,
      dt,
      COLOR_FADE_SECONDS,
    );
    const turnSettled = turnMoon(current, dt, calm);
    draw();
    warmGlyphs(current, dt);

    const settling =
      current.burn > 0 ||
      current.pointer.glow > 0 ||
      current.pointer.inside ||
      !turnSettled ||
      current.glyphs.some((glyph) => glyph.heat > 0);
    return !calm || settling;
  }, inView && !still);

  React.useEffect(
    function watchLayoutAndTheme() {
      const wrapperNode = wrapper.current;
      const canvasNode = canvas.current;
      const probeNode = probe.current;
      if (!wrapperNode || !canvasNode || !probeNode) return;
      const current = scene.current;
      const wide = window.matchMedia("(min-width: 64rem)");

      function readTheme() {
        current.palette = readPalette(probeNode!, canvasNode!);
        draw();
      }

      function layout() {
        const width = wrapperNode!.clientWidth;
        const height = wrapperNode!.clientHeight;
        current.dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvasNode!.width = Math.round(width * current.dpr);
        canvasNode!.height = Math.round(height * current.dpr);

        const glyphShare = wide.matches ? 1 : 0.6;
        if (current.glyphs.length !== countGlyphs(glyphShare))
          current.glyphs = buildGlyphs(glyphShare);
        const extent = measureExtent();

        if (wide.matches) {
          const text = wrapperNode!.parentElement?.querySelector("[data-hero-text]");
          const textRight = text
            ? text.getBoundingClientRect().right - wrapperNode!.getBoundingClientRect().left
            : 0;
          current.center = { x: width * 0.7, y: height / 2 };
          current.scale = Math.min(
            (current.center.x - textRight - 32) / extent.x,
            (width - current.center.x - 16) / extent.x,
            (height / 2 - 24) / extent.y,
          );
        } else {
          current.center = { x: width / 2, y: height / 2 };
          // Stacked layouts zoom in, so the outer rings run off the screen edges.
          const zoom = 1.15;
          current.scale = Math.min((width / 2 / extent.x) * zoom, (height / 2 - 12) / extent.y);
        }

        current.scale = Math.max(0, current.scale);

        const button = moonButton.current;
        if (button) {
          button.style.left = `${current.center.x - current.scale}px`;
          button.style.top = `${current.center.y - current.scale}px`;
          button.style.width = `${current.scale * 2}px`;
          button.style.height = `${current.scale * 2}px`;
        }
        draw();
      }

      readTheme();
      layout();
      canvasNode.dataset.ready = "";
      const resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(wrapperNode);
      const themeObserver = new MutationObserver(readTheme);
      themeObserver.observe(document.documentElement, { attributeFilter: ["class"] });
      wide.addEventListener("change", layout);
      return function stopWatching() {
        resizeObserver.disconnect();
        themeObserver.disconnect();
        wide.removeEventListener("change", layout);
      };
    },
    [draw],
  );

  function handlePointer(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointer = scene.current.pointer;
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.inside = event.type !== "pointerleave";
    kick();
  }

  function burnCore() {
    scene.current.burnLeft = BURN_SECONDS;
    kick();
    glitchHeadline();
  }

  function glitchHeadline() {
    const text = wrapper.current?.parentElement?.querySelector<HTMLElement>("[data-hero-text]");
    if (!text || still) return;
    // Remove and reflow first, so a second click restarts the burst.
    delete text.dataset.glitch;
    void text.offsetWidth;
    text.dataset.glitch = "";
    text.addEventListener("animationend", function stopGlitch(event) {
      if (event.animationName !== "glitch-burst") return;
      delete text.dataset.glitch;
      text.removeEventListener("animationend", stopGlitch);
    });
  }

  return (
    <div
      ref={wrapper}
      className={cn("iso", className)}
      onPointerMove={handlePointer}
      onPointerLeave={handlePointer}
    >
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="absolute inset-0 size-full font-mono fade-in-ready"
      />
      <span ref={probe} aria-hidden="true" className="hidden" />
      <button
        ref={moonButton}
        type="button"
        aria-label="Burn the core"
        onClick={burnCore}
        className="absolute pressable cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

function measureExtent() {
  let x = 1;
  let y = 1;
  for (const ring of RINGS) {
    for (let step = 0; step < 90; step++) {
      const angle = (step / 90) * Math.PI * 2;
      const flat: Vec3 = [ring.radius * Math.cos(angle), 0, ring.radius * Math.sin(angle)];
      const point = rotateZ(rotateX(flat, ring.tiltX), ring.tiltZ);
      const perspective = CAMERA_DISTANCE / (CAMERA_DISTANCE - point[2]);
      x = Math.max(x, Math.abs(point[0]) * perspective + 0.1);
      y = Math.max(y, Math.abs(point[1]) * perspective + 0.1);
    }
  }
  return { x, y };
}

function countGlyphs(share: number) {
  return RINGS.reduce((total, ring) => total + Math.round(ring.glyphs * share), 0);
}

function buildGlyphs(share: number) {
  const glyphs: Glyph[] = [];
  RINGS.forEach(function addRing(ring, ringIndex) {
    const slots = Math.round(ring.glyphs * share);
    for (let slot = 0; slot < slots; slot++) {
      glyphs.push({
        ring: ringIndex,
        slot: slot / slots,
        character: randomCharacter(),
        heat: 0,
        x: 0,
        y: 0,
        z: 0,
        perspective: 1,
      });
    }
  });
  return glyphs;
}

function buildWireframe() {
  const steps = 48;

  function curve(pointAt: (t: number) => Vec3) {
    return Array.from({ length: steps + 1 }, function curvePoint(_, step) {
      return rotateZ(rotateX(pointAt(step / steps), -0.35), 0.3);
    });
  }

  const curves: Vec3[][] = [];
  for (let latitude = -60; latitude <= 60; latitude += 30) {
    const angle = (latitude * Math.PI) / 180;
    curves.push(
      curve((t) => [
        Math.cos(angle) * Math.cos(t * Math.PI * 2),
        Math.sin(angle),
        Math.cos(angle) * Math.sin(t * Math.PI * 2),
      ]),
    );
  }
  for (let longitude = 0; longitude < 180; longitude += 30) {
    const angle = (longitude * Math.PI) / 180;
    curves.push(
      curve((t) => {
        const around = t * Math.PI * 2;
        return [
          Math.cos(around) * Math.cos(angle),
          Math.sin(around),
          Math.cos(around) * Math.sin(angle),
        ];
      }),
    );
  }
  return curves;
}

function turnMoon(current: Scene, dt: number, calm: boolean) {
  const { pointer, center, scale, turn } = current;
  const following = pointer.inside && !calm;
  const reach = scale * 3;
  const yawTarget = following ? clampSigned((pointer.x - center.x) / reach) * MAX_TURN : 0;
  const pitchTarget = following ? clampSigned((pointer.y - center.y) / reach) * MAX_TURN : 0;
  const yawSettled = spring(turn.yaw, yawTarget, dt, TURN_STIFFNESS, TURN_DAMPING);
  const pitchSettled = spring(turn.pitch, pitchTarget, dt, TURN_STIFFNESS, TURN_DAMPING);
  return yawSettled && pitchSettled;
}

function onMoon(current: Scene, point: Vec3): Vec3 {
  return rotateX(rotateY(point, current.turn.yaw.at), current.turn.pitch.at);
}

function swapCharacters(current: Scene, dt: number) {
  current.swapClock += dt;
  while (current.swapClock >= SWAP_SECONDS) {
    current.swapClock -= SWAP_SECONDS;
    const glyph = current.glyphs[Math.floor(Math.random() * current.glyphs.length)];
    if (glyph) glyph.character = randomCharacter();
  }
}

function placeGlyphs(current: Scene) {
  for (const glyph of current.glyphs) {
    const ring = RINGS[glyph.ring]!;
    const angle = (glyph.slot + current.clock / ring.secondsPerTurn) * Math.PI * 2;
    const flat: Vec3 = [ring.radius * Math.cos(angle), 0, ring.radius * Math.sin(angle)];
    const point = rotateZ(rotateX(flat, ring.tiltX), ring.tiltZ);
    const screen = project(current, point);
    glyph.x = screen.x;
    glyph.y = screen.y;
    glyph.z = point[2];
    glyph.perspective = screen.perspective;
  }
}

function warmGlyphs(current: Scene, dt: number) {
  const { pointer } = current;
  for (const glyph of current.glyphs) {
    const distance = Math.hypot(glyph.x - pointer.x, glyph.y - pointer.y);
    const target = pointer.inside ? Math.max(0, 1 - distance / HOVER_REACH) : 0;
    if (glyph.heat === 0 && target === 0) continue;
    glyph.heat = follow(glyph.heat, target, dt, COLOR_FADE_SECONDS);
  }
}

function project(current: Scene, point: Vec3) {
  const perspective = CAMERA_DISTANCE / (CAMERA_DISTANCE - point[2]);
  return {
    x: current.center.x + point[0] * current.scale * perspective,
    y: current.center.y - point[1] * current.scale * perspective,
    perspective,
  };
}

function drawScene(context: CanvasRenderingContext2D, current: Scene, palette: Palette) {
  const { dpr } = current;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.textAlign = "center";
  context.textBaseline = "middle";

  placeGlyphs(current);
  const hovering = current.pointer.glow > 0 || current.glyphs.some((glyph) => glyph.heat > 0);
  const hover = hovering ? hoverPaint(context, current, palette) : null;

  drawGlyphs(context, current, palette, hover, "back");
  drawMoon(context, current, palette, hover);
  drawGlyphs(context, current, palette, hover, "front");
}

function drawGlyphs(
  context: CanvasRenderingContext2D,
  current: Scene,
  palette: Palette,
  hover: CanvasGradient | null,
  side: "front" | "back",
) {
  const { dpr, glyphs } = current;
  const baseSize = GLYPH_SIZE * current.scale;

  const atlas = glyphAtlas(current, palette);
  const cellSize = atlas.cell / (dpr * ATLAS_OVERSAMPLE);
  for (const glyph of glyphs) {
    if ((glyph.z >= 0 ? "front" : "back") !== side) continue;
    const size = cellSize * glyph.perspective;
    context.globalAlpha = glyphAlpha(glyph) * (1 - glyph.heat);
    context.drawImage(
      atlas.canvas,
      CHARACTERS.indexOf(glyph.character) * atlas.cell,
      0,
      atlas.cell,
      atlas.cell,
      glyph.x - size / 2,
      glyph.y - size / 2,
      size,
      size,
    );
  }

  if (hover) {
    context.fillStyle = hover;
    for (const glyph of glyphs) {
      if (glyph.heat === 0 || (glyph.z >= 0 ? "front" : "back") !== side) continue;
      context.font = `${(baseSize * glyph.perspective).toFixed(1)}px ${palette.font}`;
      context.globalAlpha = glyphAlpha(glyph) * glyph.heat;
      context.shadowColor = hoverShadow(current, palette, glyph.x, glyph.y);
      context.shadowBlur = HOVER_BLUR * glyph.heat;
      context.fillText(glyph.character, glyph.x, glyph.y);
    }
    context.shadowBlur = 0;
  }
  context.globalAlpha = 1;
}

// Firefox re-rasterizes text for every fillText at a new scale, so glyphs are drawn once and blitted.
function glyphAtlas(current: Scene, palette: Palette) {
  const fontSize = GLYPH_SIZE * current.scale * current.dpr * ATLAS_OVERSAMPLE;
  const key = `${fontSize.toFixed(1)}|${palette.glyph}|${palette.font}`;
  if (current.atlas?.key === key) return current.atlas;

  const cell = Math.ceil(fontSize * 1.4);
  const canvas = document.createElement("canvas");
  canvas.width = cell * CHARACTERS.length;
  canvas.height = cell;
  const context = canvas.getContext("2d")!;
  context.font = `${fontSize.toFixed(1)}px ${palette.font}`;
  context.fillStyle = palette.glyph;
  context.textAlign = "center";
  context.textBaseline = "middle";
  Array.from(CHARACTERS).forEach(function drawCharacter(character, index) {
    context.fillText(character, index * cell + cell / 2, cell / 2);
  });
  current.atlas = { key, canvas, cell };
  return current.atlas;
}

function glyphAlpha(glyph: Glyph) {
  return 0.3 + 0.65 * clamp((glyph.z + 2) / 4);
}

function drawMoon(
  context: CanvasRenderingContext2D,
  current: Scene,
  palette: Palette,
  hover: CanvasGradient | null,
) {
  const { center, scale, pointer } = current;
  const nearMoon = Math.hypot(pointer.x - center.x, pointer.y - center.y) < scale + HOVER_REACH;
  const moonHover = nearMoon ? hover : null;
  const curves = WIREFRAME.map(function projectCurve(curve) {
    return curve.map(function projectPoint(point) {
      const turned = onMoon(current, point);
      return { ...project(current, turned), front: turned[2] >= 0 };
    });
  });

  function strokeSide(front: boolean, alpha: number) {
    for (const curve of curves) {
      const points = curve.map((point) => (point.front === front ? point : null));
      strokeLine(context, current, palette, moonHover, points, alpha);
    }
  }

  context.lineWidth = 0.8;
  strokeSide(false, 0.2);
  drawCore(context, current, palette);
  strokeSide(true, 0.7);
  const outline = Array.from({ length: 97 }, function outlinePoint(_, step) {
    const angle = (step / 96) * Math.PI * 2;
    return { x: center.x + Math.cos(angle) * scale, y: center.y + Math.sin(angle) * scale };
  });
  strokeLine(context, current, palette, moonHover, outline, 0.7);
  context.globalAlpha = 1;
}

function drawCore(context: CanvasRenderingContext2D, current: Scene, palette: Palette) {
  const { center, scale, burn, clock, calm } = current;
  const breath = calm ? 0 : Math.sin(clock * 1.3) * 0.015;
  const swell = calm ? 0 : burn * 0.1;
  const radius = scale * (0.3 + breath + swell);
  const angle = (clock / CORE_SECONDS_PER_TURN) * Math.PI * 2;
  const towardBrand = { x: -Math.cos(angle) * radius, y: -Math.sin(angle) * radius };

  context.save();
  context.globalCompositeOperation = palette.additive ? "lighter" : "source-over";
  context.globalAlpha = Math.min(1, (palette.additive ? 0.4 : 0.3) + burn * 0.5);
  const haloRadius = radius * 2.4;
  [palette.coreBrand, palette.coreIndigo].forEach(function drawHalo(stops, index) {
    const side = index === 0 ? 0.5 : -0.5;
    const x = center.x + towardBrand.x * side;
    const y = center.y + towardBrand.y * side;
    const halo = context.createRadialGradient(x, y, 0, x, y, haloRadius);
    CORE_FALLOFF.forEach(function addStop([offset], stopIndex) {
      halo.addColorStop(offset, stops[stopIndex]!);
    });
    context.fillStyle = halo;
    context.fillRect(x - haloRadius, y - haloRadius, haloRadius * 2, haloRadius * 2);
  });

  context.globalCompositeOperation = "source-over";
  context.globalAlpha = 1;
  const surface = context.createLinearGradient(
    center.x + towardBrand.x,
    center.y + towardBrand.y,
    center.x - towardBrand.x,
    center.y - towardBrand.y,
  );
  surface.addColorStop(0, palette.brand);
  surface.addColorStop(1, palette.indigo);
  context.fillStyle = surface;
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, Math.PI * 2);
  context.fill();

  const shade = context.createRadialGradient(
    center.x - radius * 0.35,
    center.y - radius * 0.4,
    0,
    center.x,
    center.y,
    radius,
  );
  shade.addColorStop(0, `rgba(255, 255, 255, ${0.35 + burn * 0.25})`);
  shade.addColorStop(0.55, "rgba(255, 255, 255, 0)");
  shade.addColorStop(1, "rgba(0, 0, 0, 0.25)");
  context.fillStyle = shade;
  context.fill();
  context.restore();
}

function hoverPaint(context: CanvasRenderingContext2D, current: Scene, palette: Palette) {
  const { pointer } = current;
  const paint = context.createLinearGradient(
    pointer.x - HOVER_REACH,
    pointer.y - HOVER_REACH,
    pointer.x + HOVER_REACH,
    pointer.y + HOVER_REACH,
  );
  paint.addColorStop(0, palette.brand);
  paint.addColorStop(1, palette.purple);
  return paint;
}

function hoverShadow(current: Scene, palette: Palette, x: number, y: number) {
  const { pointer } = current;
  const along = (x - pointer.x + (y - pointer.y)) / (4 * HOVER_REACH) + 0.5;
  return along < 0.5 ? palette.brand : palette.purple;
}

function strokeLine(
  context: CanvasRenderingContext2D,
  current: Scene,
  palette: Palette,
  hover: CanvasGradient | null,
  points: ScreenPoint[],
  alpha: number,
) {
  context.globalAlpha = alpha;
  context.strokeStyle = palette.line;
  context.beginPath();
  points.forEach(function addPoint(point, index) {
    if (!point) return;
    if (points[index - 1]) context.lineTo(point.x, point.y);
    else context.moveTo(point.x, point.y);
  });
  context.stroke();

  const { pointer } = current;
  if (!hover || pointer.glow <= 0) return;
  context.save();
  context.strokeStyle = hover;
  context.shadowBlur = HOVER_BLUR;
  points.forEach(function glowSegment(point, index) {
    const previous = points[index - 1];
    if (!point || !previous) return;
    const middle = { x: (point.x + previous.x) / 2, y: (point.y + previous.y) / 2 };
    const distance = Math.hypot(middle.x - pointer.x, middle.y - pointer.y);
    const heat = pointer.glow * (1 - distance / HOVER_REACH);
    if (heat <= 0) return;
    context.shadowColor = hoverShadow(current, palette, middle.x, middle.y);
    context.globalAlpha = Math.min(1, alpha + 0.3) * heat;
    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(point.x, point.y);
    context.stroke();
  });
  context.restore();
}

function readPalette(probe: HTMLElement, canvas: HTMLCanvasElement): Palette {
  function color(value: string) {
    probe.style.color = value;
    return getComputedStyle(probe).color;
  }
  function falloff(value: string) {
    return CORE_FALLOFF.map(function stopColor([, opacity]) {
      return color(`color-mix(in oklab, ${value} ${opacity}%, transparent)`);
    });
  }
  return {
    glyph: color("var(--muted-foreground)"),
    brand: color("var(--brand)"),
    purple: HOVER_PURPLE,
    line: color("var(--anatomy-lo)"),
    indigo: color(CORE_INDIGO),
    coreBrand: falloff("var(--brand)"),
    coreIndigo: falloff(CORE_INDIGO),
    additive: document.documentElement.classList.contains("dark"),
    font: getComputedStyle(canvas).fontFamily,
  };
}

function randomCharacter() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]!;
}

function clampSigned(value: number) {
  return Math.min(Math.max(value, -1), 1);
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function rotateX(point: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [point[0], point[1] * cos - point[2] * sin, point[1] * sin + point[2] * cos];
}

function rotateY(point: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [point[0] * cos + point[2] * sin, point[1], -point[0] * sin + point[2] * cos];
}

function rotateZ(point: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [point[0] * cos - point[1] * sin, point[0] * sin + point[1] * cos, point[2]];
}
