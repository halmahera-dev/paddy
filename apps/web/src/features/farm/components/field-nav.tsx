import { SidebarMenuItem, SidebarMenuSkeleton } from "@paddy-field/ui/components/sidebar";

import { cropName } from "../crop-progress";
import { getFarms } from "../farm-queries";
import { adviseField, byAttentionFirst } from "../field-advice";
import { FieldNavItems } from "./field-nav-items";

export async function FieldNav() {
  const farms = await getFarms();
  const fields = farms.toSorted(byAttentionFirst).map(function toNavItem(farm) {
    return {
      id: farm.id,
      name: farm.name,
      crop: cropName[farm.cropRecord.crop],
      needsAttention: adviseField(farm).needsAttention,
    };
  });

  return <FieldNavItems fields={fields} />;
}

export function FieldNavSkeleton() {
  return Array.from({ length: 3 }, (_, index) => (
    <SidebarMenuItem key={index}>
      <SidebarMenuSkeleton showIcon />
    </SidebarMenuItem>
  ));
}
