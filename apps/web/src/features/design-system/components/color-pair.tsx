"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// Resolves any CSS color to sRGB by painting one pixel over the backdrop.
function toRgb(color: string, backdrop = "#fff") {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }
  context.fillStyle = backdrop;
  context.fillRect(0, 0, 1, 1);
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
  return [red, green, blue];
}

function toHex(rgb: number[]) {
  return `#${rgb.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function luminance(rgb: number[]) {
  const [red, green, blue] = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: number[], second: number[]) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

function wcagLevel(ratio: number) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

export function ColorPair({
  name,
  background,
  foreground,
  className,
}: {
  name: string;
  background: string;
  foreground: string;
  className?: string;
}) {
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const [measurement, setMeasurement] = React.useState<{ ratio: number; hex: string } | null>(
    null,
  );

  React.useEffect(() => {
    const element = surfaceRef.current;
    if (!element) {
      return;
    }
    function measure() {
      if (!element) {
        return;
      }
      const style = getComputedStyle(element);
      const pageColor = getComputedStyle(document.body).backgroundColor;
      const surface = toRgb(style.backgroundColor, pageColor);
      if (!surface) {
        return;
      }
      const text = toRgb(style.color, toHex(surface));
      if (text) {
        setMeasurement({ ratio: contrastRatio(surface, text), hex: toHex(surface) });
      }
    }
    measure();
    // Re-measure when the theme class on <html> changes.
    const observer = new MutationObserver(measure);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border", className)}>
      <div
        ref={surfaceRef}
        style={{ backgroundColor: `var(--${background})`, color: `var(--${foreground})` }}
        className="flex h-24 items-end justify-between p-4"
      >
        <span className="font-heading text-2xl font-semibold">Aa</span>
        {measurement && (
          <span className="rounded-full border border-current/20 px-2 py-0.5 font-mono text-xs">
            {measurement.ratio.toFixed(2)} {wcagLevel(measurement.ratio)}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 bg-background p-3">
        <span className="text-sm font-medium">{name}</span>
        <span className="font-mono text-xs text-muted-foreground">
          --{background} / --{foreground}
        </span>
        {measurement && (
          <span className="font-mono text-xs text-muted-foreground">{measurement.hex}</span>
        )}
      </div>
    </div>
  );
}
