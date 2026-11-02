import { Button } from "@hollou/ui/components/button";
import Link from "next/link";
import { Suspense } from "react";

import { BowlQueue, BowlQueueSkeleton } from "@/features/bowls/components/bowl-queue";
import { PageHeader } from "@/features/shell/components/page-header";
import { getDictionary, toLocale } from "@/lib/i18n";

function firstValue(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? null;
}

export default function BowlsPage({ params, searchParams }: PageProps<"/[locale]/bowls">) {
  return Promise.all([params, searchParams]).then(function renderBowls([{ locale: rawLocale }, query]) {
    const locale = toLocale(rawLocale);
    const t = getDictionary(locale);
    const filters = {
      search: (firstValue(query.q) ?? "").trim().slice(0, 100),
      kecamatan: firstValue(query.kecamatan),
      status: firstValue(query.status),
    };

    return (
      <>
        <PageHeader
          title={t.bowls.title}
          actions={
            <Button size="sm" nativeButton={false} render={<Link href={`/${locale}/map`} />}>
              {t.common.openMap}
            </Button>
          }
        />
        <main className="flex w-full flex-1 flex-col">
          <Suspense fallback={<BowlQueueSkeleton />}>
            <BowlQueue locale={locale} filters={filters} />
          </Suspense>
        </main>
      </>
    );
  });
}
