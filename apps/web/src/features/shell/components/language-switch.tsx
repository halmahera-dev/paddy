"use client";

import { LanguageSkillIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@hollou/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@hollou/ui/components/dropdown-menu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { locales, type Locale } from "@/lib/i18n";

const localeLabels: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};

export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.size > 0 ? `?${searchParams}` : "";

  function hrefFor(next: Locale) {
    return `${pathname.replace(`/${locale}`, `/${next}`)}${query}`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
        <HugeiconsIcon icon={LanguageSkillIcon} />
        <span className="sr-only">{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((next) => {
          return (
            <DropdownMenuItem
              key={next}
              disabled={next === locale}
              onClick={() => {
                router.push(hrefFor(next));
              }}
            >
              {localeLabels[next]}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
