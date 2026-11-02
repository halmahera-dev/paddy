import { DataStaysYours } from "@/features/landing/data-stays-yours";
import { Faq } from "@/features/landing/faq";
import { FinalCta } from "@/features/landing/final-cta";
import { Hero } from "@/features/landing/hero";
import { HowToStart } from "@/features/landing/how-to-start";
import { PassCycle } from "@/features/landing/pass-cycle";
import { SelectedWork } from "@/features/landing/selected-work";
import { Showcase } from "@/features/landing/showcase";
import { WhatWeBuild } from "@/features/landing/what-we-build";
import { WhoWeWorkWith } from "@/features/landing/who-we-work-with";
import { SiteFooter } from "@/features/landing/components/site-footer";
import { SiteHeader } from "@/features/landing/components/site-header";
import type { Dictionary, Locale } from "@/lib/i18n";

export function LandingContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.landing;
  const common = dict.common;

  return (
    <div data-page="landing" className="min-h-svh overflow-x-clip bg-background text-foreground">
      <SiteHeader locale={locale} t={t} common={common} />
      <main>
        <Hero locale={locale} t={t} common={common} />
        <Showcase locale={locale} t={t} />
        <WhatWeBuild t={t} />
        <WhoWeWorkWith t={t} />
        <SelectedWork locale={locale} t={t} />
        <HowToStart locale={locale} t={t} common={common} />
        <PassCycle t={t} />
        <DataStaysYours t={t} />
        <Faq t={t} />
        <FinalCta locale={locale} t={t} common={common} />
      </main>
      <SiteFooter locale={locale} t={t} common={common} />
    </div>
  );
}
