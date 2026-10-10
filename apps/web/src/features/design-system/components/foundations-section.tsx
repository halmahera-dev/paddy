import { cn } from "@/lib/utils";

import { ColorPair } from "./color-pair";
import { ShowcaseBlock, ShowcaseSection } from "./showcase-section";

const colorPairs = [
  { name: "Page", background: "background", foreground: "foreground" },
  { name: "Card", background: "card", foreground: "card-foreground" },
  { name: "Popover", background: "popover", foreground: "popover-foreground" },
  { name: "Primary action", background: "primary", foreground: "primary-foreground" },
  { name: "Brand emerald", background: "brand", foreground: "brand-foreground" },
  { name: "Secondary", background: "secondary", foreground: "secondary-foreground" },
  { name: "Muted", background: "muted", foreground: "muted-foreground" },
  { name: "Accent wash", background: "accent", foreground: "accent-foreground" },
  { name: "Taupe card", background: "surface-taupe", foreground: "surface-taupe-foreground" },
  { name: "Brand text on page", background: "background", foreground: "brand-text" },
  { name: "Destructive on page", background: "background", foreground: "destructive" },
  { name: "Taupe text on page", background: "background", foreground: "text-taupe" },
];

const paletteGroups = [
  {
    name: "Surfaces",
    swatches: [
      { name: "Cream", token: "background" },
      { name: "White", token: "card" },
      { name: "Stone", token: "secondary" },
      { name: "Stone wash", token: "muted" },
      { name: "Sand", token: "surface-sand" },
      { name: "Taupe", token: "surface-taupe" },
    ],
  },
  {
    name: "Ink and brand",
    swatches: [
      { name: "Ink", token: "foreground" },
      { name: "Primary", token: "primary" },
      { name: "Emerald", token: "brand" },
      { name: "Emerald text", token: "brand-text" },
      { name: "Taupe text", token: "text-taupe" },
      { name: "Destructive", token: "destructive" },
    ],
  },
  {
    name: "Lines and charts",
    swatches: [
      { name: "Border", token: "border" },
      { name: "Input", token: "input" },
      { name: "Ring", token: "ring" },
      { name: "Chart 1", token: "chart-1" },
      { name: "Chart 2", token: "chart-2" },
      { name: "Chart 3", token: "chart-3" },
      { name: "Chart 4", token: "chart-4" },
      { name: "Chart 5", token: "chart-5" },
    ],
  },
];

const typeTokens = [
  {
    token: "type-display",
    spec: "36–60px / 1.1 / 800 / -0.025em · Plus Jakarta Sans",
    use: "Page hero",
    className: "type-display",
    sample: "Every field, one view.",
  },
  {
    token: "type-headline",
    spec: "20–36px / 1.25 / 700 / -0.025em · Plus Jakarta Sans",
    use: "Section heads",
    className: "type-headline",
    sample: "Plan the next rice season",
  },
  {
    token: "type-title",
    spec: "18px / 1.5 / 600 · Plus Jakarta Sans",
    use: "Card and block titles",
    className: "type-title",
    sample: "Sawah Barat · 2.4 ha",
  },
  {
    token: "type-lead",
    spec: "16–20px / 1.625 / 500 · Geist",
    use: "Intro paragraphs",
    className: "type-lead",
    sample: "Rain is coming on Thursday, so plant the seedlings before then.",
  },
  {
    token: "text-sm",
    spec: "14px / 1.43 / 400 · Geist",
    use: "Body and controls",
    className: "text-sm",
    sample: "The field has 82% soil moisture and no pest reports.",
  },
  {
    token: "type-caption",
    spec: "14px / 1.43 · Geist, muted",
    use: "Meta and help text",
    className: "type-caption text-muted-foreground",
    sample: "Updated 12 minutes ago",
  },
  {
    token: "font-mono",
    spec: "14px · Geist Mono",
    use: "IDs, codes, coordinates",
    className: "font-mono text-sm",
    sample: "-7.7956, 110.3695",
  },
];

const radiusSteps = [
  { token: "rounded-md", value: "8px", use: "Menu items", className: "rounded-md" },
  { token: "rounded-xl", value: "14px", use: "Tooltips", className: "rounded-xl" },
  { token: "rounded-2xl", value: "18px", use: "Alerts, items, images in cards", className: "rounded-2xl" },
  { token: "rounded-3xl", value: "22px", use: "Popovers, menus", className: "rounded-3xl" },
  { token: "rounded-4xl", value: "26px", use: "Cards, buttons, inputs (pill)", className: "rounded-4xl" },
  { token: "rounded-[2rem]", value: "32px", use: "Sunken section panel", className: "rounded-[2rem]" },
];

