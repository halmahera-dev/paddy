"use client";

import { Button } from "@hollou/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@hollou/ui/components/dialog";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@hollou/ui/components/field";
import { Input } from "@hollou/ui/components/input";
import { Spinner } from "@hollou/ui/components/spinner";
import { Textarea } from "@hollou/ui/components/textarea";
import { useTransition } from "react";
import { toast } from "sonner";

import { recordOutcome, scheduleVisit } from "@/features/bowls/bowls-actions";
import type { InspectionOutcome } from "@/features/bowls/bowls-queries";
import { fill, type Dictionary } from "@/lib/i18n";

export type VisitDialogLabels = {
  dialogs: Dictionary["bowls"]["dialogs"];
  outcomes: Dictionary["bowls"]["outcomes"];
  cancel: string;
  save: string;
};

type VisitDialogProps = {
  bowl: { id: string; name: string } | null;
  labels: VisitDialogLabels;
  onOpenChange: (open: boolean) => void;
};

function useSave(onOpenChange: (open: boolean) => void, savedMessage: string) {
  const [isSaving, startSaving] = useTransition();

  function save(action: () => Promise<{ ok: true } | { ok: false; error: string }>) {
    startSaving(async function runAction() {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(savedMessage);
      onOpenChange(false);
    });
  }

  return { isSaving, save };
}

function DialogActions({ labels, isSaving }: { labels: VisitDialogLabels; isSaving: boolean }) {
  return (
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>{labels.cancel}</DialogClose>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? <Spinner /> : null}
        {labels.save}
      </Button>
    </DialogFooter>
  );
}

export function ScheduleVisitDialog({ bowl, labels, onOpenChange }: VisitDialogProps) {
  const { isSaving, save } = useSave(onOpenChange, labels.dialogs.saved);
  const today = new Date().toISOString().slice(0, 10);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bowl) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    save(() =>
      scheduleVisit({
        bowlId: bowl.id,
        assignee: String(formData.get("assignee") ?? ""),
        visitDate: String(formData.get("visitDate") ?? ""),
      }),
    );
  }

  return (
    <Dialog open={bowl !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={submit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>{fill(labels.dialogs.scheduleTitle, { name: bowl?.name ?? "" })}</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="assignee">{labels.dialogs.inspector}</FieldLabel>
              <Input
                id="assignee"
                name="assignee"
                required
                maxLength={80}
                placeholder={labels.dialogs.inspectorPlaceholder}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="visitDate">{labels.dialogs.visitDate}</FieldLabel>
              <Input id="visitDate" name="visitDate" type="date" required min={today} defaultValue={today} />
            </Field>
          </FieldGroup>
          <DialogActions labels={labels} isSaving={isSaving} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function OutcomeDialog({ bowl, labels, onOpenChange }: VisitDialogProps) {
  const { isSaving, save } = useSave(onOpenChange, labels.dialogs.saved);
  const outcomes = Object.entries(labels.outcomes) as [InspectionOutcome, string][];

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bowl) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    save(() =>
      recordOutcome({
        bowlId: bowl.id,
        outcome: formData.get("outcome") as InspectionOutcome,
        note: String(formData.get("note") ?? ""),
      }),
    );
  }

  return (
    <Dialog open={bowl !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={submit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>{fill(labels.dialogs.outcomeTitle, { name: bowl?.name ?? "" })}</DialogTitle>
          </DialogHeader>
          <FieldSet>
            <FieldLegend className="sr-only">{labels.dialogs.outcomeTitle}</FieldLegend>
            <div className="flex flex-col gap-2">
              {outcomes.map(([value, label], index) => (
                <label
                  key={value}
                  className="pressable flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors duration-160 ease-out hover:bg-accent has-checked:border-brand has-checked:text-brand-text"
                >
                  <input
                    type="radio"
                    name="outcome"
                    value={value}
                    required
                    defaultChecked={index === 0}
                    className="accent-(--brand)"
                  />
                  {label}
                </label>
              ))}
            </div>
          </FieldSet>
          <Field>
            <FieldLabel htmlFor="note">{labels.dialogs.note}</FieldLabel>
            <Textarea id="note" name="note" maxLength={1000} placeholder={labels.dialogs.notePlaceholder} />
          </Field>
          <DialogActions labels={labels} isSaving={isSaving} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
