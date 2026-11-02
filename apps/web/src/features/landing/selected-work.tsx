import { Button } from "@hollou/ui/components/button";
import { cn } from "@hollou/ui/lib/utils";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/features/landing/components/section-heading";
import type { Dictionary, Locale } from "@/lib/i18n";

export function SelectedWork({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary["landing"];
}) {
  return (
    <section id="work" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading title={t.selectedWork.title}>{t.selectedWork.lead}</SectionHeading>

        <Reveal
          as="article"
          className="mt-12 grid gap-8 rounded-4xl bg-card p-3 shadow-card lg:grid-cols-5 lg:items-center lg:gap-10 lg:pr-10"
        >
          <AlertMapScreen caption={t.selectedWork.mapCaption} />
          <div className="grid content-start gap-5 px-3 pb-4 lg:col-span-2 lg:p-0">
            <p className="type-label-mono text-muted-foreground">{t.selectedWork.featuredLabel}</p>
            <p className="text-3xl leading-tight font-medium tracking-tight text-balance">
              {t.selectedWork.featuredTitle}
            </p>
            <dl className="grid gap-4">
              <div className="grid gap-1">
                <dt className="type-caption text-muted-foreground">
                  {t.selectedWork.problemLabel}
                </dt>
                <dd>{t.selectedWork.problem}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="type-caption text-muted-foreground">
                  {t.selectedWork.resultLabel}
                </dt>
                <dd>{t.selectedWork.result}</dd>
              </div>
            </dl>
            <Button variant="link" nativeButton={false} render={<Link href={`/${locale}/map`} />}>
              {t.seeMap}
            </Button>
          </div>
        </Reveal>

        <Reveal
          as="ol"
          aria-label="Facts"
          className="mt-6 grid divide-y rounded-4xl shadow-card sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {t.selectedWork.facts.map(function renderFact(fact, index) {
            return (
              <li key={fact.value} className="flex items-end justify-between gap-4 p-6">
                <div className="grid gap-1">
                  <p className="type-label-mono text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="text-sm text-muted-foreground">{fact.text}</p>
                </div>
                <p className="shrink-0 font-heading text-3xl font-medium tracking-tight tabular-nums">
                  {fact.value}
                </p>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

function AlertMapScreen({ caption }: { caption: string }) {
  const markers = [
    { position: "top-2/5 left-1/4", isUrgent: true },
    { position: "top-3/5 left-1/2", isUrgent: false },
    { position: "top-1/3 left-3/4", isUrgent: false },
  ];
  const alerts = [
    { kind: "Bowl A", place: "Penjaringan", level: "Fast" },
    { kind: "Bowl B", place: "Pademangan", level: "Watch" },
    { kind: "Bowl C", place: "Koja", level: "Slow" },
  ];

  return (
    <figure className="dark relative aspect-4/3 overflow-hidden rounded-2xl bg-background text-foreground shadow-inset lg:col-span-3">
      <figcaption className="sr-only">{caption}</figcaption>
      <div aria-hidden className="absolute inset-0 dot-field text-muted-foreground opacity-40" />
      {markers.map(function renderMarker(marker) {
        return (
          <span
            key={marker.position}
            aria-hidden
            className={cn("absolute flex size-2.5", marker.position)}
          >
            {marker.isUrgent ? (
              <span className="absolute inline-flex size-full rounded-full bg-brand opacity-75 motion-safe:animate-ping" />
            ) : null}
            <span
              className={cn(
                "relative inline-flex size-2.5 rounded-full",
                marker.isUrgent ? "bg-brand" : "bg-chart-2",
              )}
            />
          </span>
        );
      })}
      <ul className="absolute inset-x-3 bottom-3 grid gap-1.5 sm:inset-x-4 sm:bottom-4">
        {alerts.map(function renderAlert(alert) {
          return (
            <li
              key={alert.place}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/90 px-3 py-2 text-xs backdrop-blur-sm"
            >
              <span className="font-medium">
                {alert.kind} · {alert.place}
              </span>
              <span className="text-muted-foreground">{alert.level}</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
