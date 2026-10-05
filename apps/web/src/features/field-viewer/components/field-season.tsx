import { Skeleton } from "@paddy-field/ui/components/skeleton";
import { notFound } from "next/navigation";

import { getFarm } from "@/features/farm/farm-queries";

import { FieldStage } from "./field-stage";

export async function FieldSeason({ fieldId }: { fieldId: string }) {
  const farm = await getFarm(fieldId);
  if (!farm) notFound();

  return <FieldStage farm={farm} />;
}

export function FieldSeasonSkeleton() {
  return <Skeleton className="h-full w-full" />;
}
