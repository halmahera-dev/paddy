"use server";

import { auth } from "@hollou/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { defaultLocale, hasLocale } from "@/lib/i18n";

// The guest account is public by design, so its password is not a secret.
const guest = {
  name: "Guest regulator",
  email: "guest@landas.demo",
  password: "landas-guest-demo",
};

export async function signInAsGuest(locale: string) {
  const requestHeaders = await headers();
  try {
    await auth.api.signInEmail({
      body: { email: guest.email, password: guest.password },
      headers: requestHeaders,
    });
  } catch {
    await auth.api.signUpEmail({ body: guest, headers: requestHeaders });
  }
  redirect(`/${hasLocale(locale) ? locale : defaultLocale}`);
}
