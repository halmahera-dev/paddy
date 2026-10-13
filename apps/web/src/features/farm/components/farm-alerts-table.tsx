import { Badge } from "@paddy-field/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@paddy-field/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@paddy-field/ui/components/table";

import type { AlertStatus, Farm } from "../farm-queries";

const statusBadge: Record<
  AlertStatus,
  { label: string; variant: "destructive" | "secondary" | "brand" }
> = {
  new: { label: "New", variant: "destructive" },
  acknowledged: { label: "Acknowledged", variant: "secondary" },
  recovered: { label: "Recovered", variant: "brand" },
};

export function FarmAlertsTable({ farm }: { farm: Farm }) {
  const openCount = farm.alerts.filter((alert) => alert.status !== "recovered").length;

  return (
    <Card>
      <CardHeader>
        <CardDescription>Alerts · {openCount} open</CardDescription>
        <CardTitle className="type-title">Area conditions to check</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Observed</TableHead>
              <TableHead>Scale</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farm.alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <span className="text-muted-foreground">
                    No alerts · last data check {farm.conditions.rainObserved}
                  </span>
                </TableCell>
              </TableRow>
            ) : null}
            {farm.alerts.map(function renderAlert(alert) {
              const badge = statusBadge[alert.status];
              return (
                <TableRow key={alert.id}>
                  <TableCell>
                    <span className="font-medium">{alert.title}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="tabular-nums">{alert.observed}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{alert.scale}</span>
                  </TableCell>
                  <TableCell>{alert.status === "recovered" ? "—" : alert.action}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
