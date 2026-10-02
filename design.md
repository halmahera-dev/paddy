# One Field UI Design

This file describes the current One Field UI styles. It covers shared tokens, components, images, and motion. Values come from the current code. Component classes can override the shared defaults.

## Source Files

- [Shared colors, fonts, and corner sizes](packages/ui/src/styles/globals.css)
- [Long text styles](packages/ui/src/styles/typeset.css)
- [App materials, display text, and motion](apps/web/src/app/globals.css)
- [Shared components](packages/ui/src/components)
- [Theme settings](apps/web/src/app/layout.tsx)

When these styles change, update this file in the same change.

## Visual Style

One Field uses a green accent, neutral surfaces, rounded controls, and light borders. Light mode has an off-white background and white cards. Dark mode has a near-black background and lighter dark cards. The app defaults to dark mode. The theme control offers Light, Dark, and System.

Most controls use small, medium-weight text. Larger headings use a separate font. Glass surfaces use a partly transparent fill, background blur, and a light shadow. Painted images add cream and deep teal to the visual style.

## Colors

Keep colors in OKLCH, as defined in the CSS. Use the named color tokens in components so each theme gets the correct value.

### Shared Tokens

| CSS token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--background` | `oklch(0.985 0 0)` | `oklch(0.145 0 0)` | Base surface |
| `--foreground` | `oklch(0.252 0 0)` | `oklch(0.961 0 0)` | Main text |
| `--card` | `oklch(1 0 0)` | `oklch(0.252 0 0)` | Card fill |
| `--card-foreground` | `oklch(0.252 0 0)` | `oklch(0.961 0 0)` | Card text |
| `--popover` | `oklch(1 0 0)` | `oklch(0.252 0 0)` | Menus and dialogs |
| `--popover-foreground` | `oklch(0.252 0 0)` | `oklch(0.961 0 0)` | Menu and dialog text |
| `--primary` | `oklch(59.6% 0.145 163.225)` | Same | Green actions and accents |
| `--primary-foreground` | `oklch(1 0 0)` | Same | Text on primary fill |
| `--secondary` | `oklch(0.961 0 0)` | `oklch(0.293 0 0)` | Secondary controls |
| `--secondary-foreground` | `oklch(0.252 0 0)` | `oklch(0.961 0 0)` | Secondary control text |
| `--muted` | `oklch(0.976 0 0)` | `oklch(0.269 0 0)` | Quiet fills |
| `--muted-foreground` | `oklch(0.524 0 0)` | `oklch(0.715 0 0)` | Supporting text |
| `--accent` | `oklch(0.961 0 0)` | `oklch(0.293 0 0)` | Control states |
| `--accent-foreground` | `oklch(0.252 0 0)` | `oklch(0.961 0 0)` | Text on accent fill |
| `--destructive` | `oklch(0.539 0.182 33.719)` | `oklch(0.708 0.186 31.679)` | Errors and destructive actions |
| `--border` | `oklch(0.898 0 0)` | `oklch(1 0 0 / 12%)` | Borders and separators |
| `--input` | `oklch(0.898 0 0)` | `oklch(1 0 0 / 15%)` | Input fill and strokes |
| `--ring` | `oklch(0.252 0 0)` | `oklch(0.961 0 0)` | Focus rings |

`--accent` is a neutral control color. The green brand color is `--primary`.

### Navigation Tokens

| CSS token | Light | Dark |
| --- | --- | --- |
| `--sidebar` | `oklch(1 0 0)` | `oklch(0.185 0 0)` |
| `--sidebar-foreground` | `oklch(0.252 0 0)` | `oklch(0.961 0 0)` |
| `--sidebar-primary` | `oklch(59.6% 0.145 163.225)` | Same |
| `--sidebar-primary-foreground` | `oklch(1 0 0)` | Same |
| `--sidebar-accent` | `oklch(0.87 0 0 / 0.4)` | `oklch(0.37 0 0 / 0.4)` |
| `--sidebar-accent-foreground` | `oklch(0.252 0 0)` | `oklch(0.961 0 0)` |
| `--sidebar-border` | `oklch(0.898 0 0)` | `oklch(1 0 0 / 12%)` |
| `--sidebar-ring` | `oklch(0.252 0 0)` | `oklch(0.961 0 0)` |

### Chart and Image Accents

The five shared chart colors are the same in both themes:

| CSS token | Value |
| --- | --- |
| `--chart-1` | `oklch(0.81 0.117 11.638)` |
| `--chart-2` | `oklch(0.645 0.246 16.439)` |
| `--chart-3` | `oklch(0.586 0.253 17.585)` |
| `--chart-4` | `oklch(0.514 0.222 16.935)` |
| `--chart-5` | `oklch(0.455 0.188 13.697)` |

These chart tokens form a pink-to-red scale. Individual charts can define other colors.

The app also defines `cream` as `oklch(0.97 0.025 90)` and `deep-teal` as `oklch(0.27 0.05 200)`. These support text and overlays on painted images.

## Typography

### Fonts

| Utility | Font | Use |
| --- | --- | --- |
| `font-sans` | Geist Variable | Body text, labels, and controls; default font |
| `font-heading` | Plus Jakarta Sans Variable | Display text, card titles, and long text headings |
| `font-mono` | Geist Mono Variable | Code and monospace text |

Fonts are loaded from local Fontsource packages through the shared CSS.

### Common Text Sizes

Sizes below assume a 16px root font size.

| Utility | Size / line height | Common use |
| --- | --- | --- |
| `text-xs` | 12px / 16px | Badges and small notes |
| `text-sm` | 14px / 20px | Controls, card descriptions, and navigation |
| `text-base` | 16px / 24px | Body text and card titles |
| `text-lg` | 18px / 28px | Supporting display text |
| `text-2xl` | 24px / 32px | Summary values |
| `text-3xl` | 30px / 36px | Larger values and numbers |

Regular text uses weight 400. Labels often use 500. Main headings and summary values often use 600. Selected brand text uses 700. Numeric summaries use `tabular-nums` where needed.

### Display Text

| Utility | Size | Line height | Letter spacing |
| --- | --- | --- | --- |
| `text-display-xl` | `clamp(3rem, 9vw, 7rem)` | 1 | `-0.045em` |
| `text-display` | `clamp(2.25rem, 5vw, 3.5rem)` | 1.05 | `-0.035em` |
| `text-display-sm` | `clamp(1.5rem, 3.5vw, 2.25rem)` | 1.25 | `-0.02em` |

### Long Text

The `.typeset` class uses Geist body text and Plus Jakarta Sans headings. Body line height is 1.75. Heading weight is 600. Its default body size is 18px below 48rem and 16px from 48rem, assuming a 16px inherited size. Links use an underline and inherit the text color.

## Spacing and Corners

Spacing uses Tailwind's default 4px unit. Common gaps and padding are 4, 8, 12, 16, 24, and 32px. Small control gaps also use 6px. Shared cards use 24px spacing by default and 16px for the small size.

The base corner token is `--radius: 0.625rem` (10px at a 16px root size).

| Utility | Radius |
| --- | --- |
| `rounded-sm` | 6px |
| `rounded-md` | 8px |
| `rounded-lg` | 10px |
| `rounded-xl` | 14px |
| `rounded-2xl` | 18px |
| `rounded-3xl` | 22px |
| `rounded-4xl` | 26px |
| `rounded-full` | Pill or circle |

Buttons, inputs, cards, and dialogs use `rounded-4xl`. Badges use `rounded-3xl`. Tab controls use `rounded-full` by default.

## Shared Components

### Buttons

[Button source](packages/ui/src/components/button.tsx)

Buttons use 14px medium-weight text, rounded corners, and a small gap between text and icons.

| Variant | Appearance |
| --- | --- |
| `default` | Green fill, white text, a light border, and a small shadow |
| `neutral` | Foreground fill with background-colored text |
| `outline` | Border with a partly transparent background and blur |
| `secondary` | Neutral fill and foreground text |
| `ghost` | No resting fill; muted fill on hover |
| `destructive` | Tinted error fill and error-colored text |
| `link` | Green text; underline on hover |

| Size | Height | Horizontal padding |
| --- | --- | --- |
| `xs` | 24px | 10px |
| `sm` | 32px | 12px |
| `default` | 40px | 16px |
| `lg` | 44px | 20px |

Icon button sizes are 24, 32, 40, and 44px. Inline icons can reduce the padding on their side. Default buttons use `bg-primary/80` on hover. Pressing a button moves it down 1px, except when it has `aria-haspopup`. Disabled buttons use 50% opacity and block pointer events.

### Inputs and Validation

[Input source](packages/ui/src/components/input.tsx)

Inputs are 40px tall with 12px horizontal padding, `bg-input/50`, and muted placeholder text. Text is 16px below the `md` breakpoint and 14px from `md`. The resting border is transparent.

Keyboard focus adds a ring-colored border and a 3px ring at 30% opacity. Invalid inputs use a destructive border and ring. Disabled inputs use 50% opacity. Form fields provide separate labels, descriptions, and error text.

### Cards

[Card source](packages/ui/src/components/card.tsx)

Cards use the card fill and text tokens, a small shadow, and a 1px foreground ring at 5% opacity in light mode and 10% in dark mode. They clip their content to rounded corners.

Default spacing is 24px; small cards use 16px. Titles use Plus Jakarta Sans at 16px and weight 500. Descriptions use 14px muted text. Individual cards can change text size, fill, and spacing.

### Badges and Tabs

[Badge source](packages/ui/src/components/badge.tsx) · [Tabs source](packages/ui/src/components/tabs.tsx)

Badges are 20px tall with 12px medium-weight text and 8px horizontal padding. Variants include green, secondary, destructive, outline, ghost, and link.

Default tab lists have a muted fill, full rounding, 4px padding, and a 36px height. Active tabs use a background-colored fill in light mode and an input tint in dark mode. The `line` variant uses an active indicator instead of a filled active tab.

### Navigation Controls

[Sidebar source](packages/ui/src/components/sidebar.tsx)

Navigation buttons use 14px text, rounded corners, and small icons. Hover and active states use the sidebar accent fill. Active text has medium weight. Focus uses the sidebar ring token.

### Dialogs

[Dialog source](packages/ui/src/components/dialog.tsx)

Dialogs use the popover fill, 24px padding, rounded corners, a light foreground ring, and a large shadow. The backdrop is black at 30% opacity with blur where supported. The close control uses a small ghost icon button with a secondary fill.

## Materials and Shadows

The UI uses several levels of depth:

- Cards use `shadow-xs` and a light ring.
- Primary buttons use a small inset highlight and outer shadow.
- Dialogs use `shadow-xl`.
- Glass surfaces add blur, a partly transparent fill, and a shadow.

The shared `--shadow-card` token is also available:

```css
rgba(0, 0, 0, 0.02) 0 0 0 1px,
rgba(0, 0, 0, 0.04) 0 2px 6px 0,
rgba(0, 0, 0, 0.1) 0 4px 8px 0
```

App glass styles use different settings. The header material uses a 72% background mix and 165% saturation. Map navigation glass uses a 72% sidebar mix with 24px blur and 150% saturation. Briefing glass uses a 70% background mix with 20px blur and 170% saturation.

Reduced transparency settings remove blur and use solid fills for these materials. Map navigation and briefing glass also provide high-contrast fallbacks.

## Images and Icons

The app mark is [logo.png](apps/web/public/logo.png). The shared logo component displays it at 24×24px.

Painted images include [daisies.webp](apps/web/public/daisies.webp) and [ascii-magic.webp](apps/web/public/ascii-magic.webp). Images use cover cropping where needed. Dark mode can reduce image brightness. Cream text and deep teal overlays support text on imagery.

Hugeicons are used in shared controls and app navigation. Some existing controls and charts use Lucide or Tabler icons. Standard button icons are 16px, small button icons are 12px, and badge icons are 12px.

## Motion and Focus

Short control changes use transitions. Header title fades and view transitions use 200ms with ease-out. Sidebar size and position changes use 200ms with linear easing. Dialogs fade and scale over 100ms.

Briefing entry motion lasts 900ms with `cubic-bezier(0.22, 1, 0.36, 1)`. Elements rise from 16px below, fade in, and clear a 6px blur. The first four entry elements use 80ms delay steps. Scroll reveal and image drift run where CSS scroll timelines are supported. The team carousel has an 8-second progress animation that can pause.

Reduced motion settings disable shared view-transition animations and omit the briefing CSS entry, scroll, and progress animations. Focus styles remain visible through ring and border changes.

## Keeping This File Current

Use the source files above to check exact values before changing the UI. Update the relevant section when a shared token or component changes. Describe behavior that exists in the code, and mark any new proposal before it is implemented.
