"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Button } from "@hollou/ui/components/button";
import { cn } from "@hollou/ui/lib/utils";
import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

import { moveBowl } from "@/features/bowls/bowls-actions";
import type { Bowl, BowlStatus } from "@/features/bowls/bowls-queries";
import {
  OutcomeDialog,
  ScheduleVisitDialog,
  type VisitDialogLabels,
} from "@/features/bowls/components/visit-dialogs";
import type { Dictionary } from "@/lib/i18n";

type BoardStatus = Exclude<BowlStatus, "dismissed">;

const columns: BoardStatus[] = ["lead", "scheduled", "inspected", "closed"];

export type InspectionColumnsLabels = VisitDialogLabels & {
  statuses: Dictionary["bowls"]["statuses"];
  open: string;
  recordOutcome: string;
  emptyColumn: string;
  dragHint: string;
  mmPerYear: string;
};

const cardClassName = "flex flex-col gap-1 rounded-lg border bg-background p-3 text-sm";

function BowlCardDetails({
  bowl,
  visitText,
  labels,
}: {
  bowl: Bowl;
  visitText: string | null;
  labels: InspectionColumnsLabels;
}) {
  return (
    <>
      <span className="font-medium">{bowl.name}</span>
      <span className="text-muted-foreground">
        {bowl.kecamatan}, {bowl.rateAfterBanMmYr} {labels.mmPerYear}
      </span>
      {visitText ? <span className="text-muted-foreground">{visitText}</span> : null}
      {bowl.outcome ? <span className="text-brand-text">{labels.outcomes[bowl.outcome]}</span> : null}
    </>
  );
}

function BowlCard({
  bowl,
  visitText,
  labels,
  locale,
  onRecordOutcome,
}: {
  bowl: Bowl;
  visitText: string | null;
  labels: InspectionColumnsLabels;
  locale: string;
  onRecordOutcome: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: bowl.id });

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        cardClassName,
        "cursor-grab outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        isDragging && "opacity-40",
      )}
    >
      <BowlCardDetails bowl={bowl} visitText={visitText} labels={labels} />
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {bowl.status === "inspected" ? (
          <Button size="xs" onClick={onRecordOutcome} onPointerDown={(event) => event.stopPropagation()}>
            {labels.recordOutcome}
          </Button>
        ) : null}
        <Button
          variant="link"
          size="xs"
          nativeButton={false}
          render={<Link href={`/${locale}/bowls/${bowl.id}`} />}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {labels.open}
        </Button>
      </div>
    </li>
  );
}

function Column({
  status,
  title,
  children,
  count,
}: {
  status: BoardStatus;
  title: string;
  children: React.ReactNode;
  count: number;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      aria-label={title}
      className={cn(
        "flex min-h-64 w-72 shrink-0 flex-col rounded-4xl bg-card shadow-card transition-colors duration-160 ease-out xl:w-auto xl:flex-1",
        isOver && "ring-2 ring-brand",
      )}
    >
      <h2 className="flex shrink-0 items-center justify-between gap-4 border-b px-4 py-3 text-sm font-medium">
        {title}
        <span className="text-xs font-normal text-muted-foreground tabular-nums">{count}</span>
      </h2>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain p-3">{children}</div>
    </section>
  );
}

export function InspectionColumns({
  bowls,
  visitTextByBowlId,
  labels,
  locale,
}: {
  bowls: Bowl[];
  visitTextByBowlId: Record<string, string>;
  labels: InspectionColumnsLabels;
  locale: string;
}) {
  const [optimisticBowls, moveOptimistically] = useOptimistic(
    bowls,
    function applyMove(current, move: { bowlId: string; status: BowlStatus }) {
      return current.map((bowl) => (bowl.id === move.bowlId ? { ...bowl, status: move.status } : bowl));
    },
  );
  const [, startMoving] = useTransition();
  const [scheduleBowl, setScheduleBowl] = useState<Bowl | null>(null);
  const [outcomeBowl, setOutcomeBowl] = useState<Bowl | null>(null);
  const [draggedBowlId, setDraggedBowlId] = useState<string | null>(null);
  const draggedBowl = optimisticBowls.find((bowl) => bowl.id === draggedBowlId) ?? null;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  function pickUpCard(event: DragStartEvent) {
    setDraggedBowlId(String(event.active.id));
  }

  function dropCard(event: DragEndEvent) {
    setDraggedBowlId(null);
    const bowl = optimisticBowls.find((item) => item.id === event.active.id);
    const status = event.over?.id as BoardStatus | undefined;
    if (!bowl || !status || bowl.status === status) {
      return;
    }
    if (status === "scheduled") {
      setScheduleBowl(bowl);
      return;
    }
    if (status === "closed") {
      setOutcomeBowl(bowl);
      return;
    }
    startMoving(async function runMove() {
      moveOptimistically({ bowlId: bowl.id, status });
      const result = await moveBowl({ bowlId: bowl.id, status });
      if (!result.ok) {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <p className="text-xs text-muted-foreground">{labels.dragHint}</p>
      <DndContext
        sensors={sensors}
        onDragStart={pickUpCard}
        onDragEnd={dropCard}
        onDragCancel={() => setDraggedBowlId(null)}
      >
        <div className="-m-1 flex min-h-0 flex-1 gap-3 overflow-x-auto p-1">
          {columns.map(function renderColumn(status) {
            const columnBowls = optimisticBowls
              .filter((bowl) => bowl.status === status)
              .toSorted((a, b) => a.rank - b.rank);
            return (
              <Column key={status} status={status} title={labels.statuses[status]} count={columnBowls.length}>
                {columnBowls.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{labels.emptyColumn}</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {columnBowls.map((bowl) => (
                      <BowlCard
                        key={bowl.id}
                        bowl={bowl}
                        visitText={visitTextByBowlId[bowl.id] ?? null}
                        labels={labels}
                        locale={locale}
                        onRecordOutcome={() => setOutcomeBowl(bowl)}
                      />
                    ))}
                  </ul>
                )}
              </Column>
            );
          })}
        </div>
        <DragOverlay dropAnimation={null}>
          {draggedBowl ? (
            <div className={cn(cardClassName, "cursor-grabbing shadow-lg")}>
              <BowlCardDetails
                bowl={draggedBowl}
                visitText={visitTextByBowlId[draggedBowl.id] ?? null}
                labels={labels}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <ScheduleVisitDialog
        bowl={scheduleBowl}
        labels={labels}
        onOpenChange={(open) => !open && setScheduleBowl(null)}
      />
      <OutcomeDialog
        bowl={outcomeBowl}
        labels={labels}
        onOpenChange={(open) => !open && setOutcomeBowl(null)}
      />
    </>
  );
}
