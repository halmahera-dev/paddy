import type { Metadata } from "next";
import { Suspense } from "react";

import { LandasMapSkeleton } from "@/features/map/components/landas-map";
import { MapExperience } from "@/features/map/components/map-experience";
import { toLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Map",
};

export default function MapPage({ params }: PageProps<"/[locale]/map">) {
  return params.then(function renderMap({ locale }) {
    return (
      <Suspense fallback={<LandasMapSkeleton />}>
        <MapExperience locale={toLocale(locale)} />
      </Suspense>
    );
  });
}
