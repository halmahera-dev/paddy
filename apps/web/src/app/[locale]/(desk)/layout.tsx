import { SidebarInset, SidebarProvider } from "@hollou/ui/components/sidebar";

import { AppSidebar } from "@/features/shell/components/app-sidebar";
import { NavUser } from "@/features/shell/components/nav-user";
import { requireSession } from "@/features/user/user-queries";
import { getDictionary, toLocale } from "@/lib/i18n";

export default function DeskLayout({ children, drawer, params }: LayoutProps<"/[locale]">) {
  return params.then(async function renderDesk({ locale: rawLocale }) {
    const locale = toLocale(rawLocale);
    const session = await requireSession(locale);
    const t = getDictionary(locale);

    return (
      <SidebarProvider className="h-svh min-h-0 overflow-hidden">
        <AppSidebar
          locale={locale}
          labels={t.nav}
          userMenu={
            <NavUser
              name={session.user.name}
              email={session.user.email}
              locale={locale}
              labels={t.common}
            />
          }
        />
        <SidebarInset className="overflow-x-hidden overflow-y-auto overscroll-contain">
          {children}
        </SidebarInset>
        {drawer}
      </SidebarProvider>
    );
  });
}
