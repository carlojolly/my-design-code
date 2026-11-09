# UI craft patterns (quality references)

**Source:** `source:user-mockups` (+ per-brand tags)  
These are **craft references**, not mandatory themes. Extract hierarchy, glass, CTAs, product-in-hero, and palette *discipline*. Never force these brand colors on unrelated projects.

Open images under `../assets/` when designing.

## Shared craft (all mockups)

| Pattern | What to copy | What not to force | Provenance |
|---------|--------------|-------------------|------------|
| Hero composition | One dominant visual plane; brand + one headline + one support line + CTA group | Extra stats/schedules cluttering first viewport unless product needs it | `craft.hero-composition` |
| Tight palette | 3 named colors with clear roles (bg / accent / secondary) | Exact hexes from another brand | `craft.tight-palette` |
| Product in hero | Real UI chrome (timeline, media grid, schedule widget, progress ring) | Abstract blobs as the main idea | `craft.product-in-hero` |
| CTA hierarchy | Solid primary + quieter secondary | Equal-weight twin buttons | `craft.cta-hierarchy` |
| Glass | Frosted panels for widgets/overlays with blur + hairline border | Glass wallpaper on everything | `mock.glass-card` |

## Risolve UI (go-to for app screens)

**Source:** `source:risolve-ui` · full skill at `../../risolve-ui/` · provenance: `risolve.app-screens`  
**References:** `../../risolve-ui/assets/screenshots/example-orders-coffee.png`, `history-*.png` (four columns: kit port → pre-redesign → Flavio redesign → live)

For dashboards, inboxes, CRM, and ops tools, **prefer this over Code XR craft and over unslop**. Method, not a forced green brand: derive ink + accent, copy the kit, seed ≥20 real rows, audit, then run the correction pass.

What the history screenshots teach at a glance:
- Col 1–2 look “AI”: subtitles, boxed panels, small type, sameness down every row
- Col 3–4 look designed: one full-width table, 60 px rows, yellow “needs you” with a specific reason, faces in On it, ask bar instead of page copy
- Home became a desk (KPIs + short widgets), not a chat landing

Exact sizes, pills, tokens, and “don’t copy product chrome” live in the skill — don’t re-derive them from these notes alone.

## Code XR (dashboard)

**Assets:** `assets/code-xr-dashboard.jpg`, `assets/code-xr-glassy-v24.jpg`  
**Source:** `source:user-mockups:code-xr`  
**Example palette mood:** warm copper / terracotta glass on soft atmosphere (example only).  
**Note:** For product app screens, prefer Risolve UI (`risolve.app-screens`) over this glass-widget mood unless the user asks for Code XR specifically.

- Narrow frosted sidebar + modular glass widgets
- Sprint/hero card with progress ring and teammate presence
- Calendar strip + agenda with a clear “Next” emphasis
- KPI row: large tabular figures, trend badge, sparkline (`mock.dashboard-stats`)
- Useful hover lift on stats (e.g. Framer Motion `y: -5`) — one subtle interaction language

## FluxEdit (dark product landing)

**Assets:** `assets/fluxedit-landing.jpg`, `assets/fluxedit-hero-hires.jpg`  
**Source:** `source:user-mockups:fluxedit` · provenance: `mock.fluxedit-dark-hero`  
**Example palette:** Midnight Black `#02070A`, Electric Blue `#0297DE`, Cantaloupe Orange `#FC734D` (example only).

- Dark cinematic hero; serif italic for one emphatic word, sans for the rest
- Central primary CTA as focal point
- Social proof metrics flanking, not dominating
- Bottom row of glass feature previews showing **real editor UI** (media library, color curves, timeline)

## Palmatech (health / lifestyle landing)

**Assets:** `assets/palmatech-landing.jpg`, `assets/palmatech-hero-hires.jpg`  
**Source:** `source:user-mockups:palmatech` · provenance: `mock.palmatech-glass-schedule`  
**Example palette:** Sky Blue `#0593C6`, White `#FCFFFF`, Hot Pink `#D83995` (example only).

- Full-bleed colorful atmosphere behind clear white headline
- Pill nav; solid primary “Try for Free” + secondary “Schedule Demo”
- Glass schedule widget with location + level tags (`mock.palmatech-glass-schedule`)
- Feature strip with short lines — one idea each

## Baseline footer (optional marketing composition)

**Provenance:** `craft.footer-baseline` · `source:user-feedback:baseline` (measurements `source:baseline-reference`)  
**Specimen:** [`../assets/baseline-preferences-specimen/`](../assets/baseline-preferences-specimen/)  
Optional reusable composition for marketing sites. Adapt palette, copy, link groups, and radii to the product. **Never** copy fictional Baseline contact information into a real project.

### Exact reference shell

| Token | Value |
|-------|--------|
| Background | Deep navy `#0f2f63` |
| Text | White (check contrast on secondary lines; do not blindly copy opacity values) |
| Outer radius | 2rem |
| Page inset | 0.5rem mobile / 0.75rem desktop |
| Top gap | 0.75rem |
| Padding | 3.5rem 1.5rem mobile / 4rem 2.5rem desktop |

### Layer A — CTA band

- Large two-line heading (e.g. “Ready to / play?”)
- Type: Onest **500**, **3.75rem**, line-height **0.92**, tight tracking
- One contrasting white pill CTA
- Desktop: heading left, CTA right, bottom-aligned
- Mobile: stacked
- Bottom divider + **3.5rem** padding below the band

Apply **proposed** section-label guidance (`type.section-label-sentence`) if a label is needed — do **not** import the rejected tracked-caps eyebrow (`type.section-label-tracked-caps`) into this footer.

### Layer B — Information grid

- Brand, short description, and contact details
- Three clearly grouped navigation columns
- Desktop columns: `1.4fr 1fr 1fr 1fr`
- Gap **2.5rem**; vertical padding **3.5rem**
- Responsive stacking on small screens

### Layer C — Utility row

- Copyright, social links, and legal links
- Thin top divider; **2rem** top padding
- Responsive wrapping or stacking

Use restrained **1px** dividers and readable secondary text. Prefer compositional principles over hex cargo-cult: strong closing invitation, clear hierarchy, generous spacing, organized links, restrained utility row.

## Stack alignment

Prefer implementing these patterns with:

1. shadcn primitives (`prim.*`)
2. 21st sections when a catalog block fits (`catalog.21st-sections`)
3. Motion per `motion-stack.md`
4. Typography + labels per `typography.md` (owned overrides beat companion defaults)
5. Impeccable pass after a draft exists
