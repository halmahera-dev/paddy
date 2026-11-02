import { Badge } from "@hollou/ui/components/badge";

import { BlurInHeading } from "@/components/blur-in-heading";
import { Reveal } from "@/components/reveal";

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <Badge variant="brand">{eyebrow}</Badge>}
      <BlurInHeading className="mt-3 type-headline text-balance">{title}</BlurInHeading>
      {children ? (
        <Reveal as="p" delayMs={80} className="mt-4 type-lead text-muted-foreground">
          {children}
        </Reveal>
      ) : null}
    </div>
  );
}
