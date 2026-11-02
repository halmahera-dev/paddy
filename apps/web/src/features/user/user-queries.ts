import "server-only";

import { auth } from "@hollou/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export type Session = Awaited<ReturnType<typeof getSession>>;

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
}

export async function redirectIfAuthenticated() {
  if (await getSession()) {
    redirect("/");
  }
}
