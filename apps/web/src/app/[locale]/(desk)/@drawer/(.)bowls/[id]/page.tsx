import { Suspense } from "react";

import { BowlDetail, BowlDetailSkeleton } from "@/features/bowls/components/bowl-detail";
import { BowlSheet } from "@/features/bowls/components/bowl-sheet";
import { getDictionary, toLocale } from "@/lib/i18n";

export default function BowlDrawerPage({ params }: PageProps<"/[locale]/bowls/[id]">) {
  return params.then(({ locale: rawLocale, id }) => {
    const locale = toLocale(rawLocale);
    return (
      <BowlSheet title={getDictionary(locale).bowls.detailTitle}>
        <Suspense fallback={<BowlDetailSkeleton />}>
          <BowlDetail locale={locale} bowlId={id} />
        </Suspense>
      </BowlSheet>
    );
  });
}
