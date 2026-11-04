"use client";

import { cn } from "@hollou/ui/lib/utils";
import * as React from "react";
import { useRef } from "react";

import { useRevealOnce } from "@/components/use-reveal-once";

export function BlurInHeading({ className, ...props }: React.ComponentProps<"h2">) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useRevealOnce(headingRef);

  return <h2 ref={headingRef} className={cn("blur-in-view", className)} {...props} />;
}
