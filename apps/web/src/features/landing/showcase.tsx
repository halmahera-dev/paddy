"use client";

import { Badge } from "@hollou/ui/components/badge";
import { Button } from "@hollou/ui/components/button";
import { cn } from "@hollou/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { AppLogo } from "@/components/app-logo";
import { SectionHeading } from "@/features/landing/components/section-heading";
import { fill, type Dictionary, type Locale } from "@/lib/i18n";

type NavKey = keyof Dictionary["nav"];

const steps: { Screen: () => React.ReactNode; activeNav: NavKey }[] = [
  { Screen: MapScreen, activeNav: "map" },
  { Screen: RankScreen, activeNav: "bowls" },
  { Screen: EvidenceScreen, activeNav: "bowls" },
  { Screen: InspectScreen, activeNav: "inspections" },
  { Screen: TodayScreen, activeNav: "today" },
];

const navOrder: NavKey[] = ["today", "bowls", "inspections", "map"];

export function Showcase({
  locale,
  t,
  nav,
}: {
  locale: Locale;
  t: Dictionary["landing"];
  nav: Dictionary["nav"];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isFocusInside, setIsFocusInside] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const isPaused = isPointerInside || isFocusInside || !isInView;
  const activeStep = t.showcase.steps[activeIndex];
  const { Screen, activeNav } = steps[activeIndex];

  useEffect(function pauseWhenOffscreen() {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function showNextStep() {
    setActiveIndex((index) => (index + 1) % steps.length);
  }

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="scroll-mt-24 py-24 sm:py-32"
      onPointerEnter={() => setIsPointerInside(true)}
      onPointerLeave={() => setIsPointerInside(false)}
      onFocusCapture={() => setIsFocusInside(true)}
      onBlurCapture={function resumeWhenFocusLeaves(event) {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusInside(false);
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading title={t.showcase.title} isSplit>
          {t.showcase.lead}
        </SectionHeading>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <ol data-paused={isPaused} className="grid content-start lg:col-span-5">
            {t.showcase.steps.map(function renderStep(step, index) {
              const isActive = index === activeIndex;
              return (
                <li key={step.name} className="relative border-b border-border first:border-t">
                  <button
                    type="button"
                    aria-current={isActive ? "step" : undefined}
                    onClick={function chooseStep() {
                      setActiveIndex(index);
                      setIsAutoplaying(false);
                    }}
                    className={cn(
                      "grid w-full cursor-pointer gap-1 py-4 text-left transition-colors duration-160 ease-out focus-visible:outline-2 focus-visible:outline-ring",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="type-label-mono">
                      {fill(t.showcase.stepLabel, { n: index + 1 })}
                    </span>
                    <span className="type-title">{step.name}</span>
                    <span className="text-muted-foreground">{step.body}</span>
                  </button>
                  {isActive ? (
                    <span
                      key={activeIndex}
                      aria-hidden
                      onAnimationEnd={isAutoplaying ? showNextStep : undefined}
                      className={cn(
                        "absolute inset-x-0 -bottom-px h-0.5 origin-left bg-brand",
                        isAutoplaying && "autoplay-progress",
                      )}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>

          <div className="grid content-start gap-3 lg:col-span-7">
            <div className="flex h-112 flex-col overflow-hidden rounded-4xl border bg-card">
              <div className="flex items-center gap-1 border-b border-border px-3 py-2">
                <span className="hidden items-center gap-2 pr-3 font-heading text-sm font-semibold sm:flex">
                  <AppLogo />
                  {t.brand}
                </span>
                {navOrder.map(function renderNavItem(key) {
                  return (
                    <span
                      key={key}
                      className={cn(
                        "rounded-full px-3 py-1 text-sm",
                        key === activeNav ? "bg-accent text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {nav[key]}
                    </span>
                  );
                })}
              </div>
              <div key={activeIndex} className="relative min-h-0 flex-1 fade-in">
                <p className="sr-only">{activeStep.screenDescription}</p>
                <div aria-hidden inert className="size-full">
                  <Screen />
                </div>
              </div>
            </div>
            <p className="type-label-mono text-muted-foreground">{t.showcase.exampleNote}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-1 text-sm text-muted-foreground">
          <span>{t.showcase.dataNote}</span>
          <Button variant="link" nativeButton={false} render={<Link href="#data" />}>
            {t.showcase.dataLink}
          </Button>
          <Button variant="link" nativeButton={false} render={<Link href={`/${locale}/map`} />}>
            {t.seeMap}
          </Button>
        </div>
      </div>
    </section>
  );
}

function MapScreen() {
  return (
    <div className="absolute inset-y-0 left-0 aspect-3/2 min-w-full">
      <Image
        src="/landing/map-3d-light.jpg"
        alt=""
        fill
        sizes="(min-width: 1024px) 700px, 100vw"
        className="object-cover dark:hidden"
      />
      <Image
        src="/landing/map-3d.jpg"
        alt=""
        fill
        sizes="(min-width: 1024px) 700px, 100vw"
        className="hidden object-cover dark:block"
      />
      <div className="absolute top-2/5 left-3/10 grid -translate-1/2 justify-items-center gap-2">
        <span className="size-20 rounded-full border-2 border-brand bg-brand/15" />
        <span className="absolute top-full mt-2 rounded-full border bg-card px-3 py-1 text-sm font-medium whitespace-nowrap">
          Bowl 04
        </span>
      </div>
    </div>
  );
}

function RankScreen() {
  const bowls = [
    { name: "Bowl 04 · Penjaringan", rate: "112" },
    { name: "Bowl 11 · Pademangan", rate: "97" },
    { name: "Bowl 02 · Koja", rate: "84" },
    { name: "Bowl 19 · Tanjung Priok", rate: "71" },
  ];

  return (
    <ul className="grid gap-2 p-4">
      {bowls.map(function renderBowl(bowl, index) {
        const isTarget = index === 0;
        return (
          <li
            key={bowl.name}
            className={cn(
              "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3",
              isTarget ? "border-brand bg-surface-raised" : "border-border",
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="w-4 font-mono text-xs text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <p className="truncate text-sm font-medium">{bowl.name}</p>
            </div>
            <p className="shrink-0 text-sm tabular-nums text-brand-text">
              {bowl.rate} <span className="text-muted-foreground">mm/yr</span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function EvidenceScreen() {
  return (
    <div className="grid gap-4 p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="type-title">Bowl 04</p>
          <p className="type-caption text-muted-foreground">Penjaringan</p>
        </div>
        <Badge variant="outline">Lead, not proof</Badge>
      </div>
      <p className="font-heading text-4xl font-medium tracking-tight tabular-nums">
        −112 <span className="type-caption text-muted-foreground">mm/yr</span>
      </p>
      <svg viewBox="0 0 400 120" fill="none" className="w-full" strokeLinecap="round">
        <path d="M0 14 C60 18 100 30 150 44 S190 56 200 58" className="stroke-chart-2" strokeWidth="2" />
        <path d="M200 58 C250 72 300 84 400 106" className="stroke-brand" strokeWidth="2" />
        <line x1="200" x2="200" y1="0" y2="120" strokeDasharray="3 4" className="stroke-border" />
      </svg>
      <div className="flex gap-4 type-label-mono text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-chart-2" />
          Sentinel-1
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-brand" />
          NISAR
        </span>
      </div>
    </div>
  );
}

function InspectScreen() {
  const columns = [
    { title: "Lead", items: ["Bowl 11", "Bowl 02"] },
    { title: "Scheduled", items: ["Bowl 04"] },
    { title: "Inspected", items: ["Bowl 19"] },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {columns.map(function renderColumn(column) {
        return (
          <div key={column.title} className="grid content-start gap-2">
            <p className="type-label-mono text-muted-foreground">{column.title}</p>
            {column.items.map(function renderItem(item) {
              return (
                <p
                  key={item}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-sm font-medium",
                    item === "Bowl 04" ? "border-brand bg-surface-raised" : "border-border",
                  )}
                >
                  {item}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function TodayScreen() {
  return (
    <div className="grid gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="type-title">Pass 13</p>
        <Badge variant="brand">Pump found</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border p-4">
          <p className="type-caption text-muted-foreground">Pass 12 · Bowl 04</p>
          <p className="mt-1 font-heading text-3xl font-medium tabular-nums">112</p>
        </div>
        <div className="rounded-2xl border border-brand p-4">
          <p className="type-caption text-muted-foreground">Pass 13 · Bowl 04</p>
          <p className="mt-1 font-heading text-3xl font-medium tabular-nums text-brand-text">78</p>
        </div>
      </div>
      <p className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground">
        Bowl 04 slowed after the visit. Bowl 11 is next.
      </p>
    </div>
  );
}
