import { Button } from "@hollou/ui/components/button";
import Link from "next/link";
import { Suspense } from "react";

import { AppLogo } from "@/components/app-logo";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitch } from "@/features/shell/components/language-switch";
import type { Dictionary, Locale } from "@/lib/i18n";

export function SiteHeader({
  locale,
  t,
  common,
}: {
  locale: Locale;
  t: Dictionary["landing"];
  common: Dictionary["common"];
}) {
  return (
    <header className="fixed inset-x-4 top-3 z-30 mx-auto flex max-w-6xl items-center gap-1 rounded-full border glass py-1.5 pr-1.5 pl-4">
      <Link
        href={`/${locale}/landing`}
        className="flex items-center gap-2 font-heading text-sm font-semibold"
      >
        <AppLogo />
        {t.brand}
      </Link>
      <nav aria-label="Site" className="ml-auto hidden sm:flex">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href={`/${locale}/map`} />}
        >
          {t.nav.map}
        </Button>
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="#services" />}>
          {t.nav.how}
        </Button>
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="#faq" />}>
          {t.nav.faq}
        </Button>
      </nav>
      <div className="mr-1 ml-auto flex shrink-0 items-center gap-1 sm:ml-0">
        <Button nativeButton={false} render={<Link href={`/${locale}/sign-in`} />}>
          {common.signIn}
        </Button>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Suspense fallback={null}>
          <LanguageSwitch locale={locale} label={common.switchLanguage} />
        </Suspense>
        <ModeToggle />
      </div>
    </header>
  );
}
