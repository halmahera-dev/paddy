# DESIGN.md

Live showcase: `/design-system` in `apps/web`. When the tokens in `packages/ui/src/styles/globals.css` change, update this file in the same change.

This file maps the One Field design language to shadcn/ui tokens. The values match `packages/ui/src/styles/globals.css`.

## 1. Character

- **Warm and playful, not loud.** Cream paper background, warm taupe neutrals, near-black ink. One bright accent: emerald.
- **Soft and round.** Pills for every button and nav item. Big radius (24px) on cards. No sharp corners.
- **Floating layers.** Elements float on the cream page with soft, wide, low-alpha shadows and glass blur. No hard borders.
- **Illustration first.** 3D characters and stickers carry the personality. UI chrome stays quiet so the art can speak.
- **Tactile motion.** Things lift on hover, press down on click, and enter with a short staggered fade.
- **Casual voice.** Short, friendly copy. Emoji are allowed in body copy ("make your product go brrr! 🚀").

## 2. Color

### Raw palette

| Name | Value | Use |
| --- | --- | --- |
| cream-50 | `#FBF9EF` | Page background, floating navbar (80% + blur) |
| white | `#FFFFFF` | Cards, pricing card, secondary pill |
| stone-100 | `#EEECE3` | Icon button background |
| stone-200 | `#E8E5DC` | Tooltip background |
| stone-250 | `#E5E2D9` | Glass nav tiles (30% + blur) |
| sand-100 | `#F6ECD3` | Warm section background |
| sand-200 | `#EFE4C8` | Inset panel (carousel wrapper) |
| taupe-300 | `#D4CFC8` | Secondary text on taupe cards |
| taupe-400 | `#A8A095` | Muted heading accent ("+40 founders") |
| taupe-500 | `#A69E94` | Avatar ring / fill on dark cards |
| taupe-600 | `#8C857B` | Dark testimonial card |
| ink-900 | `oklch(20.8% 0.042 265.755)` (slate-900) | Headings, primary pill |
| ink-800 | `oklch(27.9% 0.041 260.031)` (slate-800) | Card titles, tooltip text |
| ink-700 | `oklch(37.2% 0.044 257.287)` (slate-700) | Body text |
| ink-600 | `oklch(44.6% 0.043 257.281)` (slate-600) | Nav links |
| ink-500 | `oklch(55.4% 0.046 257.417)` (slate-500) | Captions, meta |
| emerald-600 | `oklch(59.6% 0.145 163.225)` | Accent: active nav, hover fill, focus ring |
| emerald-500 | `oklch(69.6% 0.17 162.48)` | Dot separators, small highlights |
| emerald-700 | `oklch(50.8% 0.118 165.612)` | Small accent text and links on cream (better contrast) |
| red-500 / red-100 | `oklch(63.7% 0.237 25.331)` / `oklch(93.6% 0.032 17.717)` | Urgency badge ("1 spot left!") |
| button-black | `#222 → #000` gradient | Main CTA ("Book a call") |

Glow gradient (special CTA border only): `#3b82f6 → #06b6d4 → #f59e0b → #f97316 → #ec4899`.

### Rules

- Neutrals are **warm** (cream, sand, taupe). Text is **cool** (slate). Keep this contrast; do not use warm text on warm surfaces.
- Emerald is for state and emphasis: active, hover, focus, links. Do not fill large areas with it.
- The primary action is black, not emerald.
- For small text, use emerald-700. White text on emerald-600 is fine for bold button and pill labels.
- Use red only for urgency and errors.

### shadcn tokens

The live values are in `packages/ui/src/styles/globals.css` (`:root` and `.dark`). Role mapping:

