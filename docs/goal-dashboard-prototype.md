# Goal: Finish the dashboard prototype, map first

Status: Draft. Date: 7 November 2026. Source: PRD `docs/prd-hollou.md` (F1–F8, G1) and the code in `apps/web/src/features/map`.

## Goal

A regulator opens the map and, in 3 minutes or less and without help, finds the 3 highest-ranked bowls in one *kecamatan* and opens the evidence for one of them. The desk (Today, Bowls, Inspections) and the map show the same bowls, the same numbers, and the same "lead for inspection, not proof of a pump" label.

The map is the main work. The desk is done when it agrees with the map.

## What exists now

- `/map`: globe-to-Jakarta flight, bowl layer with drop height and a water layer, NISAR pair layer, year and pass slider with play, ban on/off switch, bowl select, URL holds bowl, year, and pass.
- Desk: Today overview, bowl table, bowl detail and chart, inspection board.

## What is missing on the map

| # | Gap | PRD |
| --- | --- | --- |
| 1 | No bowl list on the map page. The user can only pick a bowl from a dropdown. | F3 |
| 2 | No bowl panel on the map. Chart (Sentinel-1 before the ban, NISAR after) is only in the desk. | F4 |
| 3 | No evidence panel. Numbers have no source, dates, scale, or method. | F7 |
| 4 | The "lead for inspection" label is not on the map. | F3, F8 |
| 5 | The URL does not keep the map position. | F8 |
| 6 | No 2D fallback and no check for phone width (360 px). | F1 |
| 7 | The color layer shows drop in meters. The PRD asks for a legend in mm/yr. | F1 |
| 8 | No split view (L-band and C-band). | F5 |
| 9 | No GNSS check chart. | F6 |
| 10 | No national view. | G1 |

## Layers of work

Each layer ships a working map. Do not start the next layer before the last one works.

1. **Bowl look, list, and split layout.** Gaps 1, 2, 4. Bowls look like the reference image (see "Bowl look"). A click on a bowl, or on its row in the list, selects it and splits the page (see "Split layout"). The right side shows the bowl detail with the depth view (see "Depth view").
2. **Evidence and URL.** Gaps 3, 5. Each number opens source, product, dates, scale, and method inside the right side. No overlay and no blur. The URL holds the map position.
3. **Map quality.** Gaps 6, 7. Rate legend in mm/yr, 2D fallback, reduced motion, keyboard use, 360 px width.
4. **Desk agrees with map.** Same bowl data and labels. A bowl in the desk opens the same bowl on the map.
5. **Extra views.** Gaps 8, 9, 10. Only after layers 1–4 pass.

Recommended order for best UX: 1, then 2, then 3. Layers 4 and 5 wait. Layer 1 is what a regulator sees first, and layer 2 makes the numbers trustworthy. Layer 3 makes both work for everyone.

## Split layout

- No bowl selected: the map fills the page. The ranked bowl list floats over the map.
- Bowl selected: the page splits. Left: the map. Right: the bowl detail. On a phone, the detail goes below the map.
- No slide-in and no overlay. The split changes at once, with no width animation. The map calls `resize()` after the change and keeps the selected bowl in view.
- The detail content fades in (160ms, `ease-out`). Selecting from the list with the keyboard has no animation.
- Close (or Escape) returns to the full map. The URL holds the selected bowl, so a shared link opens the same split.
- The map stays mounted. Do not rebuild it on select, so the layers and the camera do not reset.
- Optimize: the detail pane loads its chart data only for the selected bowl. The pane uses a solid background.

## Depth view

The right side shows how deep the bowl is, for the year on the slider.

- A cross-section: ground line, the bowl curve, and the old ground level as a dashed line. The gap between them is the depth.
- A person next to it for scale (the map already has this gauge in `landas-map.tsx`; reuse it).
- The depth number in m (and cm for small values), with the year and the ban on/off setting.
- It updates when the user picks a year in the Prediction section. With reduced motion, it changes with no tween.

## Bowl detail (chosen from three prototypes: Scroll, Tabs, Depth first)

- The detail is a fixed header and three tabs: Prediction, History, Evidence. The tab panel scrolls on its own. On a phone the whole pane scrolls.
- Header: name, *kecamatan*, rank (with the previous rank when it moved), a row of three numbers (depth now, drop by the chosen year, rate), and the lead note. The lead note is plain text with an emerald dot. It is not a pill.
- Prediction: year buttons, the ban switch, the cross-section with a depth marker, and a small table with the drop with the ban, without the ban, and the difference.
- History: the Sentinel-1 and NISAR chart, plus a table with the rate before the ban, the rate after it with its uncertainty, and the percent change.
- Evidence: the example-data note and three expandable items (depth, rate, projection).

