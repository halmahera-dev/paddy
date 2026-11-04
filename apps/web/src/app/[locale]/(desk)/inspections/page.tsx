import { Suspense } from "react";

import {
  InspectionBoard,
  InspectionBoardSkeleton,
} from "@/features/inspections/components/inspection-board";
import { PageHeader } from "@/features/shell/components/page-header";
import { getDictionary, toLocale } from "@/lib/i18n";

export default function InspectionsPage({ params }: PageProps<"/[locale]/inspections">) {
  return params.then(({ locale: rawLocale }) => {
    const locale = toLocale(rawLocale);
    return (
      <>
        <PageHeader title={getDictionary(locale).inspections.title} />
        <main className="flex min-h-0 w-full flex-1 flex-col">
          <Suspense fallback={<InspectionBoardSkeleton />}>
            <InspectionBoard locale={locale} />
          </Suspense>
        </main>
      </>
    );
  });
}
