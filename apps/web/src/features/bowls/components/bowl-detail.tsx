import { Badge } from "@hollou/ui/components/badge";
import { Skeleton } from "@hollou/ui/components/skeleton";
import { notFound } from "next/navigation";

import { banDate, getBowl, getBowlSeries } from "@/features/bowls/bowls-queries";
import { BowlActions } from "@/features/bowls/components/bowl-actions";
import { BowlChart } from "@/features/bowls/components/bowl-chart";
import { fill, formatDate, getDictionary, type Locale } from "@/lib/i18n";

export async function BowlDetail({ locale, bowlId }: { locale: Locale; bowlId: string }) {
  const dictionary = getDictionary(locale);
  const t = dictionary.bowls;
  const bowl = await getBowl(bowlId);
  const series = getBowlSeries(bowlId);
  if (!bowl || !series) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="type-title">{bowl.name}</h2>
          <Badge variant="secondary">{t.statuses[bowl.status]}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {bowl.kecamatan}, {t.rank.toLowerCase()} {bowl.rank}
        </p>
        <p className="w-fit rounded-full bg-brand/12 px-3 py-1 text-sm text-brand-text">
          {dictionary.common.leadLabel}
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">{t.chartTitle}</h3>
        <BowlChart
          series={series}
          banDate={banDate}
          labels={{ sentinel: t.sentinel, nisar: t.nisar, banLine: t.banLine }}
        />
        <p className="text-sm text-muted-foreground">
          {fill(t.rates, {
            before: bowl.rateBeforeBanMmYr,
            after: bowl.rateAfterBanMmYr,
            uncertainty: bowl.uncertaintyMmYr,
          })}{" "}
          {t.joinNote}
        </p>
      </section>

      {bowl.assignee && bowl.visitDate ? (
        <p className="text-sm">
          {fill(t.assignedTo, { assignee: bowl.assignee, date: formatDate(locale, bowl.visitDate) })}
        </p>
      ) : null}
      {bowl.outcome ? (
        <p className="text-sm">
          {fill(t.outcomeIs, { outcome: t.outcomes[bowl.outcome] })} {bowl.note}
        </p>
      ) : null}

      <BowlActions
        bowl={{ id: bowl.id, name: bowl.name }}
        status={bowl.status}
        labels={{
          dialogs: t.dialogs,
          outcomes: t.outcomes,
          cancel: dictionary.common.cancel,
          save: dictionary.common.save,
          scheduleVisit: t.scheduleVisit,
          dismiss: t.dismiss,
          restore: t.restore,
          recordOutcome: t.recordOutcome,
        }}
      />

      <section className="flex flex-col gap-1 border-t pt-4">
        <h3 className="text-sm font-medium">{t.evidenceTitle}</h3>
        <p className="text-sm text-muted-foreground">{t.evidence}</p>
      </section>
    </div>
  );
}

export function BowlDetailSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-72" />
      </div>
      <Skeleton className="h-52" />
      <Skeleton className="h-8 w-48" />
    </div>
  );
}
