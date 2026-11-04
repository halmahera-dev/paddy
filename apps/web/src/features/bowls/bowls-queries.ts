import "server-only";

import { db } from "@hollou/db";
import { inspection } from "@hollou/db/schema/inspection";
import { cache } from "react";

import seed from "./bowls-seed.json";

export type BowlStatus = (typeof inspection.$inferSelect)["status"];
export type InspectionOutcome = NonNullable<(typeof inspection.$inferSelect)["outcome"]>;

type SeedBowl = (typeof seed.bowls)[number];

export type BowlSeries = SeedBowl["series"];

export type PublicBowl = Omit<SeedBowl, "series" | "center"> & {
  center: [number, number];
};

export type Bowl = PublicBowl & {
  status: BowlStatus;
  assignee: string | null;
  visitDate: string | null;
  outcome: InspectionOutcome | null;
  note: string | null;
};

export const banDate = seed.banDate;

function toPublicBowl({ series: _series, center, ...bowl }: SeedBowl): PublicBowl {
  return { ...bowl, center: [center[0], center[1]] };
}

export function getPublicBowls() {
  return seed.bowls.map(toPublicBowl);
}

export function getBowlSeries(bowlId: string) {
  return seed.bowls.find((bowl) => bowl.id === bowlId)?.series ?? null;
}

async function loadBowls(): Promise<Bowl[]> {
  const rows = await db.select().from(inspection);
  const rowByBowlId = new Map(rows.map((row) => [row.bowlId, row]));

  return getPublicBowls().map((bowl) => {
    const row = rowByBowlId.get(bowl.id);
    return {
      ...bowl,
      status: row?.status ?? "lead",
      assignee: row?.assignee ?? null,
      visitDate: row?.visitDate ?? null,
      outcome: row?.outcome ?? null,
      note: row?.note ?? null,
    };
  });
}

export const getBowls = cache(loadBowls);

export async function getBowl(bowlId: string) {
  const bowls = await getBowls();
  return bowls.find((bowl) => bowl.id === bowlId) ?? null;
}
