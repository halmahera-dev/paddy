import { date, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const bowlStatuses = ["lead", "scheduled", "inspected", "closed", "dismissed"] as const;
export const inspectionOutcomes = ["pump_found", "no_pump", "natural"] as const;

// One row per bowl. A bowl with no row is still a lead.
export const inspection = pgTable("inspection", {
  bowlId: text("bowl_id").primaryKey(),
  status: text("status", { enum: bowlStatuses }).notNull(),
  assignee: text("assignee"),
  visitDate: date("visit_date"),
  outcome: text("outcome", { enum: inspectionOutcomes }),
  note: text("note"),
  updatedBy: text("updated_by").references(() => user.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
