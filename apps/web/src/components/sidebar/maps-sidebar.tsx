"use client";

import { ArrowLeft02Icon, MapsGlobal02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@paddy-field/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/app-logo";

const items = [{ title: "World Map", to: "/maps", icon: MapsGlobal02Icon }] as const;

export function MapsSidebar({
  userMenu,
  fieldNav,
}: {
  userMenu: React.ReactNode;
  fieldNav: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Sidebar variant="floating">
      <SidebarHeader data-maps-sidebar>
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
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/" />}>
                  <HugeiconsIcon icon={ArrowLeft02Icon} />
                  Overview
                </SidebarMenuButton>
              </SidebarMenuItem>
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
        <SidebarGroup>
          <SidebarGroupLabel>Fields</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{fieldNav}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{userMenu}</SidebarFooter>
    </Sidebar>
  );
}
