import { cn } from "@hollou/ui/lib/utils";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/features/landing/components/section-heading";
import {
  CivicBuildingFigure,
  OfficeBlockFigure,
  RocketPadFigure,
} from "@/features/landing/figures/who-we-work-with-figures";
import type { Dictionary } from "@/lib/i18n";

const figures = [OfficeBlockFigure, CivicBuildingFigure, RocketPadFigure] as const;

export function WhoWeWorkWith({ t }: { t: Dictionary["landing"] }) {
  return (
    <section id="who-we-work-with" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading title={t.whoWeWorkWith.title}>{t.whoWeWorkWith.lead}</SectionHeading>
        <ul className="mt-16 grid gap-16 lg:mt-20 lg:gap-24">
          {t.whoWeWorkWith.buyers.map(function renderBuyer(buyer, index) {
            const textFirst = index % 2 === 1;
            const Figure = figures[index] ?? OfficeBlockFigure;
            return (
              <Reveal
                as="li"
                key={buyer.name}
                className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-20"
              >
                <div className={cn("min-w-0", textFirst && "lg:order-2")}>
                  <Figure />
                </div>
                <div className="max-w-lg">
                  <p className="text-base font-medium text-muted-foreground">{buyer.name}</p>
                  <p className="mt-3 text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl">
                    {buyer.line}
                  </p>
                  <p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">
                    {buyer.problem}{" "}
                    <strong className="font-semibold text-foreground">{buyer.lead}</strong>{" "}
                    {buyer.solution} {buyer.result}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
