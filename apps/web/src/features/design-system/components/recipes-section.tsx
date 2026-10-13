"use client";

import { ArrowRight01Icon, StarIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, AvatarFallback } from "@paddy-field/ui/components/avatar";
import { Badge } from "@paddy-field/ui/components/badge";
import { Button } from "@paddy-field/ui/components/button";
import { Card, CardContent } from "@paddy-field/ui/components/card";
import { Separator } from "@paddy-field/ui/components/separator";

import { cn } from "@/lib/utils";

import { ShowcaseBlock, ShowcaseSection } from "./showcase-section";

const planFeatures = [
  "Daily field advice",
  "Rain and pest alerts",
  "Season plan for every plot",
  "Shared team workspace",
];

const testimonials = [
  {
    quote:
      "We used to guess when to plant. Now the whole cooperative follows one plan, and our yield went up.",
    name: "Sari Wulandari",
    role: "Chair, Koperasi Tani Makmur",
    initials: "SW",
    variant: "light",
  },
  {
    quote: "The rain alerts alone saved our seedlings twice this season.",
    name: "Budi Santoso",
    role: "Farmer, Sleman",
    initials: "BS",
    variant: "taupe",
  },
] as const;

const fieldPhotos = [
  { title: "Sawah Barat · Tillering", tone: "from-brand/30 to-brand/10" },
  { title: "Sawah Timur · Booting", tone: "from-surface-taupe/40 to-surface-taupe/10" },
  { title: "Kebun Selatan · Harvest", tone: "from-chart-3/40 to-chart-3/10" },
];

const footerLinks = ["Fields", "Plan", "Briefing", "Help"];

function GuidelineExample({
  kind,
  rule,
  children,
}: {
  kind: "Do" | "Don't";
  rule: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-32 flex-wrap items-center justify-center gap-3 rounded-4xl bg-background p-6 ring-1 ring-foreground/5">
        {children}
      </div>
      <p className="text-sm">
        <span className={cn("font-semibold", kind === "Do" ? "text-brand-text" : "text-destructive")}>
          {kind}.
        </span>{" "}
        <span className="text-muted-foreground">{rule}</span>
      </p>
    </div>
  );
}

export function RecipesSection() {
  return (
    <>
      <ShowcaseSection
        id="guidelines"
        title="Do and don't"
        description="The rules that are easiest to break."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <GuidelineExample kind="Do" rule="Use ink for the main action. Emerald marks state.">
            <Button>Save plan</Button>
            <Badge variant="brand">Saved</Badge>
          </GuidelineExample>
          <GuidelineExample kind="Don't" rule="Fill large areas or every button with emerald.">
            <Button variant="brand">Save plan</Button>
            <Button variant="brand">Cancel</Button>
            <Button variant="brand">Export</Button>
          </GuidelineExample>
          <GuidelineExample kind="Do" rule="Float white cards on cream with a soft shadow.">
            <div className="h-20 w-40 rounded-4xl bg-card shadow-card" />
          </GuidelineExample>
          <GuidelineExample kind="Don't" rule="Put hard 1px borders and sharp corners on cards.">
            <div className="h-20 w-40 rounded-sm border-2 border-foreground/40 bg-card" />
          </GuidelineExample>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="recipes"
        title="Recipes"
        description="The DESIGN.md patterns, built from tokens and components only."
        className="bg-surface-sand/40"
      >
        <ShowcaseBlock title="Floating navbar" description="Glass bar with a hairline edge, ghost links, and an ink CTA.">
          <nav className="flex items-center justify-between gap-4 glass rounded-full border border-black/6 px-4 py-3 sm:px-8">
            <span className="font-heading text-lg font-extrabold tracking-tight">One Field</span>
            <div className="hidden items-center gap-1 md:flex">
              <Button variant="ghost">Fields</Button>
              <Button variant="ghost" className="bg-brand text-brand-foreground hover:bg-brand/90">
                Plan
              </Button>
              <Button variant="ghost">Briefing</Button>
            </div>
            <Button>
              Get started
              <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
            </Button>
          </nav>
        </ShowcaseBlock>

        <div className="grid gap-10 lg:grid-cols-2">
          <ShowcaseBlock title="Pricing card">
            <Card className="mx-auto w-full max-w-md">
              <CardContent className="flex flex-col gap-6 px-8 py-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Start from</span>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="type-display">Rp 0</span>
                    <span className="text-muted-foreground">/ field</span>
                    <Badge variant="destructive">Free this season!</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Everything a small farm needs. 🌾</p>
                </div>
                <Separator />
                <ul className="flex flex-col gap-3">
                  {planFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 font-medium">
                      <HugeiconsIcon icon={Tick02Icon} className="size-5 text-brand-text" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-3">
                  <Button size="lg" className="w-full">
                    Start your plan
                  </Button>
                  <Button size="lg" variant="secondary" className="w-full">
                    Let&apos;s chat!
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ShowcaseBlock>

          <ShowcaseBlock title="Testimonials" description="Two-tone heading, light and taupe cards.">
            <h3 className="type-display">
              Trusted by
              <br />
              <span className="text-text-taupe">+40 cooperatives</span>
            </h3>
            <div className="flex flex-col gap-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className={cn(
                    "flex flex-col gap-4 rounded-4xl p-6 shadow-lg",
                    testimonial.variant === "taupe"
                      ? "bg-surface-taupe text-surface-taupe-foreground"
                      : "bg-card text-card-foreground",
                  )}
                >
                  <div className="flex gap-1 text-brand" aria-label="5 out of 5 stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <HugeiconsIcon key={star} icon={StarIcon} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed">{testimonial.quote}</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold">{testimonial.name}</span>
                      <span className="text-sm opacity-75">{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ShowcaseBlock>
        </div>

        <ShowcaseBlock
          title="Sunken panel with media cards"
          description="Sand panel, white framed cards, image inside with a smaller radius."
        >
          <div className="flex gap-6 overflow-x-auto rounded-[2rem] bg-surface-sand p-6 shadow-inset sm:p-10">
            {fieldPhotos.map((photo) => (
              <div
                key={photo.title}
                className="group w-64 shrink-0 rounded-3xl bg-card p-3 shadow-card-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="aspect-4/3 overflow-hidden rounded-2xl">
                  <div
                    className={cn(
                      "size-full bg-linear-to-br transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none",
                      photo.tone,
                    )}
                  />
                </div>
                <p className="px-1 pt-4 pb-1 type-title">{photo.title}</p>
              </div>
            ))}
          </div>
        </ShowcaseBlock>
      </ShowcaseSection>

      <footer className="dark bg-background py-12 text-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4">
          <p className="text-sm text-muted-foreground">Dark band: same components, dark tokens.</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {footerLinks.map((link, index) => (
              <span key={link} className="flex items-center gap-4">
                {index > 0 && <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />}
                <a
                  href="#top"
                  className="text-sm font-medium text-foreground transition-colors hover:text-brand-text"
                >
                  {link}
                </a>
              </span>
            ))}
          </nav>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button>Book a call</Button>
            <Button variant="brand">Start planting</Button>
            <Button variant="secondary">Read the briefing</Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © 2026 One Field · We make fields grow brrr!
          </p>
        </div>
      </footer>
    </>
  );
}
