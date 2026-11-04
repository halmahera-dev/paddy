import Link from "next/link";

import type { Dictionary, Locale } from "@/lib/i18n";

export function SiteFooter({
  locale,
  t,
  common,
}: {
  locale: Locale;
  t: Dictionary["landing"];
  common: Dictionary["common"];
}) {
  const links = [
    { href: `/${locale}/map`, label: t.nav.map },
    { href: "#services", label: t.nav.how },
    { href: "#faq", label: t.nav.faq },
    { href: `/${locale}/sign-in`, label: common.signIn },
    { href: `/${locale}/design-system`, label: "Design System" },
  ] as const;

  return (
    <footer className="bg-muted">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3 sm:px-8">
        <div className="grid content-start gap-2">
          <p className="flex items-center gap-2 font-heading text-sm font-semibold">
            <span aria-hidden className="size-2.5 rounded-full bg-brand" />
            {t.brand}
          </p>
          <p className="text-sm text-muted-foreground">{t.footer.blurb}</p>
        </div>

        <nav aria-label="Footer" className="grid content-start gap-2">
          <p className="text-xs font-semibold text-muted-foreground">{t.footer.pages}</p>
          {links.map((link) => {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm transition-colors duration-150 ease-out hover:text-brand-text"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="grid content-start gap-2">
          <p className="text-xs font-semibold text-muted-foreground">{t.footer.data}</p>
          <p className="text-sm text-muted-foreground">{t.attribution}</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-8">
        <p className="text-xs text-muted-foreground">{t.footer.copyright}</p>
      </div>
    </footer>
  );
}
