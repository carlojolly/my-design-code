# Layouts

Read this when composing a screen. Four patterns cover almost every back-office screen Risolve
has. Start from the one that fits, then compose the whole frame before splitting it into
components.

## Contents
- Every screen answers three questions
- The window
- Home: the desk
- The inbox: one table and a drawer
- A working page: sections on the sheet
- Narrow screens
- Empty, loading and error states

## Every screen answers three questions

From the team's build prompt: "What is happening? Is anything wrong? Do I need to do anything?"
Before building, write the three answers for the screen in one line each, using the seeded data.
The layout follows: what needs a person goes first and in yellow, what is fine is quiet, and what
is happening is the bulk of the screen in plain rows.

## The window

```
┌ window tint (10 px padding) ─────────────────────────────────────────────┐
│ ┌ rail 230 px ┐ ┌ sheet ──────────────────────────────────────────────┐ │
│ │ ■ Brand      │ │  Title                      [filters] (Search) (+) ● │ │
│ │              │ │                                                     │ │
│ │ ⌂ Home       │ │  content, max 1280 px, 36 px sides                  │ │
│ │ ▣ Orders  4  │ │                                                     │ │
│ │ ◇ Stock      │ │                                                     │ │
│ │              │ │                                                     │ │
│ │ Customers    │ │        [ suggested questions ]                      │ │
│ │ ▪ Name       │ │        [ Ask about these orders…            (↑) ]   │ │
│ └──────────────┘ └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

- Three tint steps give the depth: window, rail, sheet. No drop shadow does it.
- The nav badge is yellow and counts only what waits on a person.
- The list under the nav is real things people jump to (customers with logos), not settings.

## Home: the desk

```
Home                                                        (Search) (+) ●
┌ Waiting for you ┐┌ Orders ┐┌ Invoiced, net ┐┌ Claims ┐     4 small KPIs
│ 4             › ││ 27   › ││ €184,320    › ││ 9    › │
└─────────────────┘└────────┘└───────────────┘└────────┘
┌ To do ──────────┐┌ Runs short ────┐┌ Trucks, 6 Nov ──┐     3 desk widgets
│ ● face  case  → ││ Carnaroli 1 kg ││ [map]           │     (boxed: each is
│ ● face  case  → ││ ▬▬▬▬▬▬▬░░ 3 wk ││ 2 trucks, not 6 │      one object)
│ Nothing else.   ││ …              ││ 585 km saved    │
└─────────────────┘└────────────────┘└─────────────────┘
          [ Which orders need me today? ] [ … ]
          [ Ask anything about the business…                      (↑) ]
```

- Home in Risolve went from a chat with a summary to this desk. The chat is the ask bar.
- The ask bar is one line until it has focus; its suggested questions appear then. On a page
  whose main content is a table, check the first rows that need a person are visible above it.
- KPIs: four, `size="sm"`, each linking to its page. One may be `good` (signal-deep number).
- Widgets: three at most, equal height. Each is a short list (up to about 6 items) with an empty
  line written as a sentence ("Nothing runs short in the next 8 weeks."), and links to its page.
  These are the only boxed lists in the app.
- The desk is 1080 px wide in Risolve; the ask column 980 px.

## The inbox: one table and a drawer

```
Orders                      [All 24 | Needs you 4 | Moving 12 | Done 8] (Search) (+)
Order     Customer        What               On it                     Due     Value   Status
NR-2318   Kaffebaren      Ethiopia · 24 kg   (M) Marta · check quote   10 Nov   €612   [Price differs]
NR-2315   Drop Coffee     Decaf · 8 kg       (J) Jonas · split or wait 11 Nov   €236   [Short 3 kg]
NR-2317   Bröd & Salt     Espresso · 60 kg   (J) Jonas · Roastery      10 Nov  €1,140  [Roasting]
…  24 rows, 60 px each, hairlines, no box                     → row click opens the drawer
          [ suggested questions ]  [ Ask about these orders… ]
```

- This replaced Risolve's boxed list beside a boxed detail panel (the most common generated
  layout). `assets/examples/orders-page.tsx` is a full worked example.
- Filters with counts replace the sentence a subtitle would say.
- Columns: the ID (main, bold), who it's for, what it is, who has it now, when, the value
  (right, bold), the status with the specific reason. Drop any column that repeats.
- Rows needing a person first. Nothing hidden.
- The drawer holds the detail: a 26 px title, the pill, Facts, documents, the decision buttons
  (one primary).

## A working page: sections on the sheet

For pages like Stock or Shipping that mix a picture with lists.

```
Shipping                                         [Routes | Dock] (Search) (+) ●
┌ Trucks, 6 Nov ─────────────────────── ● Grok ● old way ┐   one Card: the map
│ [ map ]                                                 │
└─────────────────────────────────────────────────────────┘
2 trucks instead of 6 · 1,006.7 km instead of 1,591.7          a line of facts, no box
Truck      Stops                     Load          Leaves                  table on the sheet
PV-01      Carrefour → Esselunga     31 of 33 ▬▬▬  6 Nov, 06:00
                                        [ Send to the transport planner ]   the one primary
```

- One Card for the one picture. Everything else on the sheet.
- The result as a plain sentence with numbers ("2 trucks instead of 6"), not a stat tile grid.
- One dark primary button for the action the page exists for.

## Narrow screens

Risolve was built desktop first, and at 800 px its toolbar wraps and the Orders table gets cut.
Do better than the original:
- Under 768 px the sidebar becomes a top row of icons (the shell does this).
- The page header wraps: title on its own line, filters and toolbar below, Search collapses to
  its icon.
- Tables keep the ID, the main fact, the value and the status (`essential` columns in the kit);
  the rest moves into the drawer. Never let a table scroll sideways on a phone; never shrink row
  height or text to fit.
- Filters scroll inside their capsule rather than running off the edge (the kit does this).
- Check with `audit_page.mjs … --width 390 --height 844`.
- The drawer becomes full width.

## Empty, loading and error states

- Empty: a short sentence in 15 px soft ink, centred where the rows would be: "No orders here.",
  "Nothing to do." Never an illustration, never "No data available".
- Loading: a tint block with a slow pulse, the size of what is coming. No spinners in tables.
- Error: say what didn't load and what to do, plainly: "The orders could not be loaded. Try again
  in a moment." No error codes.
