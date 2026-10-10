import { Badge } from "@paddy-field/ui/components/badge";
import { Card, CardHeader, CardTitle } from "@paddy-field/ui/components/card";
import { Skeleton } from "@paddy-field/ui/components/skeleton";

import { cropName, describeElapsedDays, estimateCropProgress } from "../crop-progress";
import { getFarms } from "../farm-queries";
import { adviseField, byAttentionFirst } from "../field-advice";
import { ChosenPlanCard } from "./chosen-plan-card";
import { FarmAlertsTable } from "./farm-alerts-table";
import { FarmMetricCards } from "./farm-metric-cards";
import { FarmRecordCard } from "./farm-record-card";
import { FieldFilter } from "./field-filter";
import { RainDemandCard } from "./rain-demand-card";

export async function FarmOverview({ fieldId }: { fieldId: string | undefined }) {
  const farms = (await getFarms()).toSorted(byAttentionFirst);
  const farm = farms.find((candidate) => candidate.id === fieldId) ?? farms[0];
  const advice = adviseField(farm);
  const elapsedDays = describeElapsedDays(estimateCropProgress(farm.cropRecord, farm.asOf));
  const fieldOptions = farms.map(function toOption(candidate) {
    return { id: candidate.id, name: candidate.name };
  });

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div className="mt-4 flex flex-col gap-1">
        <div className="mb-1 flex gap-2">
          <Badge variant="blur">{cropName[farm.cropRecord.crop]}</Badge>
          {elapsedDays && <Badge variant="blur">{elapsedDays} since planting</Badge>}
        </div>
        <h1 className="type-display">{farm.name}</h1>
        <p className="text-secondary-foreground">
          {farm.subdistrict}, {farm.province}
        </p>
      </div>
      <FieldFilter fields={fieldOptions} fieldId={farm.id} />
      <Card>
        <CardHeader>
          <Badge variant={advice.needsAttention ? "destructive" : "brand"}>
            {advice.needsAttention ? "Needs attention" : "Today"}
          </Badge>
          <CardTitle className="type-headline">{advice.headline}</CardTitle>
          <p className="text-sm text-secondary-foreground">{advice.detail}</p>
          {advice.action && <p className="mt-2 text-sm font-medium">{advice.action}</p>}
        </CardHeader>
      </Card>
      <FarmMetricCards farm={farm} />
      <RainDemandCard farm={farm} />
      <FarmAlertsTable farm={farm} />
      <div className="grid gap-4 @3xl/main:grid-cols-2">
        <ChosenPlanCard farm={farm} />
        <FarmRecordCard farm={farm} />
      </div>
    </div>
  );
}

export function FarmOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-80" />
      </div>
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
      <Skeleton className="h-96" />
      <Skeleton className="h-64" />
      <div className="grid gap-4 @3xl/main:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}
