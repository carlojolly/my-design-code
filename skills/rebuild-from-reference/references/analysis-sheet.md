# Reference analysis sheet

**Source:** `source:our-skill` · provenance: `rebuild.analysis-sheet`

Fill this from the **actual** URL capture or screenshot before writing markup.
Copy into `decision.md` (short form is fine) so later taste feedback can find it.

## Identity

| Field | Notes |
|-------|-------|
| Input type | url / screenshot / catalog-prompt / hybrid |
| Reference | URL, filename, or catalog slug |
| Surface | marketing page / app shell / dashboard / single section / component |
| Rebuild mode | inspired / faithful (see `rebuild-modes.md`) |
| Product to ship for | whose brand/copy/data replaces the reference |

## First viewport

- Brand / wordmark treatment (size, weight, placement)
- Dominant visual (full-bleed photo, product UI, abstract, none)
- Headline + support line (tone, length — rewrite for inspired mode)
- CTA group (primary / secondary hierarchy)
- What is **not** in the first viewport (do not add clutter)

## Layout system

- Grid / columns / max width / gutter
- Section rhythm (one job per section? sticky nav? split panes?)
- Card usage (none / interactive only / dense app cards)
- Density (air / comfortable / compact dashboard)

## Typography

- Display / body / mono families (or close substitutes if licensed fonts unknown)
- Scale: H1 / H2 / body / caption sizes and tracking
- Alignment habits (left, centered hero, asymmetric)

## Color & material

- Background treatment (flat / gradient / photo / pattern / mesh)
- Surface / panel / glass (blur, opacity, edge light, tint)
- Accent + semantic colors (success / warn / danger if present)
- Light / dark / both; host-theme tokens vs local theme

## Components observed

List concrete blocks to rebuild or search in 21st/shadcn:

- Nav / dock / rail
- Hero
- Stats / charts
- Forms / search
- Tables / transaction lists
- Pricing / FAQ / footer
- Settings drawers / toasts / empty states

For each: note interactions (tabs, filters, theme toggle, export, etc.).

## Motion

- Entrance (hero / staggered panels)
- Micro-interactions
- Reduced-motion behavior if obvious

## Responsive clues

- What collapses first (side rail → bottom dock, multi-column → stack)
- Hidden chrome on small screens

## Gaps / assumptions

Anything not visible in the reference that still needs a decision (data shape,
routing, auth chrome). List assumptions explicitly instead of inventing product
claims.