| Role | Light | Dark |
| --- | --- | --- |
| `--background` | cream `#fbf9ef` | `#1a1815` |
| `--foreground` | ink-900 | cream |
| `--card`, `--popover` | white | `#24211d` |
| `--primary` (main action) | ink-900 | cream |
| `--secondary` | stone-100 `#eeece3` | `#2e2a25` |
| `--muted` | stone-200 `#e8e5dc` | `#2e2a25` |
| `--muted-foreground` | `oklch(48% 0.045 257.3)` | taupe-400 |
| `--accent` (quiet hover wash, menu highlight) | stone-200 | `#34302a` |
| `--brand` / `--brand-foreground` | emerald-600 / white | same |
| `--brand-text` (small emerald text) | emerald-700 | emerald-400 |
| `--destructive` | red-600 | red-400 |
| `--border` / `--input` | `#e5e2d9` / `#dcd8cd` | white 8% / 12% |
| `--ring`, `--sidebar-primary` | emerald-600 | same |
| `--chart-1` … `--chart-5` | emerald-600, sky-500, amber-500, emerald-400, emerald-800 (seasons: rainy, dry, drought) | same |
| `--surface-sand`, `--surface-taupe`, `--text-taupe` | sand-200, taupe-600, taupe-400 | derived dark |

Tailwind classes: `bg-brand`, `text-brand-text`, `bg-surface-sand`, `bg-surface-taupe`, `text-text-taupe`.

**Why emerald is `--brand`, not `--accent`:** shadcn menus, selects, and comboboxes use `--accent` to highlight the focused item. An emerald highlight on every menu item is too loud, so `--accent` stays a quiet warm wash and emerald has its own token.

### Dark mode

The `.dark` values are derived from the light theme: warm near-black surfaces, cream text, the same emerald. The app defaults to dark.

## 3. Typography

- **Headings:** Plus Jakarta Sans (`font-heading`). Its round, friendly shapes fit the playful look.
- **Body and UI:** Geist (`font-sans`).
- **Mono:** Geist Mono (`font-mono`) for numbers in tables, codes, and IDs.

Already set in `packages/ui/src/styles/globals.css`:

```css
@theme inline {
  --font-sans: "Geist Variable", sans-serif;
  --font-heading: "Plus Jakarta Sans Variable", sans-serif;
  --font-mono: "Geist Mono Variable", monospace;
}
```

The type scale is a set of `type-*` utilities in `packages/ui/src/styles/globals.css`. Use them, not `text-*` sizes, for headings and lead text. (`cn()` treats unknown `text-*` classes as colors and can drop them.)

| Token | Spec | Use |
| --- | --- | --- |
| `type-display` | clamp 36–60px / 1.1 / 800 / -0.025em · Plus Jakarta Sans | Page hero. Two-tone: second line in `text-text-taupe` |
| `type-headline` | clamp 20–36px / 1.25 / 700 / -0.025em · Plus Jakarta Sans | Section heads |
| `type-title` | 18px / 1.5 / 600 · Plus Jakarta Sans | Card and block titles |
| `type-lead` | clamp 16–20px / 1.625 / 500 · Geist | Intro paragraphs. Bold run-in phrase with `<strong>` |
| `text-sm` | 14px / 1.43 / 400 · Geist | Body and controls |
| `type-caption` | 14px / 1.43 · Geist, with `text-muted-foreground` | Meta and help text |
| `font-mono` | 14px · Geist Mono | IDs, codes, coordinates |

`CardTitle` uses `font-heading text-base font-semibold`. Buttons use `text-sm`; `default` and `brand` are `font-semibold tracking-tight`, the others `font-medium`.

Rules:
- Headings use Plus Jakarta Sans, heavy (700–800), with `tracking-tight`. Body uses Geist at medium (500) for lead text and regular (400) for dense UI.
- Variable fonts: any weight from 200 to 800 works for both families.
- Use `leading-relaxed` for paragraphs, `leading-tight` for headings.
- Display headings often have a two-tone pattern: ink line + taupe line.

## 4. Shape

`--radius` is `0.625rem`, so the scale is `rounded-md` 8px, `rounded-lg` 10px, `rounded-xl` 14px, `rounded-2xl` 18px, `rounded-3xl` 22px, `rounded-4xl` 26px.

| Token | Value | Use |
| --- | --- | --- |
| `rounded-md` | 8px | Small accents |
| `rounded-xl` | 14px | Tooltips |
| `rounded-2xl` | 18px | Menu and select items, textarea, accordion, alerts, images in cards |
| `rounded-3xl` | 22px | Popovers, menus, select trigger, badges, media cards, nav tiles |
| `rounded-4xl` | 26px | Cards, dialogs, buttons, inputs (a pill on 40px controls) |
| `rounded-full` | pill | Tabs triggers, switches, avatars, navbar |
| `rounded-[2rem]` | 32px | Sunken section panel |

