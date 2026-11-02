import { Skeleton } from "@hollou/ui/components/skeleton";

import { KpiCards } from "@/components/kpi-cards";
import { getBowls } from "@/features/bowls/bowls-queries";
import { anyValue, BowlFilters } from "@/features/bowls/components/bowl-filters";
import { BowlTable } from "@/features/bowls/components/bowl-table";
import { getDictionary, type Locale } from "@/lib/i18n";

export type BowlQueueFilters = {
  search: string;
  kecamatan: string | null;
  status: string | null;
};

export async function BowlQueue({ locale, filters }: { locale: Locale; filters: BowlQueueFilters }) {
  const dictionary = getDictionary(locale);
  const t = dictionary.bowls;
  const { search, kecamatan, status } = filters;
  const allBowls = await getBowls();
  const searchText = search.toLowerCase();
  const bowls = allBowls
    .filter((bowl) => !kecamatan || bowl.kecamatan === kecamatan)
    .filter((bowl) => !status || bowl.status === status)
    .filter(
      (bowl) =>
        !searchText ||
        bowl.name.toLowerCase().includes(searchText) ||
        bowl.kecamatan.toLowerCase().includes(searchText),
    )
    .toSorted((a, b) => a.rank - b.rank);
  const kecamatanNames = [...new Set(allBowls.map((bowl) => bowl.kecamatan))].toSorted();
  const fastestRate = Math.max(0, ...bowls.map((bowl) => bowl.rateAfterBanMmYr));

  return (
    <>
      <KpiCards
        items={[
          { label: t.kpiInView, value: bowls.length },
          { label: t.kpiLeads, value: bowls.filter((bowl) => bowl.status === "lead").length },
          { label: t.kpiScheduled, value: bowls.filter((bowl) => bowl.status === "scheduled").length },
          { label: t.kpiFastest, value: fastestRate },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
        <BowlFilters
          search={search}
          kecamatan={kecamatan}
          status={status}
          kecamatanOptions={[
            { value: anyValue, label: t.allKecamatan },
            ...kecamatanNames.map((name) => ({ value: name, label: name })),
          ]}
          statusOptions={[
            { value: anyValue, label: t.allStatuses },
            ...Object.entries(t.statuses).map(([value, label]) => ({ value, label })),
          ]}
          labels={{
            search: dictionary.common.search,
            searchPlaceholder: t.searchPlaceholder,
            kecamatan: t.kecamatan,
            status: t.status,
            clear: dictionary.common.clear,
            loading: dictionary.common.loading,
          }}
        />
      </div>
      <BowlTable
        bowls={bowls}
        locale={locale}
        isFiltered={Boolean(search || kecamatan || status)}
        labels={{
          bowls: t,
          pageOf: dictionary.common.pageOf,
          previous: dictionary.common.previous,
          next: dictionary.common.next,
        }}
      />
    </>
  );
}

export function BowlQueueSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6" aria-busy="true">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-18" />
        ))}
      </div>
      <Skeleton className="h-8 w-96 max-w-full" />
      <Skeleton className="h-64" />
    </div>
  );
}
