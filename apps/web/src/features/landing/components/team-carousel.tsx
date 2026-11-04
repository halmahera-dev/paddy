"use client";

import { cn } from "@hollou/ui/lib/utils";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type Member = {
  name: string;
  title: string;
  photo: StaticImageData;
  showLabel: string;
  portraitAlt: string;
};

export function TeamCarousel({ members, chooseLabel }: { members: Member[]; chooseLabel: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isFocusInside, setIsFocusInside] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const isPaused = isPointerInside || isFocusInside || !isInView;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // On phones the row scrolls sideways, so keep the focused portrait visible.
  useEffect(
    () => {
      const list = listRef.current;
      const item = list?.children[activeIndex];
      if (!list || !item || list.scrollWidth <= list.clientWidth) return;
      const offset = item.getBoundingClientRect().left - list.getBoundingClientRect().left;
      list.scrollBy({
        left: offset - parseFloat(getComputedStyle(list).paddingLeft),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    },
    [activeIndex],
  );

  function showNextMember() {
    setActiveIndex((index) => (index + 1) % members.length);
  }

  return (
    <div
      className="mx-auto max-w-6xl"
      onFocusCapture={() => setIsFocusInside(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusInside(false);
      }}
    >
      <ul
        ref={listRef}
        onPointerEnter={() => setIsPointerInside(true)}
        onPointerLeave={() => setIsPointerInside(false)}
        className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-4 sm:scroll-px-8 sm:px-8 lg:h-112 lg:overflow-visible lg:pb-0"
      >
        {members.map((member, index) => {
          return (
            <li
              key={member.name}
              data-active={index === activeIndex}
              className="group relative h-88 w-72 max-w-3/4 shrink-0 pressable snap-start overflow-hidden rounded-4xl bg-muted transition-resize-press motion-reduce:transition-none lg:h-auto lg:w-auto lg:max-w-none lg:min-w-0 lg:shrink lg:grow lg:data-[active=true]:grow-3"
            >
              <button
                type="button"
                aria-pressed={index === activeIndex}
                aria-label={member.showLabel}
                onClick={() => setActiveIndex(index)}
                className="absolute inset-0 cursor-pointer text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring"
              >
                <Image
                  src={member.photo}
                  alt={member.portraitAlt}
                  fill
                  placeholder="blur"
                  quality={90}
                  sizes="(min-width: 1024px) 24rem, (min-width: 400px) 18rem, 72vw"
                  className="object-cover object-top transition-transform duration-500 ease-in-out group-data-[active=true]:scale-105 motion-reduce:transition-none"
                />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-44 caption-blur" />
                <div className="absolute inset-x-0 bottom-0 min-h-25 bg-linear-to-t from-black/60 to-transparent p-4">
                  <p className="font-heading text-2xl font-semibold text-white">{member.name}</p>
                  <p className="text-sm text-white/80">{member.title}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        role="group"
        aria-label={chooseLabel}
        data-paused={isPaused}
        className="mt-6 flex justify-center"
      >
        {members.map((member, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={member.name}
              type="button"
              aria-label={member.showLabel}
              aria-pressed={isActive}
              onClick={() => setActiveIndex(index)}
              className="flex min-h-11 min-w-11 items-center justify-center p-1.5"
            >
              <span
                className={cn(
                  "relative block h-2 overflow-hidden rounded-full bg-muted-foreground/30 transition-all duration-300 ease-in-out motion-reduce:transition-none",
                  isActive ? "w-8" : "w-2",
                )}
              >
                {isActive ? (
                  <span
                    key={activeIndex}
                    onAnimationEnd={showNextMember}
                    className="absolute inset-0 origin-left autoplay-progress rounded-full bg-brand"
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
