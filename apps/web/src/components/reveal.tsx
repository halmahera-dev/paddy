"use client";

import { cn } from "@hollou/ui/lib/utils";
import * as React from "react";
import { useRef } from "react";

import { useRevealOnce } from "@/components/use-reveal-once";

export function Reveal({
  as: Tag = "div",
  delayMs = 0,
  className,
  style,
  ...props
}: {
  as?: "div" | "ul" | "ol" | "li" | "article" | "p";
  delayMs?: number;
} & React.HTMLAttributes<HTMLElement>) {
  const elementRef = useRef<HTMLElement>(null);
  useRevealOnce(elementRef);

  return (
    <Tag
      ref={elementRef as React.RefObject<never>}
      className={cn("rise-in-view", className)}
      style={{ "--reveal-delay": `${delayMs}ms`, ...style } as React.CSSProperties}
      {...props}
    />
  );
}
