import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/features/landing/components/section-heading";
import { SinkingFigure } from "@/features/landing/components/sinking-figure";
import type { Dictionary } from "@/lib/i18n";

export function Problem({ t }: { t: Dictionary["landing"] }) {
  return (
    <section id="problem" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading title={t.problem.title} isSplit>
          {t.problem.lead}
        </SectionHeading>

        <Reveal className="mt-12">
          <SinkingFigure t={t.problem.figure} />
        </Reveal>

        <Reveal as="ol" className="mt-8 grid gap-8 md:grid-cols-3 md:gap-12">
          {t.problem.facts.map(function renderFact(fact, index) {
            return (
              <li key={fact.name} className="grid content-start gap-2">
                <p className="type-label-mono text-muted-foreground">
                  {String(index + 1).padStart(2, "0")} · {fact.label}
                </p>
                <p className="type-title">{fact.name}</p>
                <p className="text-muted-foreground">{fact.body}</p>
              </li>
            );
          })}
        </Reveal>

        <p className="mt-16 max-w-2xl type-lead">{t.problem.handoff}</p>
      </div>
    </section>
  );
}
