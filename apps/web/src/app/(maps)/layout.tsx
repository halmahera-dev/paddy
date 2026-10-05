import { SidebarInset, SidebarProvider } from "@paddy-field/ui/components/sidebar";
import { Suspense } from "react";

import { MapsSidebar } from "@/components/sidebar/maps-sidebar";
import NavUser from "@/components/sidebar/nav-user";
import { FieldNav, FieldNavSkeleton } from "@/features/farm/components/field-nav";
import { requireSession } from "@/features/user/user-queries";

export default async function MapsLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <SidebarProvider className="relative h-svh min-h-0 overflow-hidden">
      <MapsSidebar
        fieldNav={
          <Suspense fallback={<FieldNavSkeleton />}>
            <FieldNav />
          </Suspense>
        }
        userMenu={
          <NavUser name={session.user.name} email={session.user.email} image={session.user.image} />
        }
      />
      <SidebarInset className="absolute inset-0 z-0 overflow-x-hidden overflow-y-auto overscroll-contain">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
