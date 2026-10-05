"use client";

import { ChessKnightIcon, Home01Icon, MapsGlobal02Icon } from "@hugeicons/core-free-icons";
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
} from "@paddy-field/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/app-logo";

const items = [
  { title: "Overview", to: "/", icon: Home01Icon },
  { title: "Fields", to: "/maps", icon: MapsGlobal02Icon },
  { title: "Plan", to: "/plan", icon: ChessKnightIcon },
] as const;

export function AppSidebar({ userMenu }: { userMenu: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="mt-1">
            <SidebarMenuButton
              className="text-sidebar-accent-foreground"
              render={<Link href="/" />}
            >
              <AppLogo />
              <span className="text-base font-semibold">One Field</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    isActive={pathname === item.to}
                    render={<Link href={item.to} />}
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
