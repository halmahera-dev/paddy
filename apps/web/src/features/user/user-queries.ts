import "server-only";

import { auth } from "@hollou/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import type { Locale } from "@/lib/i18n";

export type Session = Awaited<ReturnType<typeof getSession>>;

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export async function requireSession(locale: Locale) {
  const session = await getSession();
  if (!session) {
    redirect(`/${locale}/landing`);
  }
  return session;
}

export async function redirectIfAuthenticated(locale: Locale) {
  if (await getSession()) {
    redirect(`/${locale}`);
  }
}
