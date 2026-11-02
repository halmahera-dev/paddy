import { SectionHeading } from "@/features/landing/components/section-heading";
import {
  AbacusFigure,
  ConveyorFigure,
  DealBoardFigure,
  DocumentTrayFigure,
  SensorMastFigure,
  ServiceBellFigure,
} from "@/features/landing/figures/what-we-build-figures";
import { GlowBorder } from "@/features/landing/glow-border";
import { WhatWeBuildScroller } from "@/features/landing/what-we-build-scroller";
import type { Dictionary } from "@/lib/i18n";

const figures = [
  SensorMastFigure,
  DealBoardFigure,
  ConveyorFigure,
  ServiceBellFigure,
  DocumentTrayFigure,
  AbacusFigure,
] as const;

export function WhatWeBuild({ t }: { t: Dictionary["landing"] }) {
  return (
    <section id="what-we-build" className="scroll-mt-24 py-20 sm:py-28">
      <WhatWeBuildScroller
        heading={
          <SectionHeading title={t.whatWeBuild.title}>{t.whatWeBuild.lead}</SectionHeading>
        }
      >
        {t.whatWeBuild.cards.map(function renderCard(item, index) {
          const Figure = figures[index] ?? SensorMastFigure;
          return (
            <li
              key={item.name}
              className="flex min-w-0 shrink-0 grow-0 card-row-item snap-start list-disc"
            >
              <GlowBorder className="flex w-full flex-col gap-4 rounded-4xl bg-card p-6 shadow-card">
                <Figure />
                <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
                <p className="text-2xl leading-tight font-medium tracking-tight text-balance">
                  {item.line}
                </p>
                <ul className="mt-auto grid gap-2 pt-4 text-muted-foreground">
                  {item.bullets.map(function renderBullet(bullet) {
                    return <li key={bullet}>{bullet}</li>;
                  })}
                </ul>
              </GlowBorder>
            </li>
          );
        })}
      </WhatWeBuildScroller>
    </section>
  );
}
