"use client";

import { Button } from "@hollou/ui/components/button";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import type { PublicBowl } from "@/features/bowls/bowls-queries";
import { dropMeters, predictionFor } from "@/features/map/components/bowl-layer";
import { fill } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function MapBowlList({
  bowls,
  selectedBowlId,
  years,
  withBan,
  baselineYears,
  onSelect,
  title,
  rankTemplate,
  showLabel,
  hideLabel,
}: {
  bowls: PublicBowl[];
  selectedBowlId: string | null;
  years: number;
  withBan: boolean;
  baselineYears: number;
  onSelect: (bowlId: string) => void;
  title: string;
  rankTemplate: string;
  showLabel: string;
  hideLabel: string;
}) {
  const hasDetail = selectedBowlId !== null;
  const [choice, setChoice] = useState<{ hasDetail: boolean; isOpen: boolean } | null>(null);
  const isOpen = choice !== null && choice.hasDetail === hasDetail ? choice.isOpen : !hasDetail;

  return (
    <nav
      aria-label={title}
      className="fade-in absolute top-4 right-4 hidden max-h-112 w-64 flex-col gap-1 overflow-y-auto glass rounded-3xl border border-transparent p-2 shadow-md md:flex"
    >
      <div className="flex items-center justify-between gap-2 pl-3">
        <h2 className="text-sm font-medium">{title}</h2>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-expanded={isOpen}
          aria-label={isOpen ? hideLabel : showLabel}
          onClick={() => setChoice({ hasDetail, isOpen: !isOpen })}
        >
          <HugeiconsIcon icon={isOpen ? ArrowUp01Icon : ArrowDown01Icon} strokeWidth={2} />
        </Button>
      </div>
      {isOpen && (
        <ol className="flex flex-col">
          {bowls
            .toSorted((a, b) => a.rank - b.rank)
            .map((bowl) => {
              const isSelected = bowl.id === selectedBowlId;
              const prediction = predictionFor(bowl.id, selectedBowlId, { years, withBan }, baselineYears);
              return (
                <li key={bowl.id}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${bowl.name}, ${fill(rankTemplate, { rank: bowl.rank })}`}
                    className={cn(
                      "pressable flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40",
                      isSelected && "bg-brand/12 text-brand-text hover:bg-brand/12",
                    )}
                    onClick={() => onSelect(bowl.id)}
                  >
                    <span className="w-5 text-muted-foreground tabular-nums">{bowl.rank}</span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{bowl.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{bowl.kecamatan}</span>
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      −{dropMeters(bowl, prediction.years, prediction.withBan).toFixed(2)} m
                    </span>
                  </button>
                </li>
              );
            })}
        </ol>
      )}
    </nav>
  );
}
