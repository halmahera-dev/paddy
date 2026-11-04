import { Button } from "@hollou/ui/components/button";
import Link from "next/link";
import * as React from "react";

import { OrbitScene } from "@/features/landing/orbit-scene";
import { signInAsGuest } from "@/features/user/user-actions";
import type { Dictionary, Locale } from "@/lib/i18n";

export function Hero({
  locale,
  t,
  common,
}: {
  locale: Locale;
  t: Dictionary["landing"];
  common: Dictionary["common"];
}) {
  const headline = t.hero.title;

  return (
    <section className="relative flex flex-col lg:block">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 star-field text-muted-foreground opacity-60"
      />
      <div className="pointer-events-none relative z-10 mx-auto flex max-w-6xl items-center px-4 pt-2 pb-8 sm:px-8 lg:min-h-160 lg:pt-32 lg:pb-12">
        <div data-hero-text className="pointer-events-auto grid justify-items-start gap-6 lg:w-[30rem]">
          <h1 className="relative type-display-xl text-balance">
            {headline.split(" ").map((word, index) => {
              return (
                <React.Fragment key={index}>
                  {index > 0 && " "}
                  <span
                    className="blur-in"
                    style={{ "--word-index": index } as React.CSSProperties}
                  >
                    {word}
                  </span>
                </React.Fragment>
              );
            })}
            <span aria-hidden="true" className="glitch-layer text-brand">
              {headline}
            </span>
            <span aria-hidden="true" className="glitch-layer text-chart-2 glitch-mirror">
              {headline}
            </span>
          </h1>
          <p className="max-w-md rise-in type-lead text-muted-foreground">
            {t.hero.body.before}
            <a
              href="https://nisar.jpl.nasa.gov/"
              target="_blank"
              rel="noreferrer"
              className="rounded-xs border-b-2 border-brand/40 bg-brand/15 px-0.5 text-foreground transition-colors duration-160 ease-out hover:bg-brand/25"
            >
              {t.hero.body.nisar}
            </a>
            {t.hero.body.after}
          </p>
          <div className="mt-2 flex rise-in flex-wrap items-center gap-3">
            <Button nativeButton={false} render={<Link href={`/${locale}/sign-in`} />}>
              {common.signIn}
            </Button>
            <form action={signInAsGuest.bind(null, locale)}>
              <Button type="submit" variant="outline">
                {common.tryAsGuest}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <OrbitScene className="relative order-first mt-14 aspect-5/4 w-full lg:absolute lg:inset-0 lg:order-none lg:mt-0 lg:aspect-auto" />
    </section>
  );
}
