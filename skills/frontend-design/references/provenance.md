# Provenance catalog

Every default this skill recommends. Agents must skip rows with status `rejected`.
Rows with status `proposed` need user visual approval before use as project defaults.
When the user dislikes a pattern, resolve its `id`, then follow the taste-feedback loop in `SKILL.md`.

| id | pattern | source | skill_path | project_trace | status |
|----|---------|--------|------------|---------------|--------|
| workflow.screen-first | Build every screen before deep backend | source:our-skill | screen-first-workflow.md | decision.md | active |
| workflow.screen-inventory | Inventory all screens + empty/loading/error before code | source:our-skill | screen-inventory.md | decision.md | active |
| workflow.project-docs | Create agents.md, decision.md, context.md after UI approval | source:our-skill | ../backend-engineering/references/project-docs-templates.md | repo root | active |
| checklist.unslop-20 | 20-point unslop design checklist | source:user-notes | design-checklist.md | decision.md | active |
| craft.hero-composition | One strong hero composition; brand-first when branded | source:user-mockups | ui-craft-patterns.md | decision.md | active |
| craft.tight-palette | Tight 3-color accent systems (examples only, not forced brands) | source:user-mockups | ui-craft-patterns.md | decision.md | active |
| craft.product-in-hero | Show real product UI in hero, not abstract filler | source:user-mockups | ui-craft-patterns.md | decision.md | active |
| craft.cta-hierarchy | Clear primary solid CTA vs secondary ghost/text CTA | source:user-mockups | ui-craft-patterns.md | decision.md | active |
| craft.footer-baseline | Optional marketing footer: CTA band + info grid + utility row in rounded deep-navy shell | source:user-feedback:baseline | ui-craft-patterns.md#baseline-footer | decision.md | active |
| mock.glass-card | Glass / frosted panels with blur + border (Code XR craft) | source:user-mockups:code-xr | ui-craft-patterns.md#code-xr | agents.md Components | active |
| mock.dashboard-stats | KPI row with trend + sparkline pattern | source:user-mockups:code-xr | ui-craft-patterns.md#code-xr | agents.md Components | active |
| mock.fluxedit-dark-hero | Dark cinematic hero with dual accent glow (example system) | source:user-mockups:fluxedit | ui-craft-patterns.md#fluxedit | — | active |
| mock.palmatech-glass-schedule | Glass schedule widget over vivid photo/gradient hero | source:user-mockups:palmatech | ui-craft-patterns.md#palmatech | — | active |
| prim.shadcn-base | shadcn/ui as default accessible primitive layer | source:shadcn-ui | companion-stack.md#shadcnui | agents.md Components | active |
| prim.button | shadcn Button as default CTA primitive | source:shadcn-ui | companion-stack.md#shadcnui | agents.md Components | active |
| prim.dialog | shadcn Dialog for modals | source:shadcn-ui | companion-stack.md#shadcnui | agents.md Components | active |
| prim.input | shadcn Input / form primitives | source:shadcn-ui | companion-stack.md#shadcnui | agents.md Components | active |
| catalog.21st-sections | Prefer 21st catalog for heroes, pricing, nav, dashboard blocks | source:21st-dev | twentyfirst-dev.md | decision.md | active |
| motion.hero-entrance | One intentional hero entrance (Motion Primitives) | source:motion-primitives | motion-stack.md | decision.md | active |
| motion.section-reveal | Sparse section reveals via Motion Primitives | source:motion-primitives | motion-stack.md | decision.md | active |
| motion.animate-ui-opt-in | Animate UI on shadcn primitives only when user asks for motion | source:animate-ui | motion-stack.md | decision.md | active |
| motion.no-stack | Do not stack Animate UI + Motion Primitives + flashy 21st motion by default | source:our-skill | motion-stack.md | — | active |
| motion.fullscreen-nav-baseline | Fullscreen deep-navy nav overlay open/close springs (user-triggered) | source:user-feedback:baseline | motion-stack.md#baseline-fullscreen-nav | decision.md | active |
| taste.screen-by-screen | Plan marketing pages screen-by-screen before markup | source:taste-skill | companion-stack.md#taste-skill | screen inventory | active |
| taste.one-section-viewport | One job / one section per desktop viewport on marketing pages | source:taste-skill | companion-stack.md#taste-skill | — | active |
| taste.browser-gate | Browser multi-width check before calling marketing UI done | source:taste-skill | companion-stack.md#taste-skill | definition-of-done.md | active |
| taste.real-media | Real product UI / photography; no fake street numbers or lorem | source:taste-skill | companion-stack.md#taste-skill | — | active |
| impeccable.critique-audit-polish | After draft UI: critique → audit → polish | source:impeccable | companion-stack.md#impeccable | definition-of-done.md | active |
| impeccable.detect | Run impeccable detect on UI paths / local URL | source:impeccable | companion-stack.md#impeccable | definition-of-done.md | active |
| impeccable.context-files | Keep PRODUCT.md / DESIGN.md in sync with context.md after UI | source:impeccable | companion-stack.md#impeccable | repo root | active |
| a11y.baseline | Focus-visible, contrast, keyboard, reduced motion, mobile | source:our-skill | a11y-responsive.md | definition-of-done.md | active |
| anti.inter-everywhere | Avoid Inter/Roboto/Arial as the expressive brand font by default | source:impeccable | design-checklist.md | — | active |
| anti.purple-gradient-slop | Avoid generic purple-on-white / purple-indigo AI gradient themes | source:impeccable | design-checklist.md | — | active |
| anti.filler-badges | Delete filler badges and redundant labels | source:user-notes | design-checklist.md | — | active |
| anti.nested-cards | Avoid cards-in-cards and card spam in heroes | source:impeccable | ui-craft-patterns.md | — | active |
| type.onest-default | Onest as approved default sans (500 display / 400 support) | source:user-feedback:baseline | typography.md | decision.md | active |
| type.hero-baseline | Short marketing hero type recipe from Baseline (Onest 500 uppercase fluid scale) | source:user-feedback:baseline | typography.md#baseline-hero-typography-recipe | decision.md | active |
| type.section-label-tracked-caps | Tiny tracked uppercase section labels (0.75rem / 500 / uppercase / 0.22em) | source:user-feedback:baseline | typography.md#section-labels | — | rejected |
| type.section-label-sentence | Sentence-case quiet section labels (~0.875–1rem, tracking ≤0.02em) | source:assistant-proposed | typography.md#section-labels | decision.md | proposed |
| type.no-space-grotesk | Do not use Space Grotesk (personal preference) | source:user-feedback:baseline | typography.md | — | rejected |
| type.no-decorative-mono | No decorative monospace for marketing/UI chrome | source:user-feedback:baseline | typography.md | — | rejected |
| type.candidate-general-sans | General Sans candidate (headings / supporting UI) | source:assistant-proposed | typography.md | — | proposed |
| type.candidate-instrument-sans | Instrument Sans candidate (editorial / supporting) | source:assistant-proposed | typography.md | — | proposed |
| type.candidate-manrope | Manrope candidate (structured product type) | source:assistant-proposed | typography.md | — | proposed |

