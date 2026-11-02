import { Button } from "@hollou/ui/components/button";
import Link from "next/link";
import { Suspense } from "react";

import { PageHeader } from "@/features/shell/components/page-header";
import { TodayOverview, TodayOverviewSkeleton } from "@/features/today/components/today-overview";
import { getDictionary, toLocale } from "@/lib/i18n";

export default function TodayPage({ params }: PageProps<"/[locale]">) {
  return params.then(function renderToday({ locale: rawLocale }) {
    const locale = toLocale(rawLocale);
    const t = getDictionary(locale);
    return (
      <>
        <PageHeader
          title={t.today.title}
          actions={
            <Button size="sm" nativeButton={false} render={<Link href={`/${locale}/bowls`} />}>
              {t.common.openBowls}
            </Button>
          }
        />
        <main className="flex w-full flex-1 flex-col gap-4 px-4 py-4 sm:px-6">
          <Suspense fallback={<TodayOverviewSkeleton />}>
            <TodayOverview locale={locale} />
          </Suspense>
        </main>
      </>
    );
  });
}
