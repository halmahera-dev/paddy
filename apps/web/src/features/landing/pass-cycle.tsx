import { cn } from "@hollou/ui/lib/utils";

import { SectionHeading } from "@/features/landing/components/section-heading";
import { fill, type Dictionary } from "@/lib/i18n";

export function PassCycle({ t }: { t: Dictionary["landing"] }) {
  const weeks = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
  ];
  const reviewDays = [5, 10];
  const highlightDay = 12;
  const milestones = t.passCycle.milestones;

  return (
    <div id="pass-cycle" className="mt-20 scroll-mt-24">
      <div>
        <SectionHeading title={t.passCycle.title} isSplit>{t.passCycle.lead}</SectionHeading>

        <div className="mt-12 grid gap-6">
          {weeks.map((days, weekIndex) => {
            return (
              <div key={weekIndex} className="grid gap-3">
                <p className="type-label-mono text-muted-foreground">
                  {fill(t.passCycle.week, { n: weekIndex + 1 })}
                </p>
                <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
                  {days.map((day) => {
                    const milestone = milestones[String(day) as keyof typeof milestones];
                    const isReview = reviewDays.includes(day);
                    const isHighlight = day === highlightDay;

                    if (!milestone) {
                      return (
                        <li
                          key={day}
                          className="flex items-center gap-3 rounded-2xl p-3 text-faint-foreground shadow-inset lg:flex-col lg:items-start lg:justify-between"
                        >
                          <span className="w-16 shrink-0 font-mono text-xs tabular-nums lg:w-auto">
                            {fill(t.passCycle.day, { n: day })}
                          </span>
                          <span className="text-sm">{t.passCycle.weekend}</span>
                        </li>
                      );
                    }

                    return (
                      <li
                        key={day}
                        className={cn(
                          "relative flex items-start gap-3 rounded-2xl p-3 shadow-card lg:min-h-36 lg:flex-col lg:justify-between",
                          isHighlight ? "bg-surface-raised" : "bg-card",
                        )}
                      >
                        <span className="flex w-16 shrink-0 items-center gap-2 font-mono text-xs text-muted-foreground tabular-nums lg:w-auto">
                          {fill(t.passCycle.day, { n: day })}
                          {isReview ? (
                            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                          ) : null}
                        </span>
                        <span className="text-sm text-pretty">{milestone}</span>
                        {isHighlight ? (
                          <>
                            <span
                              aria-hidden
                              className="absolute top-3 right-3 size-4 rounded-full bg-brand"
                            />
                            <span
                              aria-hidden
                              data-active="true"
                              className="glow-ring absolute -inset-px"
                            />
                          </>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
        </div>

        <p className="mt-6 flex items-center gap-2 type-caption text-muted-foreground">
          <span aria-hidden className="size-1.5 rounded-full bg-brand" />
          {t.passCycle.note}
        </p>
      </div>
    </div>
  );
}
