import type { Metadata } from "next";

import { ModeToggle } from "@/components/mode-toggle";
import { ComponentsSection } from "@/features/design-system/components/components-section";
import { ControlsSection } from "@/features/design-system/components/controls-section";
import { FoundationsSection } from "@/features/design-system/components/foundations-section";
import { RecipesSection } from "@/features/design-system/components/recipes-section";

export const metadata: Metadata = {
  title: "Design System",
};

const sectionLinks = [
  { href: "#foundations", label: "Foundations" },
  { href: "#actions", label: "Actions" },
  { href: "#inputs", label: "Inputs" },
  { href: "#data-display", label: "Data" },
  { href: "#overlays", label: "Overlays" },
  { href: "#recipes", label: "Recipes" },
];

export default function DesignSystemPage() {
  return (
    <div id="top" className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-40 px-4 pt-4">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-black/6 glass py-2 pr-2 pl-6">
          <span className="font-heading font-extrabold tracking-tight">One Field DS</span>
          <div className="hidden items-center gap-4 lg:flex">
            {sectionLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand-text"
              >
                {link.label}
              </a>
            ))}
          </div>
          <ModeToggle />
        </nav>
      </header>

      <main>
        <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 pt-20 pb-8 text-center">
          <span className="rounded-full bg-brand/12 px-3 py-1 text-xs font-semibold text-brand-text">
            Themed from DESIGN.md
          </span>
          <h1 className="type-display">
            Warm, round, and
            <br />
            <span className="text-brand">easy to trust.</span>
          </h1>
          <p className="max-w-2xl type-lead text-muted-foreground">
            The One Field design system. Cream surfaces, soft floating cards, pill controls, ink
            actions, and one emerald accent for state.
          </p>
        </section>
        <FoundationsSection />
        <ControlsSection />
        <ComponentsSection />
        <RecipesSection />
      </main>
    </div>
  );
}