## Source id legend

| source | Meaning |
|--------|---------|
| `source:our-skill` | Defined in this pack |
| `source:user-notes` | From ai-design-and-engineering-notes |
| `source:user-mockups` / `:code-xr` / `:fluxedit` / `:palmatech` | From user reference images in `assets/` |
| `source:user-feedback:baseline` | User-confirmed preference from the Baseline Tennis Club & Academy reference |
| `source:baseline-reference` | Measured/recipe detail captured from the Baseline reference (supporting evidence; prefer pairing with user-feedback when the preference is confirmed) |
| `source:assistant-proposed` | Assistant-proposed alternative awaiting user visual approval |
| `source:shadcn-ui` | https://github.com/shadcn-ui/ui |
| `source:motion-primitives` | https://github.com/ibelick/motion-primitives |
| `source:animate-ui` | https://github.com/imskyleen/animate-ui |
| `source:21st-dev` | https://21st.dev |
| `source:taste-skill` | https://github.com/Leonxlnx/taste-skill |
| `source:impeccable` | https://github.com/pbakaus/impeccable |

## Status legend

| status | Agent behavior |
|--------|----------------|
| `active` | May use when it fits the brief |
| `proposed` | Documented for comparison only; do not adopt as a default until the user approves |
| `rejected` | Never use |
| `replaced` | Use the replacement id instead |
