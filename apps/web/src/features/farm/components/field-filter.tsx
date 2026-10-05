"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@paddy-field/ui/components/select";
import { useRouter } from "next/navigation";

type FieldOption = { id: string; name: string };

export function FieldFilter({ fields, fieldId }: { fields: FieldOption[]; fieldId: string }) {
  const router = useRouter();
  const items = fields.map((field) => ({ value: field.id, label: field.name }));

  return (
    <Select
      items={items}
      value={fieldId}
      onValueChange={(value) => {
        if (value) router.push(`/?field=${value}`);
      }}
    >
      <SelectTrigger aria-label="Field">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {fields.map((field) => (
            <SelectItem key={field.id} value={field.id}>
              {field.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
