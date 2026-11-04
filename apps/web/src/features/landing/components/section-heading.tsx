import { Badge } from "@hollou/ui/components/badge";
import { cn } from "@hollou/ui/lib/utils";

import { BlurInHeading } from "@/components/blur-in-heading";
import { Reveal } from "@/components/reveal";

export function SectionHeading({
  eyebrow,
  title,
  isSplit = false,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  isSplit?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("max-w-2xl", isSplit && "lg:grid lg:max-w-none lg:grid-cols-2 lg:items-end lg:gap-16")}>
      <div>
        {eyebrow && <Badge variant="brand">{eyebrow}</Badge>}
        <BlurInHeading className="mt-3 type-headline text-balance">{title}</BlurInHeading>
      </div>
      {children ? (
        <Reveal as="p" delayMs={80} className={cn("mt-4 type-lead text-muted-foreground", isSplit && "lg:mt-0")}>
          {children}
        </Reveal>
      ) : null}
    </div>
  );
}
