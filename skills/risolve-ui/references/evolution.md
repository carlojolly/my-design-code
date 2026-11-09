# How the Risolve UI got its look

Read this when you need the reason behind a rule, or proof that a correction is worth making.
Everything here comes from the B.R.C x Grok repository (Grok Hackathon Pavia, 4 to 5 Nov 2026):
the git history, the code at four commits, and screenshots of each version running.
The screenshots are in `assets/screenshots/history-*.png`, four columns per screen:
the kit port, just before the redesign, the redesign, the live app.

## The short version

The team had the right colours and font within two hours of the first UI code, and the app still
looked generated. It took one redesign by Flavio Bernoni to get the look, and almost all of that
redesign was taking things away and making what was left bigger. Tokens alone drifted. The
corrections are what this skill has to teach.

## Timeline

| When | Commit | Who | What happened |
|---|---|---|---|
| 4 Nov 15:37 | `b8f5059` | Flavio | The first "UI" is a looping banner image from a launch film, committed 12 minutes before any UI code. It already has the window, the sidebar, a plain title, an unboxed table and pills. |
| 15:49 | `bb4f985` | Arian | First UI code: a stock shadcn chat, no branding. |
| 17:09 | `ce8e866` | Arian | The HeyHandy UI kit is ported (colours, Satoshi, pills). But all 6 page headers get a subtitle, and the code has 39 boxed panels. |
| Evening | many | Arian, Cursor agents | Features pile up. Just before the redesign (`64f7e1b`): subtitles on 8 of 8 headers, 60 panels, 23 stat tiles, 78% of explicit text sizes at 12 to 13 px. Pending turns into three different light reds in three commits. |
| 5 Nov 04:39 | `65c9d92` | Flavio | One commit pulls everything back to the banner: 0 subtitles on 12 headers. The decision log calls it "banner style: Satoshi, no subtitles, no boxed panels". |
| 5 Nov, day | PRs 60, 61, 69, 70 | Morgan, Carlo, Flavio | Small refinements: the ask bar docked at the bottom of every page, the wordmark from 19 to 22 px, the Home desk from 980 to 1080 px. |

The redesign landed as one push of about 4,000 lines, so its intermediate steps are not visible;
only the before and after are.

## What changed in the redesign

### Sizes went up
Of the 29 size changes that could be matched line to line, 27 went up.

| Part | Before | After |
|---|---|---|
| Page title | 26 px, with a subtitle | 30 px, no subtitle |
| Table rows | 50 px | 60 px |
| Table text | 14 px | 15 px (main cell 16 px bold) |
| Status pills | 26 px tall, 13 px text | 28 px tall, 14 px text |
| Segmented control | 26 px items | 30 px items in a 38 px capsule |
| Sidebar | 200 px wide, 15 px items | 230 px wide, 17 px items |
| Wordmark | 17 px | 19 px, then 22 px (PR 69) |
| Page content | 1180 px max | 1280 px max |
| Chat / ask column | 860 px | 980 px |
| Home desk | – | 980 px, then 1080 px (PR 70) |

Why: at the old sizes the screen read as a dense template. Bigger type and taller rows make a
screen with less on it feel deliberate rather than empty.

### Frames came off
- Subtitles: 8 of 8 headers before, 0 of 12 after.
- Boxed panels around lists and tables were removed. The kit's own comment: the sheet is already
  the frame. Lists and tables now sit straight on the sheet, split by hairlines.
- Stat tiles lost their tiles (a number on the sheet), except the KPI strip on Home.
- Boxes stayed only around single objects: the truck map, a chart, the KPI numbers, and Home's
  three desk widgets (each a short list that links to its full page).
- Orders went from a boxed inbox list beside a boxed detail panel to one full-width table whose
  rows open a drawer from the right. Sign-off went the same way.

### Explanations left the page
Before, every page opened with a sentence about the system, and tables had footnotes defining
their columns. Real examples from `64f7e1b`:

- Orders: "7 orders shown, 0 need attention. Agents do the steps; a person approves what needs a person."
- Operations: "Stock by product and batch, the demand forecast (an estimate) and the Purchasing agent's paddy to buy."
- Stock footnote: "Physical = released + quality held. Reserved = confirmed orders not shipped. Held stock never counts…"
- Actions: "When code or Grok cannot finish a case, it stops here with a proposal and the documents behind it…"

After: none. A person who wants to know asks in the ask bar at the bottom of the page.

### Sameness was removed
Before, 6 of 7 order rows had the same sentence ("All checks passed; confirmed by Giulia, order
desk"), the same "no date" and the same grey "On track" pill. After, each column shows what differs
per row (who has it, the value, the state), and status colour separates "Needs you" (yellow) from
everything that is fine (quiet). In the live app the Sign-off pills went one step further: from
"Needs you" on every row to the specific reason ("Price error", "Warehouse").

### Words became plain
- Product codes became names: `CAR-1KG` became "Carnaroli 1 kg".
- ERP column names became words people use: the stock tables went from 23 different column
  names ("Physical on hand", "Available to promise", "Reserved", "Quality held", "Projected
  closing"…) to 7 ("Available", "Promised", "On hold", "Next batch"…).
- "Approval required" and "Needs a person" became "Needs you".
- ISO weeks (`2026-W45`) became dates ("12 Nov") or progress ("6 of 12 weeks").

### Colour got stricter
- Dark pills went, even though the first banner had them. Flavio, 5 Nov, in the kit's code:
  "I don't like a darker background, change the number colour", and "red is a bad alert signal".
- "OK" moved from a pastel green (`#d9f5bf`) to the brand's Flex Green (`#bfff80`): the one
  positive state that should shout uses the real accent, at full strength.
- "A person must act" went through three light reds in agent commits and ended up yellow
  (`#f6e3a1` with `#8a6400` text). Red is left for "rejected" (soft) and a small ✗ mark.
- Aligned numbers (`tabular-nums`) went from 18 uses to 51.

### Content became real
- Demo data: 1 order in the kit port, 7 before the redesign, 23 after, 27 in the live app.
  Retailers went from 5 coloured dots to 13 with logos.
- An "On it" column with faces (who has the order now: a person, a team, the agent, the retailer).
- A truck route map with the fuel saved.
- 42 source tags beside figures: every number links to the document it came from.

### Structure was rethought
Sections went from 7 to 4 to 6. Home went from a chat with a summary on top to a desk: four KPI
numbers, a to-do list, what runs short, the next trucks, with the ask bar docked at the bottom.

## What slipped afterwards
Rules that are not checked drift back, even in the same week:
- Em dashes on main went from 8 to 40 lines, all from agent commits, although the team's own
  prompt banned them.
- Boxed panels went from 51 back to 64; every new one came from a branch started before the
  redesign and merged after it.
- Older screens nobody revisited (the paddy forecast, the chat internals) kept stock styling:
  default greys, small text, uppercase labels.

This is why the skill ends every build with the audit and the static check: the look has to be
re-checked, not just set once.

## What the history can't tell you
- The steps inside the redesign (one push).
- Most of the reasons: the code quotes Flavio directly in one place, and the PR descriptions rarely
  explain design choices. The film's own UI guide (`HeyHandy/brand/UI.md`) is not in the repo.
- So treat the rules as "what the team converged on", and when a new screen needs something the
  history doesn't cover, follow the direction of the changes: fewer frames, bigger, plainer,
  real data, one colour that means something.
