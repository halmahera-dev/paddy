import { Skeleton } from "@paddy-field/ui/components/skeleton";

import { getFarms } from "@/features/farm/farm-queries";
import { adviseField } from "@/features/farm/field-advice";

import MapsScene, { type FieldPin } from "./maps-scene";

export async function WorldMap() {
  const farms = await getFarms();
  const fields = farms.map(function toPin(farm): FieldPin {
    const longitudes = farm.outline.map((point) => point[0]);
    const latitudes = farm.outline.map((point) => point[1]);
    return {
      id: farm.id,
      name: farm.name,
      center: [
        (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
        (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
      ],
      needsAttention: adviseField(farm).needsAttention,
    };
  });

  return <MapsScene fields={fields} />;
}

export function WorldMapSkeleton() {
  return <Skeleton className="h-full w-full" />;
}
