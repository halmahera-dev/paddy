"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@hollou/ui/components/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@hollou/ui/components/input-group";
import { Spinner } from "@hollou/ui/components/spinner";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { FilterSelect } from "@/components/filter-select";

export const anyValue = "all";

type Filters = { q: string; kecamatan: string; status: string };

type Option = { value: string; label: string };

const noFilters: Filters = { q: "", kecamatan: anyValue, status: anyValue };

function toQuery(filters: Filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    const trimmed = value.trim();
    if (trimmed && trimmed !== anyValue) {
      params.set(key, trimmed);
    }
  }
  return params.toString();
}

// Filters apply as they change and live in the URL, so a filtered list is a link someone can share.
export function BowlFilters({
  search,
  kecamatan,
  status,
  kecamatanOptions,
  statusOptions,
  labels,
}: {
  search: string;
  kecamatan: string | null;
  status: string | null;
  kecamatanOptions: Option[];
  statusOptions: Option[];
  labels: {
    search: string;
    searchPlaceholder: string;
    kecamatan: string;
    status: string;
    clear: string;
    loading: string;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<Filters>({
    q: search,
    kecamatan: kecamatan ?? anyValue,
    status: status ?? anyValue,
  });
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function apply(next: Filters) {
    setFilters(next);
    clearTimeout(searchTimer.current);
    const query = toQuery(next);
    startTransition(function replaceUrl() {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  function changeSearch(q: string) {
    const next = { ...filters, q };
    setFilters(next);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => apply(next), 300);
  }

  const isFiltered =
    filters.q.trim() !== "" || filters.kecamatan !== anyValue || filters.status !== anyValue;

  return (
    <search className="flex flex-wrap items-center gap-3">
      <InputGroup className="w-full sm:w-72">
        <InputGroupAddon>
          <HugeiconsIcon icon={Search01Icon} />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          aria-label={labels.search}
          maxLength={100}
          value={filters.q}
          onChange={(event) => changeSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              apply(filters);
            }
          }}
          placeholder={labels.searchPlaceholder}
        />
      </InputGroup>
      <FilterSelect
        id="bowl-kecamatan"
        label={labels.kecamatan}
        options={kecamatanOptions}
        value={filters.kecamatan}
        onChange={(value) => apply({ ...filters, kecamatan: value })}
      />
      <FilterSelect
        id="bowl-status"
        label={labels.status}
        options={statusOptions}
        value={filters.status}
        onChange={(value) => apply({ ...filters, status: value })}
      />
      {isFiltered ? (
        <Button type="button" variant="ghost" size="sm" onClick={() => apply(noFilters)}>
          {labels.clear}
        </Button>
      ) : null}
      {isPending ? <Spinner aria-label={labels.loading} /> : null}
    </search>
  );
}
