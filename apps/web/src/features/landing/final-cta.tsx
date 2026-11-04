import { Button } from "@hollou/ui/components/button";
import Link from "next/link";

import { BlurInHeading } from "@/components/blur-in-heading";
import { Reveal } from "@/components/reveal";
import { signInAsGuest } from "@/features/user/user-actions";
import type { Dictionary, Locale } from "@/lib/i18n";
import "@/features/landing/final-cta.css";

export function FinalCta({
  locale,
  t,
  common,
}: {
  locale: Locale;
  t: Dictionary["landing"];
  common: Dictionary["common"];
}) {
  return (
    <section id="contact" className="relative isolate scroll-mt-24 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 star-field text-muted-foreground opacity-60"
      />
      <div
        aria-hidden
        className="cta-horizon pointer-events-none absolute left-1/2 -z-10 aspect-square -translate-x-1/2 rounded-full bg-card"
      />
      <div className="mx-auto grid max-w-6xl justify-items-center px-4 pt-24 pb-64 text-center sm:px-8 sm:pt-32 sm:pb-80">
        <BlurInHeading className="type-display-xl text-balance">{t.finalCta.title}</BlurInHeading>
        <Reveal as="p" delayMs={80} className="mt-4 max-w-md type-lead text-muted-foreground">
          {t.finalCta.body}
        </Reveal>
        <Reveal delayMs={160} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link href={`/${locale}/sign-in`} />}>
            {common.signIn}
          </Button>
          <form action={signInAsGuest.bind(null, locale)}>
            <Button size="lg" type="submit" variant="outline">
              {common.tryAsGuest}
            </Button>
          </form>
          <Button
            size="lg"
            variant="link"
            nativeButton={false}
            render={<Link href={`/${locale}/map`} />}
          >
            {t.seeMap}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
