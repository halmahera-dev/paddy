"use client";

import { Button } from "@hollou/ui/components/button";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";

const EDGE_PX = 2;

export function WhatWeBuildScroller({
  heading,
  children,
}: {
  heading: React.ReactNode;
  children: React.ReactNode;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const targetLeftRef = useRef(0);
  const scrollingRef = useRef(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(function watchScrollEdges() {
    const maybeList = listRef.current;
    if (!maybeList) return;
    const list: HTMLUListElement = maybeList;

    function syncEdges() {
      const max = list.scrollWidth - list.clientWidth;
      if (!scrollingRef.current) targetLeftRef.current = list.scrollLeft;
      setCanScrollPrev(list.scrollLeft > EDGE_PX);
      setCanScrollNext(max - list.scrollLeft > EDGE_PX);
    }

    function onScroll() {
      if (scrollingRef.current && Math.abs(list.scrollLeft - targetLeftRef.current) > EDGE_PX) {
        return;
      }
      scrollingRef.current = false;
      syncEdges();
    }

    function releaseScroll() {
      scrollingRef.current = false;
      syncEdges();
    }

    syncEdges();
    list.addEventListener("scroll", onScroll, { passive: true });
    list.addEventListener("scrollend", releaseScroll);
    list.addEventListener("pointerdown", releaseScroll);
    const observer = new ResizeObserver(releaseScroll);
    observer.observe(list);

    return function stopWatchingScrollEdges() {
      list.removeEventListener("scroll", onScroll);
      list.removeEventListener("scrollend", releaseScroll);
      list.removeEventListener("pointerdown", releaseScroll);
      observer.disconnect();
    };
  }, []);

  function scrollByCard(direction: -1 | 1) {
    const list = listRef.current;
    const item = list?.querySelector("li");
    if (!list || !item) return;

    const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;
    const step = item.getBoundingClientRect().width + gap;
    const max = Math.max(0, list.scrollWidth - list.clientWidth);
    const base = scrollingRef.current ? targetLeftRef.current : list.scrollLeft;
    const left = Math.min(max, Math.max(0, base + direction * step));
    if (Math.abs(left - base) <= EDGE_PX) return;

    targetLeftRef.current = left;
    scrollingRef.current = true;
    setCanScrollPrev(left > EDGE_PX);
    setCanScrollNext(max - left > EDGE_PX);
    list.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  function onControlKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    scrollByCard(event.key === "ArrowLeft" ? -1 : 1);
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">{heading}</div>
      <ul
        id="what-we-build-list"
        ref={listRef}
        className="mt-12 flex w-full scroll-fade-x snap-x snap-mandatory card-row-inset scrollbar-none gap-4 overflow-x-auto overscroll-x-contain py-1 md:gap-6"
      >
        {children}
      </ul>
      <div className="mx-auto mt-6 flex w-full max-w-6xl justify-center px-4 sm:px-8">
        <div
          role="group"
          aria-label="Scroll functions"
          className="flex shrink-0 gap-2"
          onKeyDown={onControlKeyDown}
        >
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-label="Previous"
            aria-controls="what-we-build-list"
            disabled={!canScrollPrev}
            onClick={function showPrevious() {
              scrollByCard(-1);
            }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-label="Next"
            aria-controls="what-we-build-list"
            disabled={!canScrollNext}
            onClick={function showNext() {
              scrollByCard(1);
            }}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-5" />
          </Button>
        </div>
      </div>
    </>
  );
}
