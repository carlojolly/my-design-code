# Frontend Design

Orchestrator for frontend and design work. Companions supply craft; this skill owns workflow, gates, project docs, and the living taste ledger.

Read references on demand (do not load everything at once):

- `references/companion-stack.md` — when to use each companion
- `references/provenance.md` — every default pattern → source id (skip `rejected`; do not default to `proposed`)
- `references/taste-memory.md` — preferred / rejected / proposed / replaced
- `references/typography.md` — **read before selecting fonts or section labels** (Onest default, candidates, hard must-nots, Baseline hero + label recipes)
- `references/screen-inventory.md` — fill before coding screens
- `references/screen-first-workflow.md` — GitHub → UI → docs order
- `references/design-checklist.md` — unslop checks + personal type overrides (`source:user-notes` + Baseline feedback)
- `references/ui-craft-patterns.md` — mockup craft refs + optional Baseline footer (`craft.footer-baseline`)
- `references/motion-stack.md` — Motion Primitives + Animate UI rules + approved fullscreen nav (`motion.fullscreen-nav-baseline`)
- `references/twentyfirst-dev.md` — 21st CLI/MCP usage
- `references/a11y-responsive.md` — accessibility + responsive review
- `references/definition-of-done.md` — UI approved gates
- `references/typography.md` — font must-nots + approved Onest default
- `assets/` — quality reference images
- `assets/baseline-preferences-specimen/` — interactive specimen for Baseline type, nav, footer, and rejected-vs-proposed labels

Also use backend templates when creating docs: `../backend-engineering/references/project-docs-templates.md`.

## Workflow (ordered)

1. Clarify product, audience, and constraints. If `context.md` exists, read it.
2. Fill a **screen inventory** (`references/screen-inventory.md`) — every screen + empty/loading/error — before markup.
3. **Typography first pass:** read `references/typography.md` + rejected entries in `taste-memory.md` before choosing fonts. Default to Onest when no other approved face is specified. Keep `proposed` candidates out of production defaults. Usually one family well.
4. Route via `references/companion-stack.md`:
   - Marketing / company site → Taste Skill patterns (and skill if installed)
   - App UI → **shadcn/ui** primitives first
5. Prefer **21st.dev** catalog sections before inventing large blocks (`references/twentyfirst-dev.md`). After install, restyle any companion/catalog defaults that conflict with owned overrides (Space Grotesk, decorative mono, rejected label recipe) — do not fork third-party packages.
6. Add motion only when useful (`references/motion-stack.md`). Do not stack Animate UI + Motion Primitives + flashy 21st motion by default. Honor `prefers-reduced-motion`. Approved user-triggered fullscreen menu transitions are in-policy (`motion.fullscreen-nav-baseline`).
7. Apply craft patterns + `references/design-checklist.md`. Never force FluxEdit / Palmatech / Code XR brand colors onto unrelated products. Optional marketing footer: `craft.footer-baseline`.
8. **Tag provenance** for every non-trivial UI choice:
   - Append `decision.md` with timestamp, `source:…`, `provenance_id:…`
   - Update `agents.md` Components table: path → provenance_id → source
   - Only use patterns with status `active` in `references/provenance.md` (skip `rejected`; treat `proposed` as awaiting approval)
9. If Impeccable is installed: `critique` → `audit` → `polish`; run `npx impeccable detect` on UI paths or the local URL when possible.
10. Run `references/a11y-responsive.md`.
11. Gate on **UI definition of done** (`references/definition-of-done.md`). Get user sign-off before deep backend.
12. Create/update `context.md`, `decision.md`, `agents.md`. If Impeccable is present, sync product narrative into `PRODUCT.md` and after UI approval run document → `DESIGN.md`.

## Taste feedback (when the user rejects a look)

Trigger phrases: “remove this”, “never do that again”, “I don’t like X”, “stop using Y”.

1. Search project `agents.md` / `decision.md` for the component → resolve `provenance_id`.
2. If missing, search `references/provenance.md` by symptom (pill badges, glass everywhere, bounce on inputs, purple gradients, Space Grotesk, decorative mono, bullet character •, tracked-caps labels, etc.).
3. Show the user: **source**, **skill file path**, **what it recommended**, and ask:
   - Remove from skill permanently?
   - Replace with an alternative (propose from preferred sources / `taste-memory.md`)?
   - One-off for this project only?
4. If they confirm a skill change: edit the skill reference, set the provenance row to `rejected` or `replaced`, append `references/taste-memory.md`, and install the replacement guidance. Keep confirmed preferences separate from `proposed` / `source:assistant-proposed` alternatives.
5. Fix the current project UI to match.

## Hard rules

- Skip any provenance id with status `rejected`. Do not ship `proposed` ids as defaults without visual approval.
- Real product UI in heroes when the product has a UI; no abstract filler as the main visual.
- One job per section; strong primary vs secondary CTA.
- Cover loading, empty, and error states for interactive surfaces.
- Restyle installed catalog components to project tokens **and** to owned type/motion overrides.
- Preserve the symlink install layout (edit `skills/frontend-design/` only; do not duplicate divergent skill copies).
