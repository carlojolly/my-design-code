---
name: risolve-ui
description: Build or restyle app screens (dashboards, back offices, admin panels, inboxes, CRMs, ops and internal tools) so they look designed by a person rather than generated, using the method the Risolve team, and Flavio Bernoni in particular, used and the corrections they had to make. Includes a themeable React and Tailwind v4 kit, a theme generator, a static checker and a rendered screenshot audit. Use this whenever the user wants a new app screen or dashboard built, a vibecoded or shadcn-default app screen redesigned, or says "non-AI looking", "not vibecoded", "like Risolve", "like Flavio's UI", "make it look designed", even if they don't name the skill. Prefer it over unslop and ui-ux-pro-max for app screens, and don't run unslop on its output (unslop treats this look's glass rims and off-grid sizes as flaws). Not for marketing or landing pages.
---

# Risolve UI

Risolve is a back office built at the Grok Hackathon in Pavia (Nov 2026). Its UI is calm, large and
specific: one dark ink, quiet tints, one bright colour that means "done", faces and real numbers,
tables straight on the sheet, no explanations on the page.

The history behind it is the most useful part of this skill. The team had the right colours and
font within two hours of the first UI code, and the app still looked generated: subtitles on every
header, 60 boxed panels, 50 px rows, the same sentence down every row, codes instead of names.
One redesign fixed it, mostly by taking things away and making what was left bigger. So this skill
does not stop at tokens. It builds, looks at the result, and corrects it the way the redesign did.
`references/evolution.md` has the full story with commits.

## When to use it

- New app screens: dashboards, inboxes, queues, detail drawers, settings that people use daily.
- Restyling an existing app screen that looks templated (shadcn defaults, stock greys, cards
  everywhere, purple accents, emoji).
- Any stack, but the kit is React and Tailwind v4. Elsewhere, use `assets/tokens.css` as plain CSS
  variables and rebuild the parts from `references/components.md`.

Not for marketing pages, landing pages or brand sites: the repo had none to learn from.
If the project already has a strong design system of its own, apply the rules and the correction
pass, and leave its tokens alone.

## Workflow

Follow these in order. Steps 3 and 4 are the ones most often skipped, and skipping them is what
made Risolve's first version look generated. `<skill>` below means this skill's folder.

### 1. Read the project
Find the stack, the global CSS, any existing tokens and font, and how pages are laid out. For a
restyle, screenshot the current screens first (step 6's script) so you can show before and after.

### 2. Set the theme
Ask for the brand's darkest colour (the ink) and its bright colour (the accent) if you can't find
them in the project. Then:

```bash
python3 <skill>/scripts/derive_theme.py --ink "#14233c" --accent "#2f6bff" > app/tokens.css
```

Put its contents in the global CSS after `@import "tailwindcss";` (map shadcn tokens onto it if
the project uses shadcn; see `references/tokens.md`). With a brand accent, make sure it is
visible in the interface, not only defined: the product mark, the done pills, focus rings,
links, one chart series. A brand that only shows up in its logo reads as Risolve repainted. With no brand, run it with no arguments for
Risolve's own green, and tell the user. Add `--strict` for anything public: Risolve's own green
numbers and status text sit slightly under contrast targets.

Font: Satoshi from Fontshare, downloaded into the project (its licence doesn't allow the skill to
ship the files), loaded as `--font-brand`. Medium is the body weight, Bold for emphasis, nothing
in between. If the brand has its own sans, use that with the same weights.

### 3. Compose one frame first
Risolve's look started as a single frame from a launch film, committed before any UI code, and the
redesign was a return to it. Do the same: before writing components, decide the one screen that
matters most (usually Home or the main inbox) and compose it whole.

- If the user has a reference (a screenshot, a Figma frame, a film still), start from it.
- Otherwise use `assets/screenshots/example-orders-coffee.png` and the third and fourth columns of
  `assets/screenshots/history-*.png` as the reference for spacing, size and density.
- Write the screen's three answers first, in one line each, from the seeded data: What is
  happening? Is anything wrong? Do I need to do anything? (The team's own brief for every screen.)
- Pick the layout from `references/layouts.md`: the desk, the inbox with a drawer, or a working
  page with one card.
- Then add what only this product needs. The method is Risolve's; the screen should still be
  about this business. Ask what the person on this screen checks every day beyond the list (who
  is overloaded, what goes out in the next payment run, which SLA breaks next) and give it one
  quiet desk widget or one line of facts. In testing, runs without this skill came up with these
  views on their own, and runs with it built a faithful Risolve and stopped there.

### 4. Seed realistic data before styling
Risolve's kit port showed 1 order and looked empty; the redesign came with 23 orders, 13 retailers
with logos and faces for every person. Design can't be judged on placeholders.

- 20 or more rows per list, mostly fine, about one in six needing a person, some done.
- Real-sounding names that fit the place, uneven amounts, dates spread over the week.
- People with names, roles and faces (photos if the project has them, initials otherwise).
- A different, specific reason on every row that needs a person.
- Never "John Doe", "Acme", "Lorem ipsum", "Item 1", round numbers, or one date for everything.

`references/copy.md` has more on this.

### 5. Build with the kit
Copy `assets/kit/index.tsx` and `assets/kit/shell.tsx` into the project as `components/kit/`
(they need a shadcn-style `cn` at `@/lib/utils`; adjust the import if needed). Build the frame
from step 3 with them, then the other screens. `assets/examples/orders-page.tsx` is a complete
worked example of the inbox pattern for a different business.

Keep the kit's sizes. They are Risolve's shipped values, and most were raised during the
redesign: 30 px titles, 60 px rows, 15 px cells, 28 px pills, 230 px sidebar, 1280 px content.
If something doesn't fit, remove something rather than shrinking it.

### 6. Look at it
Run the app and audit the real screens:

```bash
node <skill>/scripts/audit_page.mjs http://localhost:3000 / /orders /settings --out ui-audit
```

Then once more at phone width (`--width 390 --height 844`): it flags tables that scroll sideways,
pages wider than the screen and text cut off at an edge.

It writes a screenshot and a findings list per page. Open every screenshot and look at it as a
person would, then read the findings. The audit catches rule breaks it can measure (title size,
subtitles, row height, repeated text, boxed lists, dark or red pills, extra primary buttons, small
print, ISO dates, thin data); it can't judge composition, so your eyes are part of the step.
If the app can't run here (no dev server, no Chrome), do the correction pass from the code and
tell the user the screens weren't checked.

On Risolve's own history the audit flags 30 problems on the screens before the redesign, 3 after
it, and 1 on the live app (plus the live Orders table running off the screen at 800 px), so a
clean run means something.

### 7. Correction pass
Go through the list below on every screen, fix, and repeat step 6 until the audit is clean or each
remaining finding has a reason you could defend. This pass is the redesign, written down.

### 8. Static check, then report
```bash
python3 <skill>/scripts/check_ui.py src/
```
It catches what is written in the code but easy to miss on screen: stock greys and accents,
semibold, uppercase, em dashes, emoji, placeholder names, filler copy, subtitle props, shadcn's
dark default Badge. Fix the "fix" findings; look at the "look" ones.

Then show the user the screenshots (before and after for a restyle), list what the correction
pass changed, and name any rule you broke on purpose and why.

## The correction pass

Each item is something the Risolve redesign actually did. Run through all of them; the first
build almost always fails several.

1. **Delete every subtitle and explanation line.** Under titles, under section headings, footnotes
   under tables. If a label needs a sentence, change the label. If people will ask why, add the
   question to the ask bar. (8 of 8 headers had one before; 0 of 12 after.)
2. **Take the boxes off lists and tables.** They sit on the sheet, split by hairlines. Box only a
   single object: a chart, a map, a KPI, a short desk widget that links to its page.
3. **Replace list-beside-detail with one full-width table and a drawer.**
4. **Make it bigger.** Titles 30 px, rows 60 px, cells 15 px with the main cell 16 px bold, pills
   28 px, nav 17 px. 27 of 29 size changes in the redesign went up.
5. **Remove sameness.** If a column says the same thing in most rows, drop it or show what differs:
   who has it, the value, the specific reason. A status column where most rows are fine is
   allowed, but the few that need a person must stand out.
6. **Plain words.** Names instead of codes, people's words instead of system fields, "12 Nov"
   instead of ISO dates, "6 of 12 weeks" instead of week numbers. Keep one ID column.
7. **Colour means one thing each.** Signal fill only for the positive state that should shout;
   yellow when a person must act; soft red for an outcome that failed (rejected, declined,
   bounced); a small ✗ for wrong. A failed payment is a soft red "Card declined" with the person
   chasing it in "On it", not a yellow pill. No dark pills,
   no red fills, no stock greys or Tailwind accents. Only the number of a KPI takes colour.
8. **One primary button per view**, for the action the view exists for.
9. **Real things on screen.** Faces in an "On it" column, logos, a map where there's geography,
   a source tag beside any figure someone might question. Keep "On it" on phones as a face and
   first name (mark it `essential`); who has it matters most on the move.
11. **The main content stays in view.** On a 1440 by 900 screen, the rows that need a person
    should be visible without scrolling. If KPIs and widgets push the table below the fold, cut
    them or move them below; the docked ask bar stays one line (its questions appear on focus).
10. **Copy check.** Sentence case, no em dashes, no filler, buttons that say what happens, empty
    states as short sentences ending in a full stop.

## The rules, and why

| Rule | Why (from the history) |
|---|---|
| One ink at four strengths, tinted, no greys | Stock greys were the first thing that read as a template. The ink's tint ties every grey to the brand. |
| One signal colour, for "done" only | The redesign moved "OK" from a pastel to the full brand accent: one state shouts, the rest are quiet. |
| A person must act = yellow, not red | Flavio: "red is a bad alert signal". Three light reds came and went before yellow stuck. |
| No dark pills | Flavio: "I don't like a darker background, change the number colour". |
| Frames must be earned | The kit's own comment: the sheet is already the frame. 60 panels before, single objects only after. |
| Bigger than default | Small, dense text read as a generated dashboard; the redesign raised nearly every size. |
| No explanations | Explanations were the system talking about itself. Questions moved to the ask bar. |
| Real data, faces, sources | The redesign's first move was a believable demo world. Every number has a source. |
| Depth from tints and rims, never big shadows | Window, rail and sheet are three tint steps; that is the whole depth model. |
| Slow, soft motion | Things rise out of a blur over 0.7 s. Pulses only while loading. |
| Check every time | After the redesign, em dashes rose from 8 to 40 and panels from 51 to 64 within a day, all from code that wasn't checked. |

## Don't copy these from Risolve

- Product-specific pieces: the voice button, the Grok cursor and story ring, the Risolve mark,
  retailer logos, the demo portraits.
- Risolve's own lapses: em dashes in old code, stock styling on screens nobody revisited, a
  toolbar that wraps and a table that gets cut at 800 px (see narrow screens in
  `references/layouts.md`).
- Stale comments in its code that mention amber, red or a dark card. The shipped values are in
  `assets/tokens.css`.

## Files

| File | Read or use when |
|---|---|
| `references/evolution.md` | You need the reason for a rule, or the before and after with commits |
| `references/tokens.md` | Setting up a theme, font, spacing, radius, depth, motion |
| `references/components.md` | Choosing a kit part, and when not to use it |
| `references/layouts.md` | Composing a screen: desk, inbox and drawer, working page, narrow screens, empty states |
| `references/copy.md` | Writing labels, statuses, empty states, suggested questions; seeding data |
| `assets/tokens.css` | Risolve's palette as CSS variables and Tailwind v4 theme |
| `assets/kit/index.tsx`, `assets/kit/shell.tsx` | The components (React, Tailwind v4) |
| `assets/examples/orders-page.tsx` | A complete inbox page for a coffee roaster, built with the kit |
| `assets/screenshots/` | `example-orders-coffee.png` (that page rendered) and `history-*.png` (four versions of each Risolve screen) |
| `scripts/derive_theme.py` | Make the palette from a brand's ink and accent |
| `scripts/audit_page.mjs` | Screenshot running pages and audit them (Node 22+, Chrome) |
| `scripts/check_ui.py` | Static check of the source (Python 3, no dependencies) |

The history screenshots contain real retailer logos and demo portraits from Risolve. Fine for
reference while building; don't put them in anything you publish.
