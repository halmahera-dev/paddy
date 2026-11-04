import { Skeleton } from "@hollou/ui/components/skeleton";

import { KpiCards } from "@/components/kpi-cards";
import { getBowls } from "@/features/bowls/bowls-queries";
import { InspectionColumns } from "@/features/inspections/components/inspection-columns";
import { fill, formatDate, getDictionary, type Locale } from "@/lib/i18n";

export async function InspectionBoard({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const t = dictionary.bowls;
  const bowls = (await getBowls()).filter((bowl) => bowl.status !== "dismissed");
  const visitTextByBowlId = Object.fromEntries(
    bowls.flatMap((bowl) => {
      if (!bowl.assignee || !bowl.visitDate) {
        return [];
      }
      const text = fill(t.assignedTo, { assignee: bowl.assignee, date: formatDate(locale, bowl.visitDate) });
      return [[bowl.id, text]];
    }),
  );

  const closedBowls = bowls.filter((bowl) => bowl.outcome !== null);
  const pumpCount = closedBowls.filter((bowl) => bowl.outcome === "pump_found").length;

  return (
    <>
      <KpiCards
        items={[
          { label: t.kpiLeads, value: bowls.filter((bowl) => bowl.status === "lead").length },
          { label: t.kpiScheduled, value: bowls.filter((bowl) => bowl.status === "scheduled").length },
          { label: t.statuses.inspected, value: bowls.filter((bowl) => bowl.status === "inspected").length },
          {
            label: dictionary.today.hitRate,
            value: closedBowls.length > 0 ? `${pumpCount} / ${closedBowls.length}` : "0",
          },
        ]}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-4 sm:px-6">
        <InspectionColumns
          bowls={bowls}
          visitTextByBowlId={visitTextByBowlId}
          locale={locale}
          labels={{
            dialogs: t.dialogs,
            outcomes: t.outcomes,
            statuses: t.statuses,
            cancel: dictionary.common.cancel,
            save: dictionary.common.save,
            recordOutcome: t.recordOutcome,
            open: dictionary.inspections.open,
            emptyColumn: dictionary.inspections.emptyColumn,
            dragHint: dictionary.inspections.dragHint,
            mmPerYear: dictionary.common.mmPerYear,
          }}
        />
      </div>
    </>
  );
}

export function InspectionBoardSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4 sm:p-6" aria-busy="true">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-18" />
        ))}
      </div>
      <div className="flex gap-3 overflow-hidden">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-96 w-72 shrink-0 xl:w-auto xl:flex-1" />
        ))}
      </div>
    </div>
  );
}
