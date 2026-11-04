import type { Metadata } from "next";

import { SignUpForm } from "@/features/user/components/sign-up-form";
import { getDictionary, toLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Create an account",
};

export default function SignUpPage({ params }: PageProps<"/[locale]/sign-up">) {
  return params.then(({ locale }) => {
    const t = getDictionary(toLocale(locale));
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="type-title">{t.auth.signUpTitle}</h1>
          <p className="text-sm text-balance text-muted-foreground">{t.auth.signUpBody}</p>
        </div>
        <SignUpForm />
      </div>
    );
  });
}
