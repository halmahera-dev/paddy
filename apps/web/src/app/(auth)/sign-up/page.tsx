import type { Metadata } from "next";

import { SignUpForm } from "@/features/user/components/sign-up-form";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Create your One Field account.",
};

export default function SignUpPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="type-title">Create your account</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      <SignUpForm />
    </div>
  );
}
