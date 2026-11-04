import { LandingContent } from "@/features/landing/components/landing-content";
import { getDictionary, toLocale } from "@/lib/i18n";

export default function LandingPage({ params }: PageProps<"/[locale]/landing">) {
  return params.then(({ locale: rawLocale }) => {
    const locale = toLocale(rawLocale);
    const dict = getDictionary(locale);

    return <LandingContent locale={locale} dict={dict} />;
  });
}
