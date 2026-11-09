# Rebuild modes

**Source:** `source:our-skill` · provenance: `rebuild.modes`

## Inspired rebuild (default)

Use when the user shares a **website they like** or a **screenshot** as direction.

| Keep from reference | Replace |
|---------------------|---------|
| Composition / hierarchy | Brand name, logo, voice |
| Density, rhythm, section jobs | Product claims and copy |
| Material language (glass, borders, type scale) | Proprietary photos/illustrations |
| Interaction patterns (dock nav, filters) | Competitor data and trademarks |

Goal: someone who saw the reference should recognize the **craft**, but the page
clearly belongs to the user’s product (frontend-design “brand test”).

## Faithful install

Use when:

- The user pasted a **catalog install prompt** (21st / shadcn registry / similar)
- They own the design (their Figma, their production site being ported)
- They explicitly ask for a pixel-close match of a component they may use

Keep structure, class names when required by the prompt, demo data until real
props are wired, and listed dependencies. Still fix paths, aliases, and broken
assets. Restyle to host tokens only if asked.

## Partial rebuild

Use when the reference is one section (pricing, hero, dashboard widget). Rebuild
only that section; do not invent a full marketing site around it.

## Anti-goals

- Do not scrape private/authenticated app UIs the user cannot access
- Do not copy trademarked logos, mascots, or proprietary illustrations into
  inspired rebuilds
- Do not “improve” the reference into a generic AI template (purple gradients,
  Inter-only type, badge spam) — match its actual taste, then apply this pack’s
  unslop checklist without erasing the reference’s identity
- Do not ship lorem or fake street addresses; use honest sample labels when data
  is placeholder
