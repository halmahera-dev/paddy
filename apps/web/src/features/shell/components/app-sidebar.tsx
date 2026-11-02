"use client";

import {
  DashboardSquare01Icon,
  ListViewIcon,
  MapsGlobal02Icon,
  TaskDaily01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@hollou/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/app-logo";
import type { Dictionary, Locale } from "@/lib/i18n";

export function AppSidebar({
  locale,
  labels,
  userMenu,
}: {
  locale: Locale;
  labels: Dictionary["nav"];
  userMenu: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const home = `/${locale}`;
  const items = [
    { title: labels.today, href: home, icon: DashboardSquare01Icon },
    { title: labels.bowls, href: `${home}/bowls`, icon: ListViewIcon },
    { title: labels.inspections, href: `${home}/inspections`, icon: TaskDaily01Icon },
    { title: labels.map, href: `${home}/map`, icon: MapsGlobal02Icon },
  ];

  function isActive(href: string) {
    return href === home ? pathname === home : pathname.startsWith(href);
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="mt-1">
            <SidebarMenuButton render={<Link href={home} />}>
              <AppLogo />
              <span className="font-heading text-sm font-semibold">LANDAS</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    render={
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        onClick={() => setOpenMobile(false)}
                      />
                    }
                  >
                    <HugeiconsIcon icon={item.icon} />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{userMenu}</SidebarFooter>
    </Sidebar>
  );
}
