"use client";

import { cn } from "@hollou/ui/lib/utils";
import * as React from "react";
import { useRef } from "react";

// The ring layer is a leaf node, so a pointer move only restyles that one element.
export function GlowBorder({
  className,
  isActive = false,
  children,
}: {
  className?: string;
  isActive?: boolean;
  children: React.ReactNode;
}) {
  const glowRef = useRef<HTMLSpanElement>(null);

  function followPointer(event: React.PointerEvent<HTMLDivElement>) {
    const glow = glowRef.current;
    if (!glow || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    glow.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
    glow.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <div className={cn("group/ring relative", className)} onPointerMove={followPointer}>
      {children}
      <span
        ref={glowRef}
        aria-hidden
        data-active={isActive}
        className="glow-ring absolute -inset-px opacity-0 transition-opacity group-hover/ring:opacity-100 data-[active=true]:opacity-100"
      />
    </div>
  );
}
