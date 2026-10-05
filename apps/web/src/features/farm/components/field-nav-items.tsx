"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@paddy-field/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

type FieldNavItem = { id: string; name: string; crop: string; needsAttention: boolean };

export function FieldNavItems({ fields }: { fields: FieldNavItem[] }) {
  const pathname = usePathname();

  return fields.map((field) => {
    const href = `/fields/${field.id}`;
    return (
      <SidebarMenuItem key={field.id}>
        <SidebarMenuButton isActive={pathname === href} render={<Link href={href} />}>
          <span
            className={`size-2 shrink-0 rounded-full ${field.needsAttention ? "bg-destructive" : "bg-primary"}`}
          />
          <span className="sr-only">
            {field.needsAttention ? "Needs attention:" : "No problems:"}
          </span>
          <span className="truncate">{field.name}</span>
          <span className="ml-auto text-xs text-muted-foreground">{field.crop}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  });
}
