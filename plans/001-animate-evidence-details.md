# 001 — Animate the evidence `<details>` open and close

- **Status**: DONE (mechanical checks passed; feel check pending)
- **Commit**: aaa2341
- **Severity**: LOW
- **Category**: Missed opportunities (teleporting state)
- **Estimated scope**: 2 files, about 20 lines

## Problem

The evidence list in the bowl detail panel snaps open and closed. Content appears and vanishes with no bridge.

```tsx
// apps/web/src/features/map/components/map-bowl-detail.tsx:43-56 — current
function EvidenceList({ items }: { items: { summary: string; body: string }[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <details key={item.summary} className="group border-t py-2 text-sm first:border-t-0">
          <summary className="cursor-pointer list-none text-muted-foreground tabular-nums transition-colors group-open:text-foreground hover:text-foreground">
            {item.summary}
          </summary>
          <p className="pt-2 text-muted-foreground">{item.body}</p>
        </details>
      ))}
    </div>
  );
}
```

Frequency: rare (third tab, a few opens per visit). Purpose: state indication. This is low priority polish.

## Target

Height and opacity transition on the native `::details-content` pseudo-element. Browsers without support (Safari, older Firefox) keep today's instant behavior, because an unsupported selector drops the whole rule.

```css
/* packages/ui/src/styles/globals.css — add after the `fade-in` utility */

/* A <details> opens and closes smoothly. Browsers without ::details-content keep the instant toggle. */
@utility details-reveal {
  interpolate-size: allow-keywords;

  &::details-content {
    height: 0;
    opacity: 0;
    overflow: clip;
    transition:
      height 200ms var(--ease-in-out),
      opacity 200ms var(--ease-out),
      content-visibility 200ms allow-discrete;
  }

  &[open]::details-content {
    height: auto;
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    &::details-content {
      transition:
        opacity 160ms var(--ease-out),
        content-visibility 160ms allow-discrete;
    }
  }
}
```

Reduced motion keeps the opacity fade and drops the height movement. Height is accepted here as the standard accordion exception; it affects only a small panel with 3 short items.

## Repo conventions to follow

- Motion tokens live in `packages/ui/src/styles/globals.css` (`--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`). Use them. Do NOT write new cubic-bezier values.
- Custom motion lives as `@utility` blocks with a `prefers-reduced-motion` branch. Exemplar: `rise-in-view` (`globals.css:337-351`).
- Hover changes color only. Do not add hover motion.

## Steps

1. In `packages/ui/src/styles/globals.css`, add the `details-reveal` utility from the Target section directly after the `fade-in` utility (the block that ends with `animation: fade-in 240ms var(--ease-out) both; }`).
2. In `apps/web/src/features/map/components/map-bowl-detail.tsx:47`, change the `<details>` className from `"group border-t py-2 text-sm first:border-t-0"` to `"group details-reveal border-t py-2 text-sm first:border-t-0"`.
3. Check that the `<p>` keeps its `pt-2`. The padding is inside the clipped content, so it animates with it. Do not move it.

## Boundaries

- Do NOT touch other `<details>` or accordion components.
- Do NOT change markup. Class names only.
- Do NOT add dependencies or a JS animation.
- Do NOT add a `<noscript>` or fallback branch for unsupported browsers.
- If `@utility` with a nested `&::details-content` fails to compile, STOP and report. Do not work around it with JS.
- If the code no longer matches the excerpts above (drift since `aaa2341`), STOP and report.

## Verification

- **Mechanical**: from the repo root run `pnpm --filter web typecheck` and `pnpm --filter web build` (or the repo's equivalents). Both must pass, with no CSS compile errors.
- **Feel check**: open `/en/map?bowl=<any id>`, select the Evidence tab, and confirm in Chromium:
  - Each item opens and closes over about 200ms, with content fading as the height changes.
  - Clicking an item repeatedly mid-transition reverses smoothly and never restarts from zero.
  - In DevTools Animations panel at 10% speed, the border-top of the next item moves with the height and nothing overflows during the clip.
  - Toggle `prefers-reduced-motion: reduce` (Rendering panel): only the fade remains, with no height movement.
  - In Safari or Firefox without `::details-content` support, the toggle is instant as before and nothing breaks.
- **Done when**: all three evidence items animate open and closed in Chromium, reduced motion shows fade only, and the build passes.
