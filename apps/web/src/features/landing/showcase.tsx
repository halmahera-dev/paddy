"use client";

import { Button } from "@hollou/ui/components/button";
import { cn } from "@hollou/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Fragment, useEffect, useRef, useState } from "react";

import { BlurInHeading } from "@/components/blur-in-heading";
import type { Dictionary, Locale } from "@/lib/i18n";

type Device = "phone" | "laptop";

const devices: Device[] = ["laptop", "phone", "laptop", "phone"];
const Screens = [MapScreen, RankScreen, TodayScreen, InspectScreen] as const;

export function Showcase({ locale, t }: { locale: Locale; t: Dictionary["landing"] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isFocusInside, setIsFocusInside] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const builds = t.showcase.builds;
  const isPaused = isPointerInside || isFocusInside || !isInView;
  const activeBuild = builds[activeIndex];
  const ActiveScreen = Screens[activeIndex] ?? MapScreen;
  const activeDevice = devices[activeIndex] ?? "laptop";

  useEffect(function pauseWhenOffscreen() {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function showNextBuild() {
    setActiveIndex((index) => (index + 1) % builds.length);
  }

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="scroll-mt-24 py-20 sm:py-28"
      onPointerEnter={() => setIsPointerInside(true)}
      onPointerLeave={() => setIsPointerInside(false)}
      onFocusCapture={() => setIsFocusInside(true)}
      onBlurCapture={function resumeWhenFocusLeaves(event) {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusInside(false);
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <BlurInHeading data-paused={isPaused} className="max-w-4xl type-headline text-balance">
          {t.showcase.prefix}{" "}
          {builds.map(function renderPhrase(build, index) {
            const isActive = index === activeIndex;
            const isLast = index === builds.length - 1;
            return (
              <Fragment key={build.label}>
                {isLast ? `${t.showcase.and} ` : null}
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={function choosePhrase() {
                    setActiveIndex(index);
                    setIsAutoplaying(false);
                  }}
                  className={cn(
                    "cursor-pointer text-left transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="relative whitespace-nowrap">
                    {build.phrase}
                    {isActive ? (
                      <span
                        key={activeIndex}
                        aria-hidden
                        onAnimationEnd={isAutoplaying ? showNextBuild : undefined}
                        className={cn(
                          "absolute inset-x-0 bottom-1 h-0.5 origin-left rounded-full bg-brand",
                          isAutoplaying && "autoplay-progress",
                        )}
                      />
                    ) : null}
                  </span>
                  <span className="text-foreground">{isLast ? "." : ","}</span>
                </button>{" "}
              </Fragment>
            );
          })}
        </BlurInHeading>

        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:items-center">
          <div className="grid gap-2">
            <p className="type-label-mono text-muted-foreground">{activeBuild.capability}</p>
            <p className="type-lead text-muted-foreground">{activeBuild.body}</p>
          </div>

          <div className="@container relative flex h-136 flex-col items-center justify-center lg:col-span-2">
            <div className="absolute inset-x-0 inset-y-10 overflow-hidden rounded-3xl bg-background">
              <Image
                src="/planet.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 48rem, 100vw"
                className="object-cover object-right-top"
              />
            </div>
            <div aria-hidden className="absolute -inset-x-6 inset-y-0 neutral-glow lg:-inset-x-20" />
            <DeviceFrame device={activeDevice}>
              <div key={activeIndex} className="size-full fade-in">
                <p className="sr-only">{activeBuild.screenDescription}</p>
                <div aria-hidden inert className="size-full">
                  <ActiveScreen />
                </div>
              </div>
            </DeviceFrame>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-1 text-sm text-muted-foreground">
          <span>{t.showcase.dataNote}</span>
          <Button variant="link" nativeButton={false} render={<Link href="#data" />}>
            {t.showcase.dataLink}
          </Button>
          <Button
            variant="link"
            nativeButton={false}
            render={<Link href={`/${locale}/map`} />}
          >
            {t.seeMap}
          </Button>
        </div>
      </div>
    </section>
  );
}

function DeviceFrame({ device, children }: { device: Device; children: React.ReactNode }) {
  const isPhone = device === "phone";

  return (
    <div
      data-device={device}
      style={
        {
          "--device-width": isPhone ? "18rem" : "calc(100% - 3rem)",
          "--device-height": isPhone ? "32rem" : "20rem",
          "--device-radius": isPhone ? "2.75rem" : "1rem",
          "--screen-width": isPhone ? "16.75rem" : "calc(100cqw - 4rem)",
          "--screen-height": isPhone ? "30.75rem" : "19rem",
          "--screen-radius": isPhone ? "2.125rem" : "0.5rem",
        } as React.CSSProperties
      }
      className="group/device dark relative z-10 h-(--device-height) w-(--device-width) transition-device"
    >
      <div className="absolute inset-0 overflow-hidden rounded-(--device-radius) bg-background shadow-card-lg ring-1 ring-border transition-device">
        <div className="absolute top-1/2 left-1/2 h-(--screen-height) w-(--screen-width) -translate-1/2 overflow-hidden rounded-(--screen-radius) bg-card text-foreground">
          {children}
        </div>
        <span className="absolute top-4 left-1/2 h-6 w-20 -translate-x-1/2 rounded-full bg-background transition-opacity group-data-[device=laptop]/device:opacity-0" />
      </div>
      <span className="absolute -inset-x-6 top-full h-3 rounded-b-xl bg-surface-raised transition-opacity group-data-[device=phone]/device:opacity-0" />
    </div>
  );
}

function AppBar({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3">
      <span className="size-7 shrink-0 rounded-full bg-linear-to-br from-brand to-chart-2" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function MapScreen() {
  return (
    <div className="relative flex size-full flex-col text-xs">
      <AppBar title="Public map" detail="North Jakarta · NISAR" />
      <div className="relative flex-1 overflow-hidden bg-background">
        <div aria-hidden className="absolute inset-0 dot-field text-muted-foreground opacity-50" />
        <span
          aria-hidden
          className="absolute top-1/3 left-1/4 size-16 rounded-full bg-brand/30 blur-xl"
        />
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 rounded-full bg-chart-2/25 blur-2xl"
        />
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-border bg-card/90 p-3 backdrop-blur-sm">
          <p className="font-medium">Ground motion</p>
          <p className="mt-1 text-muted-foreground">Fastest bowls sit along the north coast.</p>
          <div className="mt-3 flex h-2 overflow-hidden rounded-full">
            <span className="flex-1 bg-chart-2" />
            <span className="flex-1 bg-brand" />
            <span className="flex-1 bg-chart-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RankScreen() {
  const bowls = [
    { name: "Bowl 04 · Penjaringan", rate: "112", rank: "1" },
    { name: "Bowl 11 · Pademangan", rate: "97", rank: "2" },
    { name: "Bowl 02 · Koja", rate: "84", rank: "3" },
    { name: "Bowl 19 · Tanjung Priok", rate: "71", rank: "4" },
  ];

  return (
    <div className="flex size-full flex-col pt-8 text-xs">
      <AppBar title="Bowls" detail="Sorted by rate · mm/yr" />
      <ul className="flex flex-1 flex-col gap-2 overflow-hidden p-3">
        {bowls.map(function renderBowl(bowl) {
          return (
            <li
              key={bowl.name}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{bowl.name}</p>
                <p className="text-muted-foreground">Rank {bowl.rank}</p>
              </div>
              <p className="shrink-0 tabular-nums text-brand-text">{bowl.rate}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TodayScreen() {
  const changes = [
    { text: "Bowl 04 moved from 3 to 1", tone: "up" as const },
    { text: "Bowl 19 found in the latest pass", tone: "new" as const },
    { text: "Bowl 07 dropped from 2 to 5", tone: "down" as const },
  ];

  return (
    <div className="flex size-full flex-col text-xs">
      <AppBar title="Today" detail="Pass 12 · due in 4 days" />
      <div className="flex flex-1 flex-col gap-3 overflow-hidden p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-border p-3">
            <p className="text-muted-foreground">Active bowls</p>
            <p className="mt-1 type-title tabular-nums">24</p>
          </div>
          <div className="rounded-2xl border border-border p-3">
            <p className="text-muted-foreground">Fastest rate</p>
            <p className="mt-1 type-title tabular-nums text-brand-text">112</p>
          </div>
        </div>
        <p className="font-medium">Changed since the last pass</p>
        <ul className="grid gap-2">
          {changes.map(function renderChange(change) {
            return (
              <li
                key={change.text}
                className="rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground"
              >
                {change.text}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function InspectScreen() {
  const columns = [
    { title: "Lead", items: ["Bowl 04", "Bowl 11"] },
    { title: "Scheduled", items: ["Bowl 02"] },
    { title: "Inspected", items: ["Bowl 19"] },
  ];

  return (
    <div className="flex size-full flex-col pt-8 text-xs">
      <AppBar title="Inspections" detail="Drag a card to move it" />
      <div className="flex flex-1 gap-2 overflow-hidden p-3">
        {columns.map(function renderColumn(column) {
          return (
            <div key={column.title} className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="type-label-mono text-muted-foreground">{column.title}</p>
              {column.items.map(function renderItem(item) {
                return (
                  <div
                    key={item}
                    className="rounded-xl border border-border bg-secondary px-2 py-2 text-sm font-medium"
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
