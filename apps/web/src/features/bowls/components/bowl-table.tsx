"use client";

import { ListViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@hollou/ui/components/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@hollou/ui/components/empty";
import { createColumnHelper, useTable } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import {
  DataTable,
  dataTableFeatures,
  initialPagination,
  type ColumnLayout,
  type DataTableFeatures,
  type DataTableLabels,
} from "@/components/data-table";
import type { Bowl } from "@/features/bowls/bowls-queries";
import { fill, type Dictionary } from "@/lib/i18n";

const column = createColumnHelper<DataTableFeatures, Bowl>();

// Narrow screens keep the bowl, its rate and its status; the kecamatan folds into the bowl cell.
const columnLayout: Record<string, ColumnLayout> = {
  bowl: { wrap: true },
  kecamatan: { hideBelow: "sm" },
  depth: { hideBelow: "md", alignEnd: true },
  change: { hideBelow: "md", alignEnd: true },
  rate: { alignEnd: true },
};

const statusOrder: Bowl["status"][] = ["lead", "scheduled", "inspected", "closed", "dismissed"];

function changeAfterBan(bowl: Bowl) {
  return Math.round((bowl.rateAfterBanMmYr / bowl.rateBeforeBanMmYr - 1) * 100);
}

export type BowlTableLabels = DataTableLabels & {
  bowls: Dictionary["bowls"];
};

export function BowlTable({
  bowls,
  locale,
  isFiltered,
  labels,
}: {
  bowls: Bowl[];
  locale: string;
  isFiltered: boolean;
  labels: BowlTableLabels;
}) {
  const router = useRouter();
  const t = labels.bowls;

  const columns = useMemo(
    () =>
      column.columns([
        column.accessor("rank", { header: t.rank, sortFn: "basic" }),
        column.accessor("name", {
          id: "bowl",
          header: t.bowl,
          sortFn: "alphanumeric",
          cell: ({ row }) => (
            <>
              <Link
                href={`/${locale}/bowls/${row.original.id}`}
                className="font-medium transition-colors duration-160 ease-out hover:text-brand-text focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                {row.original.name}
              </Link>
              <p className="text-xs text-muted-foreground sm:hidden">{row.original.kecamatan}</p>
            </>
          ),
        }),
        column.accessor("kecamatan", { header: t.kecamatan, sortFn: "alphanumeric" }),
        column.accessor("rateAfterBanMmYr", { id: "rate", header: t.rate, sortFn: "basic" }),
        column.accessor("depthCm", {
          id: "depth",
          header: t.depth,
          sortFn: "basic",
          cell: ({ row }) => `${row.original.depthCm} cm`,
        }),
        column.accessor(changeAfterBan, {
          id: "change",
          header: t.afterBan,
          sortFn: "basic",
          cell: ({ row }) => `${changeAfterBan(row.original)}%`,
        }),
        column.accessor((bowl) => statusOrder.indexOf(bowl.status), {
          id: "status",
          header: t.status,
          sortFn: "basic",
          cell: ({ row }) => (
            <Badge variant={row.original.status === "lead" ? "brand" : "secondary"}>
              {t.statuses[row.original.status]}
            </Badge>
          ),
        }),
      ]),
    [t, locale],
  );

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: bowls,
    initialState: { pagination: initialPagination },
  });

  return (
    <DataTable
      table={table}
      columnLayout={columnLayout}
      labels={labels}
      onRowClick={(bowl) => router.push(`/${locale}/bowls/${bowl.id}`)}
      empty={
        <Empty className="flex-none">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={ListViewIcon} />
            </EmptyMedia>
            <EmptyTitle>{isFiltered ? t.emptyFilteredTitle : t.empty}</EmptyTitle>
            {isFiltered ? <EmptyDescription>{t.emptyFilteredBody}</EmptyDescription> : null}
          </EmptyHeader>
        </Empty>
      }
      footer={bowls.length === 1 ? t.inViewOne : fill(t.inViewMany, { count: bowls.length })}
    />
  );
}
