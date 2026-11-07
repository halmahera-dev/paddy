import { banDate, getBowlSeriesById, getPublicBowls } from "@/features/bowls/bowls-queries";
import { LandasMap } from "@/features/map/components/landas-map";
import { getDictionary, type Locale } from "@/lib/i18n";

export function MapExperience({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <LandasMap
      locale={locale}
      bowls={getPublicBowls()}
      seriesByBowl={getBowlSeriesById()}
      banDate={banDate}
      labels={{ map: t.map, bowls: t.bowls, common: t.common }}
    />
  );
}
