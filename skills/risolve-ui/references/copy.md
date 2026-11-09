# Copy

Read this when writing labels, statuses, empty states and questions. First what really changed
in Risolve, then shipped copy worth copying, then the rules.

## Before and after in Risolve (from the git history and screenshots)

| Where | Before the redesign | After |
|---|---|---|
| Orders page | Title "Orders" + "7 orders shown, 0 need attention. Agents do the steps; a person approves what needs a person." | "Orders", with filters "All · Needs you · Moving · Done", each with its count |
| Stock page | "Available to promise = released + planned ready by the date − confirmed not shipped. Batches on quality hold never count." | Nothing under the title |
| Stock columns | 23 different column names across the stock tables: Physical on hand, Available to promise, Reserved, Quality held, Projected closing, Committed… | 7: Product, Available, Promised, On hold, Next batch, Suggested batch, Status |
| Stock footnote | "Physical = released + quality held. Reserved = confirmed orders not shipped…" | Removed; the ask bar answers "why" |
| Product cell | `CAR-1KG` | Carnaroli 1 kg |
| Status | Approval required, Needs a person | Needs you |
| Sign-off pill | Needs you, on every row | The reason: Price error, Warehouse |
| Orders rows | "All checks passed; confirmed by Giulia, order desk" on 6 of 7 rows, "no date" on 7 of 7 | Removed; "On it" shows who has it, "Due" shows a date |
| Week columns | 2026-W45, 2026-W46 | 12 Nov, or "6 of 12 weeks" |

## Shipped copy worth copying

| Where | Copy |
|---|---|
| Home KPIs | Waiting for you · Orders · Invoiced, net · Claims |
| Home widgets | To do · Packs · Trucks, 6 Nov |
| Empty to-do | Nothing to do. |
| Empty shortages | Nothing runs short in the next 8 weeks. |
| Search, nothing found | Nothing found. |
| Empty table | No orders here. |
| Load error | The orders could not be loaded. Try again in a moment. |
| Answers on screen | Buy 60.8 t · €335 saved · 2 trucks instead of 6 |
| Primary button | Send to the transport planner |
| Ask bar | Ask Grok about the orders… |
| System acted | Grok: split · Grok: fixed |

## Typical generated copy, rewritten the same way (illustrations, not from Risolve)

| Generated | Risolve way |
|---|---|
| Welcome back, Sarah! Here's what's happening today. | (nothing; the screen shows it) |
| Pending approvals | Waiting for you |
| No data available | Nothing runs short in the next 8 weeks. |
| Exception: quantity mismatch | Short 3 kg |
| Credit check failed (E-204) | Over credit limit |
| Assigned to: Accounts queue | Marta · check the quote |
| Probability of price increase: 0.62 | Buy 60.8 t |
| Submit | Approve · Send to the transport planner |
| How can I help you today? | Ask about these orders… |

## Rules

- **Say the thing, not the system.** "Short 3 kg", not "Exception: quantity mismatch".
  "Over credit limit", not "Credit check failed (E-204)".
- **Answers, not data.** Where the system has worked something out, show the conclusion in plain
  words with its number: "Buy 60.8 t", "3 trucks instead of 5". The data behind it goes in the
  drawer with a source tag.
- **Name people.** "Marta · check the quote", not "Assigned to: Accounts queue".
- **Sentence case, short.** Labels of one to three words. Buttons say what happens: "Approve",
  "Send to the transport planner", never "Submit" or "OK".
- **No em dashes.** Use a comma, a colon or a full stop. (This was the rule most often broken by
  agents after the redesign.)
- **No explanations on the page.** If a label needs a sentence to be understood, change the label.
  If people will ask why, make it a suggested question in the ask bar.
- **No filler.** Never "Welcome back", "Here's an overview", "Manage your X with ease", "at a
  glance", "Get started by…".
- **Empty states are sentences that end in a full stop** and say what is true: "Nothing to do."
- **Errors say what happened and what to do**, without codes.
- **Numbers are formatted for people**: "€3,600", "1,006.7 km", "12 Nov", "6 of 12 weeks".
  Aligned with `tabular-nums`.
- **Suggested questions come from the data**: name a real order, product or person on the page
  ("Is NR-2315 worth splitting?"), so they show the ask bar knows the business.
- **Honest states.** Never say "AI active" unless something is running. Mark estimates as
  estimates ("Forecast", a source tag), and demo data as demo data.

## Seeding realistic data

The design can't be judged on placeholder data: Risolve's kit port had one order and looked
empty, and the redesign's first step was a demo world with 23 orders and 13 retailers.
Before styling:
- 20 or more rows in every list, a realistic mix: most fine, a few needing a person (about 1 in 6),
  some done.
- Real-sounding names that fit the place (Swedish cafés for a Stockholm roaster, Italian
  retailers for an Italian mill), varied amounts with uneven numbers (€612, not €500), dates
  spread over the week.
- People with first and last names and roles; photos if the project has them, initials otherwise.
- Companies with logos if available; consistent initials otherwise.
- Specific reasons on rows that need a person, all different.
- Never "John Doe", "Acme", "Lorem ipsum", "Item 1", "Test", round numbers everywhere, or every
  date the same.
