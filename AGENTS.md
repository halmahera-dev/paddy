## Engineering Preferences

- Pragmatic over perfect. Solve the problem at hand.
- Choose the simplest implementation that fully meets the current requirements. Avoid speculative abstractions, configuration, and indirection.
- Grow the system in layers. Start from the smallest version that works end-to-end, and add each new capability on top of a product that already works. Never trade a working product for unfinished complexity.
- Keep components modular and concerns clearly separated.
- Minimal abstractions. Extract only when a pattern appears 3+ times.
- Explicit over clever. No code comments by default. Rename, extract a well-named function or constant, or restructure until the code explains itself. A comment is allowed only where the code cannot say why on its own (a non-obvious constraint, a workaround for an external bug), and then it is one short line. Never narrate what the code does, never leave commented-out code.
- Write expressive, readable code in React and backend code. Prefer clear names and explicit control flow over shorthand expressions.
- DRY in data-fetching and shared components. Not in one-off pages.
- No unnecessary files. Only create helpers/utils if used in 2+ places.
- Use function declarations for named functions, components, and handlers.
- Use arrow functions for inline callbacks passed as arguments (`.then`, `.map`, `.filter`). Do not name an inline callback.
- Keep comments short and limited to intent that clear code cannot express.
- Keep values in the narrowest scope that uses them. Promote a value to a module constant only when it is shared, configurable, or a stable domain concept.
- Do not add `Co-authored-by` trailers to commit messages.

## Design Rules

- Pill buttons have text only. Never put arrows or icons inside them. Put arrows on quiet text links (`variant="link"`), for example "Learn more →". Icon-only buttons (`size="icon*"`) and the loading `Spinner` are allowed.
- Motion values live in `packages/ui/src/styles/globals.css`. Use the tokens there. Do not write new cubic-bezier values in components.
- Hover changes color only (160ms, `ease-out`). Things do not lift, grow, or bounce on hover, and nothing animates on scroll. Exception: section headings blur in once when they enter view (`blur-in-view`), and selected content blocks rise in once (`rise-in-view`, no blur).
- Pressable elements use the `pressable` utility (scale 0.97 on pointer-down). Release is fast: 160ms `ease-out`.
- Elements that move or resize on screen use `ease-in-out`.
- Popovers and menus scale from their trigger (`origin-(--transform-origin)`). Modals stay centered.
- Blur (`glass`) is for the sticky header only. Exceptions: section headings (`blur-in-view`), and floating panels over the map.
- Headings use weight 510, titles 590. Never bold, never uppercase (except `type-label-mono`).
- Emerald (`brand`) marks state, focus, and small highlights. The main action is the ink pill.
- Respect `prefers-reduced-motion`: replace movement with a short fade, and keep color changes.

## Talking to Human

- When speaking English, always talk in ASD-STE100 Simplified Technical English.
- Constraint yourself not to use C1-C2 sentences and vocabularies. Keep your responses in plain English.

## Next.js App (`apps/web`)

- For every change in `apps/web`, read `.agents/skills/nextjs-app-architecture/SKILL.md` and follow its architecture workflow and verification checklist. Read the relevant skill references for the work at hand.
- Use `apps/web/AGENTS.md` and the installed Next.js docs at `apps/web/node_modules/next/dist/docs` for version-specific framework behavior and APIs.
