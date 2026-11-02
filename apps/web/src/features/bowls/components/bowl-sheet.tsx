"use client";

import { Sheet, SheetContent, SheetTitle } from "@hollou/ui/components/sheet";
import { usePathname, useRouter } from "next/navigation";

// The drawer slot keeps its last state on soft navigation, so it only opens on a bowl URL.
export function BowlSheet({ title, children }: { title: string; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = /\/bowls\/[^/]+$/.test(pathname);

  function closeSheet(open: boolean) {
    if (!open) {
      router.back();
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetTitle className="sr-only">{title}</SheetTitle>
        <div className="p-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
