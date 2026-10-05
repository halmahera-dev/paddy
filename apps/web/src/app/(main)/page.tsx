import type { Metadata } from "next";

import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { FarmOverview, FarmOverviewSkeleton } from "@/features/farm/components/farm-overview";

export const metadata: Metadata = {
  title: "Overview",
};

export default function HomePage({ searchParams }: { searchParams: Promise<{ field?: string }> }) {
  return (
    <div className="overview-art @container/main flex min-h-0 flex-1 flex-col overflow-y-auto">
      <PageHeader title="Overview" />

      <Suspense fallback={<FarmOverviewSkeleton />}>
        {searchParams.then(({ field }) => {
          return <FarmOverview fieldId={field} />;
        })}
      </Suspense>
    </div>
  );
}
