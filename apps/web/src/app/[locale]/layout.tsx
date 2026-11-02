import type { Metadata } from "next";

import { Toaster } from "@hollou/ui/components/sonner";
import { TooltipProvider } from "@hollou/ui/components/tooltip";
import { notFound } from "next/navigation";

import { ThemeProvider } from "@/components/theme-provider";
import { hasLocale, locales } from "@/lib/i18n";
import { siteDescription, siteUrl } from "@/lib/seo";

import "../globals.css";

const faviconByEnvironment: Record<string, string> = {
  production: "/logo.png",
  staging: "/favicon-stg.png",
};

// VERCEL_ENV is unset locally and in Docker; Preview and Development also fall back to dev.
const favicon = faviconByEnvironment[process.env.VERCEL_ENV ?? ""] ?? "/favicon-dev.png";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "LANDAS",
  title: {
    default: "LANDAS",
    template: "%s | LANDAS",
  },
  description: siteDescription,
  icons: {
    icon: { url: favicon, type: "image/png", sizes: "512x512" },
  },
  robots: {
    index: false,
    follow: true,
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map(function toParams(locale) {
    return { locale };
  });
}

export default function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  return params.then(function renderLayout({ locale }) {
    if (!hasLocale(locale)) {
      notFound();
    }
    return (
      <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <TooltipProvider>
              {children}
              <Toaster richColors />
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  });
}
