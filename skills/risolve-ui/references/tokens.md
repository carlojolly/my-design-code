# Tokens

Read this when setting up a theme or when you need an exact value. The values live in
`assets/tokens.css` (Risolve's own palette); make another palette with `scripts/derive_theme.py`.

## Contents
- Colour roles
- Making a theme for another brand
- Type
- Spacing, radius, depth
- Motion

## Colour roles

One dark ink does all the text, at four strengths. Quiet tints of the same ink make the window,
the sidebar and the selection. One bright "signal" colour marks the single positive state that
should shout. Status colours are fixed and do not follow the brand.

| Token (Tailwind) | Risolve | Use for | Never for |
|---|---|---|---|
| `ink` | `#203119` | Titles, main cells, values, the primary button | Large fills (except the primary button and the selected segment) |
| `ink-78` | 78% ink | Secondary labels, card asides, chips | Body copy |
| `ink-68` | 68% ink | Table cells that aren't the main one, table headers, hints | Anything a person must read to act |
| `ink-50` | 50% ink | Chevrons, disabled hints | Text people need |
| `hairline` | 8% ink | Row dividers, rims | Visible borders around blocks |
| `window` | `#eef3e8` | Behind everything; `body` background | Inside the sheet |
| `rail` | `#e3ebdb` | The sidebar | Content |
| `sheet` | `#f9f9f9` | The content sheet, cards, the drawer (a neutral, not a tint) | – |
| `tint` | `#ebf1e4` | Quiet pills, source tags, hovers, the "acted" pill | Status that needs attention |
| `selection` | `#fbfdf9` | The selected nav item (with `shadow-select`) | – |
| `mist` | `#cfe2cf` | Team avatars, empty marks | – |
| `signal` | `#bfff80` | Done/confirmed pills, chart band | Buttons, backgrounds, headings, more than one meaning |
| `signal-deep` | `#6fb514` | A good number on the sheet: money saved, a quantity to act on | Body text (too light) |
| `pending` / `pending-ink` | `#f6e3a1` / `#8a6400` | A person must act: the pill, the nav badge | Warnings that need no action |
| `reject` / `reject-ink` | `#f4c7c2` / `#b4332a` | Rejected | "Needs attention" (that's yellow) |
| `wrong` | `#d2473b` | A small ✗ beside a wrong value, a meter that's run out | Fills of any size |
| `chart-actual` / `chart-expect` / `chart-band` / `chart-other` | ink / `#559646` / signal 45% / `#9fc6bf` | What happened / what we expect / the uncertainty band / a comparison series | – |

There are no greys. `ink-68` is the grey, and it is tinted by the brand.

**Contrast:** Risolve ships `signal-deep` at 2.4:1 on the sheet and the status inks at about
4.0 to 4.2:1, a little under WCAG targets. Keep them for Risolve's exact look; for anything public,
run `derive_theme.py --strict`, which darkens just those three until they pass.

## Making a theme for another brand

```bash
python3 scripts/derive_theme.py --ink "#14233c" --accent "#2f6bff" > app/tokens.css
python3 scripts/derive_theme.py --ink "#14233c" --accent "#2f6bff" --strict --json   # just look
```

- **ink** is the brand's darkest colour. It must be dark (OKLCH L under about 0.38), because
  every text strength is made from it. A navy, an aubergine, a near-black brown all work.
- **accent** is the brand's bright colour. If it is light (lime, mint, pale yellow) it becomes the
  signal fill directly. If it is dark (a strong blue), the script makes a pale version for the fill
  and uses the accent itself as `signal-deep`.
- The tints keep the ink's hue at Risolve's lightness steps, so a navy brand gets blue-grey
  windows, and a black brand gets neutral greys. Fed Risolve's own two colours it reproduces the
  shipped palette to within a few RGB steps.
- The script warns when the accent is yellow (pending moves to orange so the two stay distinct) or
  red (it will read as an error).
- No brand at all: use the defaults (Risolve's dark green and Flex Green), and say so.
- Make the accent visible. With a dark accent (most blues), `signal` is only a pale tint, so use
  `signal-deep` (the accent itself) for the product mark, links, focus rings and one chart
  series. Keep it off the selected filter and primary button, which stay ink.

Put the generated file's contents in the project's global CSS after `@import "tailwindcss";`.
With shadcn, map its tokens onto these so generated components match:
`--background: var(--window); --foreground: var(--ink); --card: var(--sheet); --primary: var(--ink);
--muted-foreground: var(--ink-68); --border: var(--hairline); --ring: var(--chart-expect);`
and `--secondary`, `--muted`, `--accent` to `var(--tint)`.

## Type

- **Font:** Satoshi (Indian Type Foundry, free from Fontshare: fontshare.com/fonts/satoshi).
  Download it into each project; its licence does not allow passing the files on, so the skill
  does not include them. With next/font: `localFont({ src: [...], variable: "--font-brand" })`.
  If the brand has its own sans, use it with the same rules.
- **Weights:** Medium (500) is the body weight (set on `body`), Bold (700) for titles, the main
  cell, values and active states. Risolve doesn't even load Regular. No semibold.
- **Scale actually used:**

| Size | Weight | Tracking | Where |
|---|---|---|---|
| 30 px | 700 | -0.035em | Page title |
| 28 px / 22 px | 700 | -0.03em | KPI number (card / Home strip) |
| 26 px | 700 | -0.035em | Stat on the sheet, drawer title |
| 22 px | 700 | -0.03em | Wordmark |
| 17 px | 700 | -0.025em | Section heading, card title |
| 17 px | 500 | -0.015em | Sidebar nav |
| 16 px | 700 | -0.02em | Main table cell, money values |
| 15 px | 500 | 0 | Table cells, inputs, search |
| 14 px | 500/700 | 0 | Pills, segmented, chips |
| 13 px | 500 | 0 | Table headers, asides, buttons, owner labels |
| 12 px | 500 | 0 | KPI labels, stat hints |
| 11 px | 500 | 0 | Source tags only |

- Tracking tightens as size grows; small text keeps 0. Never widen tracking, never uppercase.
- `tabular-nums` on every number that can line up with another (tables, KPIs, counts).
- Sentence case everywhere, including buttons and nav.

## Spacing, radius, depth

- Window padding 10 px; gap between sidebar and sheet 10 px.
- Sidebar 230 px, padding 12 px sides, 28 px top. Nav items 40 px tall with 4 px gaps.
- Page: max 1280 px, 36 px side padding, 32 px top, 32 px between sections. Ask column 980 px.
- Radii (off the 4 px grid on purpose, taken from the film): sheet and sidebar 18 px, drawer 22 px
  (left corners), chart card 16 px, KPI 14 px (12 px small), nav item and table row 12 px,
  doc chip 10 px, everything pill-shaped `rounded-full`.
- Depth comes from tint steps (window, rail, sheet) and faint rims, never from big shadows:
  `shadow-rim` (1 px at 10%), `shadow-rim-strong` (1.5 px at 9%, cards and KPIs),
  `shadow-sheet`, `shadow-select`, `shadow-drawer`. Glass (`shadow-glass` over a 26 px blur) is
  only for small floating controls: toolbar capsules, the segmented control, the drawer's close.

## Motion

- "Rise": things arrive up out of a soft blur over 0.7 s on `cubic-bezier(0.23, 1, 0.32, 1)`
  (`.rise`). Messages and panels arrive this way.
- The nav selection glides between items over 450 ms on `cubic-bezier(0.77, 0, 0.175, 1)`.
- The drawer slides in over 500 ms on `cubic-bezier(0.32, 0.72, 0, 1)`.
- Pulses only on loading placeholders. Nothing loops on live content except question chips
  that don't fit (a slow marquee, paused on hover).
- Everything stops under `prefers-reduced-motion`.