## Prediction

- There is no year slider and no play button on the bowl map. The year choice lives in the side layout, in a "Prediction" section.
- The section has year buttons (2030, 2035, 2040, 2045, 2050), the 2023 ban switch, the drop for that year, and the projection note ("at current rates, no sea wall, no pumping change, no sea-level rise").
- The year and the ban setting stay in the URL. They affect only the selected bowl: its stack, its list value, and its detail. Every other bowl stays at a fixed baseline (2035, ban on). With no bowl selected, the whole map shows the baseline.
- The radar view keeps its pass slider, because it steps through NISAR passes and has no side layout.

## Bowl look

From the reference image (`/Users/heritsam/.t3/userdata/attachments/868366f7-4494-4e66-b8c5-4a1baccbb1e8-d990ced4-0265-4bce-92ff-2f81755022e8.png`):

- Each bowl is a stack of 3 round tiers. The tiers get smaller toward the top.
- Height and width grow with the sinking rate.
- Color follows the rate: green is slow, yellow is middle, orange is fast.
- A soft glow under each stack, and thin ripple rings on the ground around it.
- Each stack is clickable. Hover changes color only. A selected stack has a clear focus state.
- The map keeps the dark basemap and 3D tilt.
- With reduced motion, ripple rings do not animate.

## Done when

- A test user passes the 3-minute task (PRD KPI 1) on desktop and on a 360 px phone.
- Every number on the map has a source link (PRD KPI 4).
- Reduced motion, keyboard, and the 2D fallback still allow the task.
- Layers 1–4 pass `bun run check-types` and the lint step. Layer 5 is optional for this goal.

## Status (7 November 2026)

- Layers 1–4 are built. Type check and lint pass for the changed files. `/en/map` and `/id/map` render on the server.
- Checked in a browser (1280 px and 360 px): the stacks draw and match the reference look; a click on a stack selects the bowl and splits the page; the list, depth view, and evidence items work; the 2D switch flattens the map; the URL keeps bowl, year, view, and map position; there is no sideways scroll at 360 px.
- A scripted run of the regulator task (home page, read the top 3 bowls with their *kecamatan*, select one, open its evidence) works in under 1 second of script time.
- Found and fixed in that check: MapLibre does not accept a data expression for extrusion opacity, so the stacks did not draw at first.
- Keyboard check done in a browser: Tab and Enter select a bowl in the list, Enter opens an evidence item, Escape closes the detail.
- Reduced-motion check done in a browser (by forcing the media query): a bowl change jumps to the bowl with no flight.
- At 360 px with the detail open, the map is 371 px tall (it was 293 px) and the detail is 248 px tall.
- Not done: the timed task with 5 real test users (KPI 1 and 2). Only people can do this. See "How to run the user test" below.
- The year slider and play button are removed from the bowl map. The year and the ban switch moved into the bowl detail ("Prediction"). Checked in a browser: no slider on the page, year buttons and the ban switch change the drop, the list, the depth view, and the URL, and the keyboard path (Tab, Enter on a list row and on a year button) works.
- 360 px re-checked after the Prediction change: no sideways scroll, the map is 371 px tall, the detail is 248 px tall and scrolls, all 5 year buttons fit in one row, and the legend is hidden while a bowl is open.
- The ranked list now stays visible from 1280 px with the detail open, so a keyboard user can switch bowls from the list. Below 1280 px the header "Go to a bowl" select does this.
- Layer 5 (split view, GNSS chart, national view) is not started.

## How to run the user test

1. Find 5 test users. Start each one on `/en/map` (or `/id/map`). Give no help.
2. Task: "Find the 3 highest-ranked bowls in Penjaringan and open the evidence for one." Record the time and any help given. Pass: 4 of 5 finish in 3 minutes or less.
3. After the task, ask: "Why is a bowl a lead and not proof of a pump? What does the year on the slider assume?" Two team members score each answer against the evidence panel. Pass: 4 of 5 answer correctly.

## Not in this goal

Real NISAR processing in `apps/jobs`, sign-in changes, new data sources, and any non-goal in the PRD section 2.

## Open questions

Decided: map first, then the desk. Target date is 15 November 2026. Layers 1 and 2 are in. The URL keeps the map position. Layers 4 and 5 wait until layers 1–3 work.
