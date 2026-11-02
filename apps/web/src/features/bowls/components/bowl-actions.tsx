"use client";

import { Button } from "@hollou/ui/components/button";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { moveBowl } from "@/features/bowls/bowls-actions";
import type { BowlStatus } from "@/features/bowls/bowls-queries";
import {
  OutcomeDialog,
  ScheduleVisitDialog,
  type VisitDialogLabels,
} from "@/features/bowls/components/visit-dialogs";

export function BowlActions({
  bowl,
  status,
  labels,
}: {
  bowl: { id: string; name: string };
  status: BowlStatus;
  labels: VisitDialogLabels & {
    scheduleVisit: string;
    dismiss: string;
    restore: string;
    recordOutcome: string;
  };
}) {
  const [openDialog, setOpenDialog] = useState<"schedule" | "outcome" | null>(null);
  const [isMoving, startMoving] = useTransition();

  function move(nextStatus: "lead" | "dismissed") {
    startMoving(async function runMove() {
      const result = await moveBowl({ bowlId: bowl.id, status: nextStatus });
      if (!result.ok) {
        toast.error(result.error);
      }
    });
  }

  function closeDialog(open: boolean) {
    if (!open) {
      setOpenDialog(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "lead" ? (
        <Button onClick={() => setOpenDialog("schedule")}>{labels.scheduleVisit}</Button>
      ) : null}
      {status === "scheduled" || status === "inspected" ? (
        <Button onClick={() => setOpenDialog("outcome")}>{labels.recordOutcome}</Button>
      ) : null}
      {status === "lead" || status === "scheduled" ? (
        <Button variant="outline" disabled={isMoving} onClick={() => move("dismissed")}>
          {labels.dismiss}
        </Button>
      ) : null}
      {status === "dismissed" || status === "closed" ? (
        <Button variant="outline" disabled={isMoving} onClick={() => move("lead")}>
          {labels.restore}
        </Button>
      ) : null}

      <ScheduleVisitDialog
        bowl={openDialog === "schedule" ? bowl : null}
        labels={labels}
        onOpenChange={closeDialog}
      />
      <OutcomeDialog
        bowl={openDialog === "outcome" ? bowl : null}
        labels={labels}
        onOpenChange={closeDialog}
      />
    </div>
  );
}