**Image card pattern:** white card with `p-3 rounded-3xl`, image inside with `rounded-2xl`, title below with `type-title pt-4 px-1`. This gives a "framed photo" look.

## 5. Elevation

No borders on cards. Depth comes from soft shadows.

```css
@theme inline {
  --shadow-card: 0 4px 35px -10px rgb(0 0 0 / 0.1);    /* pricing card */
  --shadow-card-lg: 0 20px 40px -12px rgb(0 0 0 / 0.1); /* portfolio card */
  --shadow-inset: inset 0 2px 8px rgb(0 0 0 / 0.04);   /* sunken sand panel */
}
```

- **Glass:** the `glass` utility (in `packages/ui/src/styles/globals.css`): background at 70%, `blur(20px) saturate(170%)`, a 15% white inset top highlight, and a `0 8px 24px` black 12% drop shadow. It turns solid for `prefers-reduced-transparency` and `prefers-contrast: more`. Bars (navbar) add a hairline `border border-black/6`. Buttons never get a border.
- **Sunken panel:** `bg-surface-sand rounded-[2rem] shadow-inset`. Use to group a carousel or a section.
| Token | Use |
| --- | --- |
| `shadow-inset` | Sunken sand panel |
| `shadow-sm` | Buttons at rest |
| `shadow-card` | Cards |
| `glass` | Navbars, outline buttons |
| `shadow-card-lg` | Media cards |
| `shadow-lg` | Popovers, menus, select lists |
| `shadow-xl` | Dialogs, hover lift |

- **Floating layers** (popovers, menus, select lists, dialogs): `ring-1 ring-foreground/5` (`/10` in dark) instead of a border. Menus and select lists are frosted: `bg-popover/70` with `backdrop-blur` and `backdrop-saturate-150`. Focused items get `bg-foreground/10`.
- **Dark mode:** cards drop the shadow and use `ring-1 ring-foreground/10`.
- **Dialog backdrop:** `bg-black/30` with `backdrop-blur-sm`.
- Borders only as hairlines: `hr` in `border-border`, accordion edges, and the glass navbar edge. No borders on buttons.

## 6. Layout

- Page container: `container mx-auto px-4`, content `max-w-6xl` / `max-w-7xl`. Text blocks `max-w-4xl` (centered) or `max-w-lg` (side text).
- Sections: generous vertical space, `py-16` to `py-24`. Pricing cards `max-w-[490px]`.
- Navigation floats: pill navbar fixed at top with `pt-4 px-4` gap from the edge. Desktop has a fixed side rail of square glass tiles (`size-24 rounded-3xl`) with tooltips to the right.
- Fixed corner chips: logo top-left, CTA top-right, small pill bottom-right, all `top-6/left-6` style offsets.
- Alternating two-column rows (text / illustration) on `lg`, stacked on mobile with the illustration first.
- Decorative tilt: stickers and title images use `-rotate-6`, `-rotate-3`, `rotate-12`. Overlap them with negative margins.

## 7. Components

### Button

| Variant | Use | Look |
| --- | --- | --- |
| `default` | Main action ("Book a call") | Ink pill, soft top gradient, lifts and gains `shadow-xl` on hover |
| `brand` | Confirm a field action ("Start planting") | Emerald pill, same lift |
| `neutral` | Inverted action on media | Foreground fill, background text, no lift |
| `secondary` | Second action | Stone fill, warm wash on hover |
| `outline` | Actions over maps and media | `glass` pill, no border |
| `ghost` | Nav links, toolbar actions | No fill, warm wash on hover |
| `destructive` | Delete | Red tint |
| `link` | Inline links | Underline on hover |

All buttons press down with `active:scale-[0.98]` (not when they open a popup). Focus is `ring-3 ring-ring/30`. The rainbow `glow` CTA is not built; add it only for a marketing page.

Sizes: `xs` 24px, `sm` 32px, `default` 40px, `lg` 44px, plus `icon` sizes. These are dense on purpose, because One Field is an app.

### Fields

