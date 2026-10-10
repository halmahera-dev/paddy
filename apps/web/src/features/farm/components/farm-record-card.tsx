import { Badge } from "@paddy-field/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@paddy-field/ui/components/card";

import type { DatePrecision, Farm } from "../farm-queries";

import { cropName, describePlantingDate } from "../crop-progress";

const precisionLabel: Record<DatePrecision, string> = {
  exact: "Exact date",
  week: "Rough week",
  month: "Rough month",
  unknown: "Unknown date",
};

export function FarmRecordCard({ farm }: { farm: Farm }) {
  const records = [
    { label: "Field", value: farm.field },
    { label: "Subdistrict", value: `${farm.subdistrict}, ${farm.province}` },
    { label: "Soil", value: farm.soil },
    { label: "Current crop", value: cropName[farm.cropRecord.crop] },
    { label: "Planted", value: describePlantingDate(farm.cropRecord) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardDescription>My farm</CardDescription>
        <CardTitle className="type-title">{farm.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-2 text-sm">
          {records.map(function renderRecord(record) {
            return (
              <div key={record.label} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{record.label}</dt>
                <dd className="text-right font-medium">{record.value}</dd>
              </div>
            );
          })}
        </dl>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{precisionLabel[farm.cropRecord.precision]}</Badge>
          <span className="text-xs text-muted-foreground">
            Your records · used for crop progress
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
