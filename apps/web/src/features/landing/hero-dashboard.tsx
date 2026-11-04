import {
  DashboardSquare01Icon,
  ListViewIcon,
  MapsGlobal02Icon,
  PlayIcon,
  TaskDaily01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@hollou/ui/components/badge";
import { cn } from "@hollou/ui/lib/utils";
import Image from "next/image";

import { AppLogo } from "@/components/app-logo";
import type { Dictionary } from "@/lib/i18n";

export function HeroDashboard({ nav }: { nav: Dictionary["nav"] }) {
  const items = [
    { title: nav.today, icon: DashboardSquare01Icon, isActive: false },
    { title: nav.bowls, icon: ListViewIcon, isActive: false },
    { title: nav.inspections, icon: TaskDaily01Icon, isActive: false },
    { title: nav.map, icon: MapsGlobal02Icon, isActive: true },
  ];

  return (
    <div aria-hidden="true" className="relative">
      <div className="pointer-events-none absolute inset-x-0 -top-32 bottom-0 bg-[radial-gradient(ellipse_75%_100%_at_50%_100%,color-mix(in_oklab,var(--brand)_24%,transparent),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
      <div className="rise-in max-h-120 overflow-hidden rounded-t-4xl border border-b-0 bg-card sm:max-h-136 md:max-h-152">
        <div className="grid md:grid-cols-[13rem_1fr]">
          <div className="hidden flex-col gap-1 border-r p-3 md:flex">
            <p className="flex items-center gap-2 px-2 pt-1 pb-4 font-heading text-sm font-semibold">
              <AppLogo />
              LANDAS
            </p>
            {items.map(function renderItem(item) {
              return (
                <p
                  key={item.title}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                    item.isActive ? "bg-accent text-foreground" : "text-muted-foreground",
                  )}
                >
                  <HugeiconsIcon icon={item.icon} className="size-4" />
                  {item.title}
                </p>
              );
            })}
          </div>

          <div className="relative aspect-3/2 w-full">
            <Image
              src="/landing/map-3d-light.jpg"
              alt=""
              width={2400}
              height={1500}
              sizes="(min-width: 1280px) 944px, 100vw"
              className="size-full object-cover dark:hidden"
            />
            <Image
              src="/landing/map-3d.jpg"
              alt=""
              width={2400}
              height={1500}
              sizes="(min-width: 1280px) 944px, 100vw"
              className="hidden size-full object-cover dark:block"
            />

            <div className="absolute top-4 right-4 hidden w-60 gap-3 rounded-3xl border bg-card p-4 shadow-lg sm:grid">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="type-title">Muara Baru</p>
                  <p className="type-caption text-muted-foreground">Penjaringan</p>
                </div>
                <Badge variant="destructive">#1</Badge>
              </div>
              <p className="font-heading text-3xl font-medium tracking-tight tabular-nums">
                −112 <span className="type-caption text-muted-foreground">mm/yr</span>
              </p>
              <svg viewBox="0 0 200 48" className="h-12 w-full text-brand" fill="none">
                <path
                  d="M0 4 C20 6 30 10 50 14 S80 20 100 26 S140 36 160 40 S190 44 200 46"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="absolute bottom-6 left-1/2 flex w-72 -translate-x-1/2 items-center gap-3 rounded-full border bg-card p-2 pr-5 shadow-lg">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <HugeiconsIcon icon={PlayIcon} className="size-3.5" />
              </span>
              <span className="relative h-1 flex-1 rounded-full bg-border">
                <span className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-foreground" />
              </span>
              <span className="font-heading text-sm font-medium tabular-nums">2035</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
