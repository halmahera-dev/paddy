import { Suspense } from "react";

import { BowlDetail, BowlDetailSkeleton } from "@/features/bowls/components/bowl-detail";
import { PageHeader } from "@/features/shell/components/page-header";
import { getDictionary, toLocale } from "@/lib/i18n";

export default function BowlPage({ params }: PageProps<"/[locale]/bowls/[id]">) {
  return params.then(({ locale: rawLocale, id }) => {
    const locale = toLocale(rawLocale);
    return (
      <>
        <PageHeader title={getDictionary(locale).bowls.detailTitle} />
        <main className="w-full max-w-2xl px-4 py-6 sm:px-6">
          <Suspense fallback={<BowlDetailSkeleton />}>
            <BowlDetail locale={locale} bowlId={id} />
          </Suspense>
        </main>
      </>
    );
  });
}