const elevationSteps = [
  { token: "shadow-inset", use: "Sunken sand panel", className: "bg-surface-sand shadow-inset" },
  { token: "shadow-sm", use: "Buttons at rest", className: "bg-card shadow-sm" },
  { token: "shadow-card", use: "Cards", className: "bg-card shadow-card" },
  { token: "glass", use: "Navbars, outline buttons", className: "glass" },
  { token: "shadow-card-lg", use: "Media cards", className: "bg-card shadow-card-lg" },
  { token: "shadow-xl", use: "Hover lift", className: "bg-card shadow-xl" },
];

const motionTokens = [
  { token: "duration-200", value: "200ms", use: "Tooltips, color, button lift" },
  { token: "duration-300", value: "300ms", use: "Cards, nav tiles" },
  { token: "duration-500", value: "500ms", use: "Image zoom inside a card" },
  { token: "ease-out", value: "cubic-bezier(0, 0, 0.2, 1)", use: "All enter and hover motion" },
];

export function FoundationsSection() {
  return (
    <ShowcaseSection
      id="foundations"
      title="Foundations"
      description="Warm surfaces, cool ink, one emerald accent. Every pair below shows its live contrast."
    >
      <ShowcaseBlock
        title="Color roles"
        description="Each surface with its text color. Small text needs AA (4.5:1)."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colorPairs.map((pair) => (
            <ColorPair key={pair.name} {...pair} />
          ))}
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock title="Palette">
        <div className="flex flex-col gap-6">
          {paletteGroups.map((group) => (
            <div key={group.name} className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">{group.name}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                {group.swatches.map((swatch) => (
                  <div key={swatch.token} className="flex flex-col gap-2">
                    <div
                      className="h-16 rounded-2xl ring-1 ring-foreground/10"
                      style={{ backgroundColor: `var(--${swatch.token})` }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{swatch.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{swatch.token}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Typography"
        description="Plus Jakarta Sans for headings, Geist for body and UI, Geist Mono for data."
      >
        <div className="flex flex-col divide-y rounded-4xl bg-card px-6 shadow-card">
          {typeTokens.map((type) => (
            <div
              key={type.token}
              className="grid gap-2 py-5 md:grid-cols-[12rem_1fr] md:items-baseline md:gap-6"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-xs text-foreground">{type.token}</span>
                <span className="text-xs text-muted-foreground">{type.use}</span>
                <span className="text-xs text-muted-foreground">{type.spec}</span>
              </div>
              <p className={cn("truncate", type.className)}>{type.sample}</p>
            </div>
          ))}
        </div>
        <p className="max-w-prose text-sm leading-relaxed text-foreground">
          <strong>Your fields, in plain words.</strong> One Field reads satellite and weather data
          and turns it into a short plan for each plot. Open{" "}
          <a href="#recipes" className="font-medium text-brand-text underline underline-offset-4">
            the field card
          </a>{" "}
          to see the advice, or copy the plot ID <code className="font-mono">SW-0142</code> to
          share it with your team.
        </p>
      </ShowcaseBlock>

      <div className="grid gap-10 lg:grid-cols-2">
        <ShowcaseBlock title="Radius" description="Soft and round. No sharp corners on controls.">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {radiusSteps.map((step) => (
              <div key={step.token} className="flex flex-col gap-2">
                <div className={cn("h-20 border-2 border-brand/40 bg-brand/10", step.className)} />
                <span className="font-mono text-xs text-foreground">
                  {step.token} · {step.value}
                </span>
                <span className="text-xs text-muted-foreground">{step.use}</span>
              </div>
            ))}
          </div>
        </ShowcaseBlock>

        <ShowcaseBlock title="Elevation" description="Soft, wide, low-alpha shadows. No card borders.">
          <div className="grid grid-cols-2 gap-6 rounded-[2rem] bg-muted/50 p-6 sm:grid-cols-3">
            {elevationSteps.map((step) => (
              <div key={step.token} className="flex flex-col gap-2">
                <div className={cn("h-20 rounded-3xl", step.className)} />
                <span className="font-mono text-xs text-foreground">{step.token}</span>
                <span className="text-xs text-muted-foreground">{step.use}</span>
              </div>
            ))}
          </div>
        </ShowcaseBlock>
      </div>

      <ShowcaseBlock
        title="Motion"
        description="Things lift on hover and press down on click. Hover the tiles to try it."
      >
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col divide-y rounded-4xl bg-card px-6 shadow-card">
            {motionTokens.map((motion) => (
              <div key={motion.token} className="grid grid-cols-[8rem_1fr] gap-4 py-3 text-sm">
                <span className="font-mono text-xs text-foreground">{motion.token}</span>
                <span className="text-muted-foreground">
                  {motion.value} · {motion.use}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="size-24 rounded-3xl bg-muted/60 backdrop-blur-sm transition-all duration-300 ease-out hover:translate-x-1.5 hover:scale-105 hover:bg-card motion-reduce:transition-none" />
            <div className="size-24 rounded-3xl bg-card shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] motion-reduce:transition-none" />
          </div>
        </div>
      </ShowcaseBlock>
    </ShowcaseSection>
  );
}
