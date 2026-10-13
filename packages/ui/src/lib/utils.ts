import { createCn } from "cn/config";

export const cn = createCn({
  extend: {
    classGroups: {
      "type-scale": ["type-display", "type-headline", "type-title", "type-lead", "type-caption"],
    },
    conflictingClassGroups: {
      "type-scale": ["font-size", "font-weight", "font-family", "leading", "tracking"],
    },
  },
});
