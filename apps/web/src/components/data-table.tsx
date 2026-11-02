"use client";

import { ArrowDown01Icon, ArrowUp01Icon, ArrowUpDownIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@hollou/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hollou/ui/components/table";
import { cn } from "@hollou/ui/lib/utils";
import {
  createPaginatedRowModel,
  createSortedRowModel,
  FlexRender,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  tableFeatures,
  type ReactTable,
  type RowData,
} from "@tanstack/react-table";

import { fill } from "@/lib/i18n";

// Every list in the desk sorts and pages on the client and nothing more, so they share one feature set.
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
  },
});
export type DataTableFeatures = typeof dataTableFeatures;

export const initialPagination = { pageIndex: 0, pageSize: 20 };

export type DataTableLabels = { pageOf: string; previous: string; next: string };

// Responsive hiding and alignment per column. The lint needs static class strings, so this is a typed map.
export type ColumnLayout = { hideBelow?: "sm" | "md"; alignEnd?: boolean; wrap?: boolean };


function ariaSort(sorted: false | "asc" | "desc") {
  if (sorted === "asc") {
    return "ascending";
  }
  if (sorted === "desc") {
    return "descending";
  }
  return undefined;
}

function sortIcon(sorted: false | "asc" | "desc") {
  if (sorted === "asc") {
    return ArrowUp01Icon;
  }
  if (sorted === "desc") {
    return ArrowDown01Icon;
  }
  return ArrowUpDownIcon;
}

// The table runs edge to edge under the page toolbar, with a count and the pager below it.
export function DataTable<TData extends RowData>({
  table,
  columnLayout = {},
  onRowClick,
  empty,
  footer,
  labels,
}: {
  table: ReactTable<DataTableFeatures, TData>;
  columnLayout?: Record<string, ColumnLayout>;
  onRowClick?: (row: TData) => void;
  empty: React.ReactNode;
  footer: React.ReactNode;
  labels: DataTableLabels;
}) {
  const rows = table.getRowModel().rows;
  const pageCount = table.getPageCount();

  return (
    <div className="flex flex-col">
      <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map(function renderHead(header) {
                  const sorted = header.column.getIsSorted();
                  const layout = columnLayout[header.column.id];
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        layout?.hideBelow === "sm" && "hidden sm:table-cell",
                        layout?.hideBelow === "md" && "hidden md:table-cell",
                        layout?.alignEnd && "text-right",
                        layout?.wrap && "min-w-40 whitespace-normal",
                      )}
                      aria-sort={ariaSort(sorted)}
                    >
                      {header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="-mx-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-normal text-muted-foreground transition-colors duration-160 ease-out hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                        >
                          <FlexRender header={header} />
                          <HugeiconsIcon
                            icon={sortIcon(sorted)}
                            className={cn("size-3", !sorted && "opacity-60")}
                          />
                        </button>
                      ) : (
                        <span className="text-xs font-normal text-muted-foreground">
                          <FlexRender header={header} />
                        </span>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                className={onRowClick ? "cursor-pointer" : undefined}
                // The first cell's link is the keyboard path; the rest of the row is a larger pointer target.
                onClick={
                  onRowClick
                    ? (event) => {
                        const target = event.target as HTMLElement;
                        if (target.closest("a, button, input, label")) {
                          return;
                        }
                        onRowClick(row.original);
                      }
                    : undefined
                }
              >
                {row.getAllCells().map(function renderCell(cell) {
                  const layout = columnLayout[cell.column.id];
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        layout?.hideBelow === "sm" && "hidden sm:table-cell",
                        layout?.hideBelow === "md" && "hidden md:table-cell",
                        layout?.alignEnd && "text-right",
                        layout?.wrap && "min-w-40 whitespace-normal",
                      )}
                    >
                      <FlexRender cell={cell} />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
      </Table>
      {rows.length === 0 ? empty : null}
      <div className="glass sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2.5 text-xs text-muted-foreground tabular-nums sm:px-6">
        <span>{footer}</span>
        {pageCount > 1 ? (
          <span className="flex items-center gap-1">
            {fill(labels.pageOf, { page: table.state.pagination.pageIndex + 1, pages: pageCount })}
            <Button
              variant="ghost"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              {labels.previous}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              {labels.next}
            </Button>
          </span>
        ) : null}
      </div>
    </div>
  );
}
