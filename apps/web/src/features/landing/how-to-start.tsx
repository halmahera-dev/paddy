import { Badge } from "@hollou/ui/components/badge";
import { Button } from "@hollou/ui/components/button";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/features/landing/components/section-heading";
import { PassCycle } from "@/features/landing/pass-cycle";
import { HopFigure } from "@/features/landing/figures/hop-figure";
import { LaunchFigure } from "@/features/landing/figures/launch-figure";
import { OrreryFigure } from "@/features/landing/figures/orrery-figure";
import { signInAsGuest } from "@/features/user/user-actions";
import type { Dictionary, Locale } from "@/lib/i18n";

const figures = [OrreryFigure, HopFigure, LaunchFigure] as const;

export function HowToStart({
  locale,
  t,
  common,
}: {
  locale: Locale;
  t: Dictionary["landing"];
  common: Dictionary["common"];
}) {
  return (
    <section id="services" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading title={t.howToStart.title} isSplit>{t.howToStart.lead}</SectionHeading>

        <Reveal
          as="ul"
          className="mt-12 grid divide-y rounded-4xl shadow-card md:grid-cols-3 md:divide-x md:divide-y-0"
        >
          {t.howToStart.offers.map((offer, index) => {
            const Figure = figures[index] ?? OrreryFigure;
            const isFeatured = "isFeatured" in offer && offer.isFeatured;
            return (
              <li key={offer.name} className="flex flex-col gap-4 p-6 sm:p-8">
                <Figure />
                <div className="flex items-center justify-between gap-3 pt-4">
                  <p className="type-title">{offer.name}</p>
                  {isFeatured ? <Badge variant="brand">{t.howToStart.startHere}</Badge> : null}
                </div>
                <p className="text-muted-foreground">{offer.body}</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  <p className="type-label-mono text-muted-foreground">{offer.terms}</p>
                  {index === 0 ? (
                    <Button
                      variant="link"
                      nativeButton={false}
                      render={<Link href={`/${locale}/map`} />}
                    >
                      {t.seeMap}
                    </Button>
                  ) : null}
                  {isFeatured ? (
                    <form action={signInAsGuest.bind(null, locale)}>
                      <Button type="submit" variant="link">
                        {common.tryAsGuest} →
                      </Button>
                    </form>
                  ) : null}
                  {index === 2 ? (
                    <Button
                      variant="link"
                      nativeButton={false}
                      render={<Link href={`/${locale}/sign-in`} />}
                    >
                      {common.signIn} →
                    </Button>
                  ) : null}
                </div>
                {isFeatured ? (
                  <Button
                    variant="link"
                    nativeButton={false}
                    render={<Link href="#pass-cycle" />}
                    className="self-start"
                  >
                    {t.howToStart.seePass}
                  </Button>
                ) : null}
              </li>
            );
          })}
        </Reveal>

        <PassCycle t={t} />
      </div>
    </section>
  );
}
