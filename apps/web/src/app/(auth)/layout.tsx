import { AppLogo } from "@/components/app-logo";
import { ModeToggle } from "@/components/mode-toggle";
import { redirectIfAuthenticated } from "@/features/user/user-queries";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await redirectIfAuthenticated();

  return (
    <div className="grid min-h-svh lg:grid-cols-12">
      <div className="col-span-7 flex flex-col gap-4 p-6 md:p-10">
        <div className="flex w-full justify-center">
          <header className="flex w-full max-w-sm justify-center gap-2">
            <span className="flex items-center gap-2 font-medium">
              <AppLogo />
              One Field
            </span>
            <div className="ml-auto">
              <ModeToggle />
            </div>
          </header>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      <div className="relative col-span-5 m-4 hidden rounded-4xl bg-muted lg:block">
        <img
          src="/ascii-magic.webp"
          alt=""
          className="absolute inset-0 h-full w-full rounded-4xl object-cover object-center dark:brightness-[0.6]"
        />
      </div>
    </div>
  );
}
