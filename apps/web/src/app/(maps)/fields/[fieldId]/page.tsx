import type { Metadata } from "next";

import { SidebarTrigger } from "@paddy-field/ui/components/sidebar";
import { Suspense } from "react";

import { FieldSeason, FieldSeasonSkeleton } from "@/features/field-viewer/components/field-season";

export const metadata: Metadata = {
  title: "3D season",
};

export default function FieldPage({ params }: { params: Promise<{ fieldId: string }> }) {
  return (
    <div className="relative h-full w-full">
      <Suspense fallback={<FieldSeasonSkeleton />}>
        {params.then(({ fieldId }) => {
          return <FieldSeason fieldId={fieldId} />;
        })}
      </Suspense>
      <SidebarTrigger
        variant="outline"
        className="absolute top-4 left-4 z-20 md:group-has-data-[state=expanded]/sidebar-wrapper:left-(--sidebar-width) md:group-has-data-[state=expanded]/sidebar-wrapper:translate-x-4"
      />
    </div>
  );
}
