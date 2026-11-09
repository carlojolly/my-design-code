# Design checklist: 20 ways to unslop AI designs

**Source:** `source:user-notes` · provenance: `checklist.unslop-20`, `anti.*`, plus Baseline type overrides in `typography.md`

Run before calling UI done. Mark each item.

## Remove visual clutter

- [ ] **1.** Delete filler badges. (`anti.filler-badges`)
- [ ] **2.** Drop redundant labels. Omit section labels that only repeat the heading below (`type.section-label-sentence`).
- [ ] **3.** Unitalicize random words.
- [ ] **4.** Mono only where needed (code, IDs). **Never** decorative monospace for headings, nav, marketing copy, section labels, or badges (`type.no-decorative-mono`). Tabular numbers use `font-variant-numeric: tabular-nums`, not a mono family.
- [ ] **13.** Remove embellishments that do not carry meaning.

## Establish a consistent visual system

- [ ] **5.** Use a design system (tokens + shared components). Prefer shadcn base (`prim.shadcn-base`).
- [ ] **11.** Add one clear accent colour (tight palette — `craft.tight-palette`).
- [ ] **12.** Keep icons consistent (one family, one stroke weight).
- [ ] **14.** Inner radius = outer radius − padding.
- [ ] **15.** Improve text contrast.
- [ ] **18.** Use tabular numbers for stats and prices.

## Improve hierarchy, layout, and messaging

- [ ] **6.** Show the actual product (`craft.product-in-hero`).
- [ ] **7.** Enlarge the main feature.
- [ ] **8.** Group with spacing (not boxes for everything).
- [ ] **9.** Make headlines specific.
- [ ] **10.** Emphasize the CTA (`craft.cta-hierarchy`).
- [ ] **16.** Wrap headlines properly (no awkward orphans if avoidable). Adapt Baseline-scale heroes for content length and narrow screens (`type.hero-baseline`).
- [ ] **17.** Align by eye, not only by pixel grid.

## Add useful interaction feedback

- [ ] **19.** Add loading states.
- [ ] **20.** Animate useful feedback only (see `motion-stack.md`). Approved fullscreen menu transitions (`motion.fullscreen-nav-baseline`) count as user-triggered interaction, not decorative motion spam.

## Extra anti-slop (from Impeccable vocabulary)

- [ ] Avoid Inter / Roboto / Arial as the only expressive brand face (`anti.inter-everywhere`).
- [ ] Avoid purple-on-white / purple→indigo gradient defaults (`anti.purple-gradient-slop`).
- [ ] Avoid nested cards and card spam in heroes (`anti.nested-cards`).

## Personal type overrides (Baseline feedback)

Read `typography.md` and `taste-memory.md` before font selection.

- [ ] Default display/support face is **Onest** when no other approved face is specified (`type.onest-default`). Do not assume “approved font = finished typography.”
- [ ] **Do not use Space Grotesk** (`type.no-space-grotesk`).
- [ ] **Do not use the bullet character •** in UI copy, labels, or separators (`type.no-bullet-char`).
- [ ] **Do not use** the rejected tiny tracked-caps label recipe: 0.75rem / weight 500 / uppercase / 0.22em tracking (`type.section-label-tracked-caps`). Prefer the proposed sentence-case treatment pending visual approval (`type.section-label-sentence`).
- [ ] Do not adopt `proposed` provenance fonts (General Sans, Instrument Sans, Manrope) as project defaults until the user approves them.
- [ ] If Taste Skill / 21st / catalog code reintroduces a rejected face or decorative mono chrome, restyle to these overrides — do not fork companion packages.
