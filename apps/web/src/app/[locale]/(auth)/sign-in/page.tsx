import type { Metadata } from "next";

import { SignInForm } from "@/features/user/components/sign-in-form";
import { getDictionary, toLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage({ params }: PageProps<"/[locale]/sign-in">) {
  return params.then(function renderSignIn({ locale }) {
    const t = getDictionary(toLocale(locale));
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="type-title">{t.auth.signInTitle}</h1>
          <p className="text-sm text-balance text-muted-foreground">{t.auth.signInBody}</p>
        </div>
        <SignInForm />
      </div>
    );
  });
}
