import { DataStaysYours } from "@/features/landing/data-stays-yours";
import { Faq } from "@/features/landing/faq";
import { FinalCta } from "@/features/landing/final-cta";
import { Hero } from "@/features/landing/hero";
import { HeroDashboard } from "@/features/landing/hero-dashboard";
import { HowToStart } from "@/features/landing/how-to-start";
import { Problem } from "@/features/landing/problem";
import { Showcase } from "@/features/landing/showcase";
import { Team } from "@/features/landing/team";
import { SiteFooter } from "@/features/landing/components/site-footer";
import { SiteHeader } from "@/features/landing/components/site-header";
import type { Dictionary, Locale } from "@/lib/i18n";

export function LandingContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.landing;
  const common = dict.common;

  return (
    <div data-page="landing" className="min-h-svh overflow-x-clip bg-background text-foreground">
      <SiteHeader locale={locale} t={t} common={common} />
      <main className="[&>section:not(:first-child)]:border-t [&>section:not(:first-child)]:border-rule">
        <Hero locale={locale} t={t} common={common} />
        <HeroDashboard nav={dict.nav} />
        <Problem t={t} />
        <Showcase locale={locale} t={t} nav={dict.nav} />
        <Team t={t} />
        <HowToStart locale={locale} t={t} common={common} />
        <DataStaysYours t={t} />
        <Faq t={t} />
        <FinalCta locale={locale} t={t} common={common} />
      </main>
      <SiteFooter locale={locale} t={t} common={common} />
    </div>
  );
}
