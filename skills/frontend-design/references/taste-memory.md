# Taste memory

Living log of what this user likes and rejects. Append-only dated entries.
Agents must honor **Rejected** before applying any provenance id.

Separate **confirmed** (user-approved) preferences from **proposed** alternatives that still need visual approval. Do not treat proposed fonts or treatments as approved defaults.

## Preferred

- Tight 3-color systems with clear hierarchy (`craft.tight-palette`)
- Real product UI in heroes (`craft.product-in-hero`, `taste.real-media`)
- Glass used sparingly for interactive overlays / widgets, not as wallpaper (`mock.glass-card`)
- shadcn primitives as the accessible base (`prim.shadcn-base`)
- One intentional motion moment per page (`motion.hero-entrance`, `motion.no-stack`)
- Approved user-triggered menu transitions are compatible with the restrained-motion policy (`motion.fullscreen-nav-baseline`)

### Confirmed (user feedback)

- 2026-11-08 — **Preferred:** Baseline’s hero typography — Onest 500, uppercase short marketing headlines at large fluid scale with tight leading/tracking, white on darkened photo — id:`type.hero-baseline` · source:`user-feedback:baseline` — see `typography.md`, specimen `assets/baseline-preferences-specimen/`
- 2026-11-08 — **Preferred:** Baseline’s fullscreen navigation opening and closing motion — deep-navy overlay, staggered spring links, exit kept mounted until complete — id:`motion.fullscreen-nav-baseline` · source:`user-feedback:baseline` — see `motion-stack.md`
- 2026-11-08 — **Preferred:** Baseline’s footer composition — CTA band + info grid + utility row in a rounded deep-navy shell with page inset — id:`craft.footer-baseline` · source:`user-feedback:baseline` — see `ui-craft-patterns.md#baseline-footer`
- 2026-11-08 — **Preferred:** Onest as the approved default sans — especially weight **500** for large editorial display and **400** for supporting text — id:`type.onest-default` · source:`user-feedback:baseline` — see `typography.md`

## Rejected

- 2026-11-08 — id:`type.section-label-tracked-caps` — disliked the tiny, widely tracked, uppercase “TRAINING PROGRAMS” label treatment (≈0.75rem / weight 500 / uppercase / 0.22em tracking). **Treatment rejected, not the Onest family.** Action: do not use that recipe as a default section label. Proposed replacement: `type.section-label-sentence` (awaiting visual approval). Source:`user-feedback:baseline`
- 2026-11-08 — id:`type.no-space-grotesk` — do **not** use Space Grotesk on this user’s projects. Personal preference rule, not a claim that the font is objectively bad. Source:`user-feedback:baseline`
- 2026-11-08 — id:`type.no-decorative-mono` — do **not** use monospace for expressive headings, navigation, marketing copy, section labels, badges, or decorative “technical” styling. Keep monospace only when function requires it (e.g. code examples). Tabular numbers do not require a monospace family. Source:`user-feedback:baseline`
- 2026-11-09 — id:`type.no-bullet-char` — do **not** use the bullet character **•** (U+2022) in UI copy, labels, separators, or decorative lists. Prefer plain words, commas, en dashes, or structured lists without that glyph. Source:`user-feedback`

<!-- Example:
- 2026-11-08 — id:motion.animate-ui-opt-in misuse — disliked constant motion on form controls — action: keep Animate UI opt-in only; never auto-animate inputs — replaced_by: prim.input
-->

## Proposed (awaiting visual approval)

These are **not** approved defaults. Do not rotate them in, and do not mix several candidate families on one page while they await sign-off.

- 2026-11-08 — id:`type.candidate-general-sans` — General Sans as a candidate for restrained, confident headings and supporting UI · source:`assistant-proposed` · see `typography.md`
- 2026-11-08 — id:`type.candidate-instrument-sans` — Instrument Sans as a candidate for editorial headings and versatile supporting text · source:`assistant-proposed` · see `typography.md`
- 2026-11-08 — id:`type.candidate-manrope` — Manrope as a candidate for clean, structured product typography · source:`assistant-proposed` · see `typography.md`
- 2026-11-08 — id:`type.section-label-sentence` — proposed default section-label treatment (sentence case, same family, ~0.875–1rem, weight 400/500, normal tracking ≤0.02em) · source:`assistant-proposed` · replaces rejected `type.section-label-tracked-caps` pending visual approval · see `typography.md#section-labels`

## Replaced

_(none yet — proposed replacements above are not confirmed)_

<!-- Example:
- 2026-11-08 — id:mock.glass-card — too much glass on marketing heroes — replaced_by: craft.hero-composition flat full-bleed photo heroes for place/service pages
-->

## Scope notes (do not over-infer)

- Confirmed preferences cover **hero typography**, **fullscreen nav motion**, **footer composition**, **Onest**, and the two rejections above — not every aspect of Baseline, not its entire animation system, and not blanket approval of uppercase, dots, badges, or footer column headings.
- Uppercase remains appropriate where already approved (e.g. Baseline hero). Do not ban uppercase globally because the section-label treatment was rejected.
- Do not expand the rejected-font list beyond what the user has stated.