Inputs, selects, and textareas have no visible border: `bg-input/50` fill with a transparent border that turns `border-ring` on focus, plus `ring-3 ring-ring/30`. Invalid: `border-destructive` + `ring-destructive/20`.

| Control | Height | Radius |
| --- | --- | --- |
| Input | 40px (`h-10`, `px-4`) | `rounded-4xl` |
| Select trigger | 36px default, 32px `sm` | `rounded-3xl` |
| Textarea | `min-h-16`, grows with content | `rounded-2xl` |
| Switch | 20×44px | `rounded-full`; checked is `bg-primary` |

### Card

`bg-card rounded-4xl shadow-card`, no border. Spacing is `--card-spacing` (24px, 16px for `size="sm"`). Variants:
- **light:** white bg, slate text.
- **taupe:** `bg-surface-taupe text-surface-taupe-foreground`.
- **media:** `rounded-3xl p-3 shadow-card-lg`, image `rounded-2xl aspect-4/3`, title below.

### Dialog and popovers

- **Dialog:** `rounded-4xl bg-popover p-6 shadow-xl`, `max-w-md`, zoom-in 95% on open.
- **Popover:** `rounded-3xl p-4 shadow-lg`.
- **Menus and select lists:** frosted `bg-popover/70`, `rounded-3xl p-1.5`, items `rounded-2xl px-3 py-2 font-medium`.

### Tabs

List is a `bg-secondary` pill. Triggers are `rounded-full`, `text-foreground/60` at rest; the active one gets `bg-background`. The `line` variant drops the fill and shows a 2px underline.

### Accordion

`rounded-2xl border`, items split by `border-b`. No fill on the open item.

### Badge

`h-5 rounded-3xl text-xs font-semibold`. Variants: `brand` (emerald tint, for good status), `destructive` (red tint, for urgency), `secondary`, `outline`, `blur`.

### Tooltip

`rounded-xl bg-muted text-xs font-semibold text-foreground shadow-md`. Small, for app density.

### Navbar

Pill: `glass rounded-full border border-black/6`, same as the briefing page header. Links are ghost pills. Active link has an emerald pill behind it that moves between items.

### Lists

Feature list: check icon + `text-gray-800 font-medium`, `space-y-4`. Separate inline items (footer links) with small emerald dots: `size-1.5 rounded-full bg-emerald-500`.

### Logos

Partner logos: `opacity-60 hover:opacity-100 transition-opacity`.

## 8. Motion

| Token | Value |
| --- | --- |
| Fast | 200ms (tooltips, color, button lift) |
| Popups | 100ms (dialogs, popovers, menus: fade + zoom 95%) |
| Base | 300ms (buttons, cards, nav tiles) |
| Slow | 500ms (image zoom inside a card) |
| Easing | `cubic-bezier(0, 0, 0.2, 1)` (ease-out) |

Patterns:
- **Lift on hover:** `-translate-y-0.5` + bigger shadow. Tiles use `scale-105` (+ `translate-x-1.5` for the side rail).
- **Press:** `active:scale-[0.98]` (buttons), `active:scale-95` (glow CTA).
- **Entrance:** fade + small rise when in view. Stagger with delays of 0.1s, 0.15s, 0.25s.
- **Marquee:** endless horizontal image strip, images `rounded-2xl`.
- **Delight:** illustrations pop out and float near the cursor. Keep this kind of effect to marketing pages, not app UI.
- Respect `prefers-reduced-motion`: turn off marquee, mouse trail, glow loop, and entrance rise.

## 9. Imagery and voice

- 3D character illustrations, stickers, and looping videos are the main visual content. UI frames them; it does not compete.
- Image-based titles with a slight tilt are part of the look. In an app, use real text with the display style instead.
- Copy is short, casual, and confident. Emoji are OK in marketing body copy. Keep app UI copy plain.

## 10. Do and don't

**Do**
- Cream background, white floating cards, soft shadows.
- Pill buttons with black gradient as the main action.
- Emerald only for hover, active, focus, and small highlights.
- Bold, tight headings and medium-weight body text.

**Don't**
- Don't use 1px borders around cards.
- Don't use sharp or small radius on interactive elements.
- Don't use pure gray neutrals; use the warm stone/taupe set.
- Don't use the rainbow glow on more than one element per view.
