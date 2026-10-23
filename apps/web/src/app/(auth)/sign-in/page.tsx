import type { Metadata } from "next";

import { SignInForm } from "@/features/user/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your One Field account.",
};

export default function SignInPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="type-title">Login</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <SignInForm />
    </div>
  );
}
