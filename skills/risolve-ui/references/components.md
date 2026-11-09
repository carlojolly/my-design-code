# Components

Read this when choosing which kit part to use. The code is in `assets/kit/index.tsx` and
`assets/kit/shell.tsx`; copy both into the project as `components/kit/` and edit them there.
Each part lists what it is for and, just as important, what it is not for: most of the redesign
was using these parts less.

## Window and page (shell.tsx)

**AppWindow**: the window tint, a 230 px sidebar with the product mark and 22 px wordmark, nav
items with a gliding selection and a yellow badge for things waiting on a person, an optional
quiet list under the nav (customers, projects, sites), and the sheet. Pass your router's `Link`
and the current `path`. Keep the nav to the sections people actually work in (Risolve: six).

**Page**: the scrolling content inside the sheet, 1280 px max. With `ask`, it docks an AskBar at
the bottom and the content scrolls above it.

**AskBar**: suggested questions on one line above a white input with a dark round send button.
This is where explanations go: instead of writing a subtitle, make the question askable. Write the
suggested questions from the data on the page ("Which orders are over the credit limit?"), never
generic ones ("How can I help?").

**ChipRail**: the suggested questions row. Sits still when it fits; glides slowly when it doesn't.

**Toolbar**: the Search capsule, a + capsule and the account, at the right of every PageHeader.

## Page structure (index.tsx)

**PageHeader**: one 30 px bold title and the page's controls on the right (filters, toolbar).
There is deliberately no subtitle prop. Don't add one.

**Section**: a 17 px bold heading with an optional aside, then content. No frame.
Use it to split a page into a few named parts. If a page has more than four sections, it is
probably two pages.

**Card**: frames one object: a chart, a map, a single widget on a Home desk. Not for lists,
tables, forms or groups of stats. Test: if you removed the card, would the thing inside lose its
edges (a chart's plot area, a map)? Then it earns a card. If it would just sit on the sheet fine,
it doesn't.

**Legend**: a dot and a label, for a chart card's aside.

## Numbers

**Kpi**: a label, one big number, an optional short line ("was 7"), a chevron when it links.
Every card is the same quiet sheet; only the number takes colour, and only `tone="good"` (money
saved, a quantity to act on) uses `signal-deep`. A strip of four `size="sm"` at the top of Home is
the pattern. Don't put KPIs on a list page whose filters already show the same counts.

**Stat**: a number straight on the sheet with a small label. Use inside a drawer or a section
where a KPI card would be too heavy.

**Meter**: a 6 px fill bar: how full a truck is, how many weeks of cover are left. `wrong` tone
only when it has run out.

## Status

**Pill**: 28 px, 14 px text, five tones:

| Tone | Looks | Means | Example labels |
|---|---|---|---|
| `done` | signal fill, bold | The one positive state that should shout | Delivered, Paid, Confirmed |
| `acted` | tint with rim, bold | The system did it on its own | Auto: split, Auto: fixed |
| `needs` | yellow, bold | A person must act | Price differs, Over credit limit, Needs you |
| `quiet` | tint, soft ink | Moving, waiting, informational | Roasting, Packed, With retailer |
| `reject` | soft red, bold | An outcome that failed | Rejected, Card declined, Bounced, Cancelled |

Write the specific reason in a `needs` pill ("Short 3 kg"), not a generic one ("Attention"), so
each row says something different. Most rows on a healthy screen should be `quiet`.

**WrongMark**: a small red ✗ beside a value that is wrong. The only red that is allowed to be
eye-catching, because it is tiny.

## People

**Owner** ("On it"): a face, the first name in bold, then the role or what they are doing in soft
ink: "Marta · Accounts · check the quote". Use it wherever the question "who has this now?"
matters. For the system acting on its own, pass `kind="system"` and your product's mark.
Use real photos when the product has them; initials on ink otherwise. Never stock illustrations.

**Avatar**: the face alone. Company logos go in `kind="company"` with a `photo` (a square logo).

## Actions

**Btn**: a 34 px pill. `primary` (dark) for the one action a view exists for: "Send to the
transport planner", "Approve". Everything else is `quiet` or `outline`. Two dark buttons on one
screen means one of them is wrong.

**Segmented**: the glass filter control, with counts: All 24 · Needs you 4 · Moving 12 · Done 8.
The counts replace the sentence a subtitle would have said.

## Tables and details

**DataTable**: header in 13 px soft ink, 60 px rows split by hairlines, 15 px cells, one `main`
column in 16 px bold, money right-aligned in bold ink, no box, no zebra stripes, rows highlight
white on hover and open a Drawer. Choose columns that differ per row; if a column says the same
thing in most rows, drop it. Put the rows that need a person first, but hide nothing.
Mark three or four columns `essential` (the ID, the value, the status); on phones the others hide
and their data lives in the drawer.

**Drawer**: details slide in from the right edge of the sheet (620 px). Use it instead of a list
beside a detail panel, and instead of a separate detail page for anything you look at briefly.

**Facts**: a two-column key and value list for a drawer.

**SourceTag**: an 11 px tag beside a figure naming the document it came from. Use on any number
someone might act on or question.

**DocLink**: a downloadable document chip.

## Formats

`money`, `qty`, `day`: "€3,600", "1,250", "12 Nov". Never show ISO dates, ISO week numbers or raw
codes to people. Set the locale and currency once.

## Not in the kit, on purpose

- A boxed `Panel` for page content (Risolve kept one only for chat answers).
- A subtitle, description or eyebrow prop on any header.
- Stat tiles, icon-in-a-circle feature cards, gradient hero blocks, badges reading "New".
- Toasts and banners explaining what the system does. If the system did something, it shows in
  the row (an `acted` pill, the system as owner).
