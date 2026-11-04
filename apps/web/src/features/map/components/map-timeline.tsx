"use client";

import { Button } from "@hollou/ui/components/button";
import { Slider } from "@hollou/ui/components/slider";
import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function usePlayback({
  value,
  min,
  max,
  unitsPerSecond,
  onFrame,
  onStop,
}: {
  value: number;
  min: number;
  max: number;
  unitsPerSecond: number;
  onFrame: (value: number) => void;
  onStop: (value: number) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const startRef = useRef({ value: min, time: 0, stepped: false });
  const showFrame = useEffectEvent(onFrame);
  const finish = useEffectEvent(onStop);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    let frameId = 0;
    function tick(now: number) {
      const start = startRef.current;
      const next = start.value + ((now - start.time) / 1000) * unitsPerSecond;
      if (next >= max) {
        setIsPlaying(false);
        finish(max);
        return;
      }
      showFrame(start.stepped ? Math.floor(next) : next);
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isPlaying, max, unitsPerSecond]);

  function play() {
    const startValue = value >= max ? min : value;
    const stepped = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    startRef.current = { value: startValue, time: performance.now(), stepped };
    onFrame(startValue);
    setIsPlaying(true);
  }

  function pause() {
    if (!isPlaying) {
      return;
    }
    setIsPlaying(false);
    onStop(value);
  }

  return { isPlaying, play, pause };
}

function PlaybackIcon({ icon, isVisible }: { icon: typeof PlayIcon; isVisible: boolean }) {
  return (
    <HugeiconsIcon
      icon={icon}
      strokeWidth={2}
      className={cn(
        "absolute transition duration-300",
        isVisible ? "opacity-100" : "opacity-0 motion-safe:scale-25 motion-safe:blur-xs",
      )}
    />
  );
}

export function MapTimeline({
  isPlaying,
  onTogglePlay,
  playLabel,
  pauseLabel,
  sliderLabel,
  min,
  max,
  value,
  onValueChange,
  valueLabel,
  children,
}: {
  isPlaying: boolean;
  onTogglePlay: () => void;
  playLabel: string;
  pauseLabel: string;
  sliderLabel: string;
  min: number;
  max: number;
  value: number;
  onValueChange: (value: number) => void;
  valueLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-x-4 bottom-4 mx-auto flex max-w-lg flex-col gap-2 rounded-4xl border border-transparent glass p-3 shadow-md">
      <div className="flex items-center gap-3">
        <Button
          size="icon-sm"
          variant="neutral"
          aria-label={isPlaying ? pauseLabel : playLabel}
          onClick={onTogglePlay}
        >
          <PlaybackIcon icon={PlayIcon} isVisible={!isPlaying} />
          <PlaybackIcon icon={PauseIcon} isVisible={isPlaying} />
        </Button>
        <Slider
          aria-label={sliderLabel}
          className="flex-1"
          min={min}
          max={max}
          step={1}
          value={[value]}
          onValueChange={(next) => onValueChange(Array.isArray(next) ? next[0] : next)}
        />
        <span className="min-w-12 text-right type-title tabular-nums">{valueLabel}</span>
      </div>
      {children}
    </div>
  );
}
