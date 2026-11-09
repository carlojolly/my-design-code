# Companion stack

Route work to the right tool. Do not vendor these repos; install and call them.
Every recommendation below is tracked in `provenance.md`.

## Decision tree

1. **New marketing / company site** → Taste Skill (`source:taste-skill`) for screen plan + browser gate; then 21st for sections; then Impeccable polish.
2. **App screens / dashboards / inboxes / CRM / ops** → **Risolve UI** (`source:risolve-ui`, skill `../risolve-ui`) as the go-to look. Theme → one frame → seeded data → kit → `audit_page.mjs` → correction pass → `check_ui.py`. Do not run unslop on its output.
3. **Iterate existing UI** → If it’s an app screen in the Risolve style, stay on Risolve UI. Otherwise Impeccable steer/critique/audit/polish/detect (`source:impeccable`).
4. **Need a marketing section fast** → 21st search/install (`source:21st-dev`), then restyle tokens.
5. **Need motion** → see `motion-stack.md` (`source:motion-primitives`, `source:animate-ui`).

## Risolve UI (go-to for app screens)

**Source:** `source:risolve-ui` · `skills/risolve-ui/` · provenance: `risolve.app-screens`

Calm, large, designed-by-a-person back-office look (one ink, one signal colour, tables on the sheet, faces and real numbers). Includes a themeable React + Tailwind v4 kit, `derive_theme.py`, screenshot audit, and static checker.

```bash
# From a product app after inventory:
python3 skills/risolve-ui/scripts/derive_theme.py --ink "#14233c" --accent "#2f6bff" > app/tokens.css
# Copy kit into the project, build the main frame, then:
node skills/risolve-ui/scripts/audit_page.mjs http://localhost:3000 / /orders --out ui-audit
python3 skills/risolve-ui/scripts/check_ui.py src/
```

Invoke as `/risolve-ui`. Prefer over unslop and ui-ux-pro-max for app screens. Not for marketing or landing pages.

## shadcn/ui

**Source:** `source:shadcn-ui` · https://github.com/shadcn-ui/ui · provenance: `prim.shadcn-base`, `prim.button`, `prim.dialog`, `prim.input`

Default accessible primitive layer (Button, Dialog, Input, etc.). Open code lands in the project. Under Risolve UI, the kit expects a shadcn-style `cn` at `@/lib/utils`; still use shadcn for dialogs/forms that the kit doesn’t cover.

```bash
npx shadcn@latest init
npx shadcn@latest add button dialog input
```

Tag installed files in `agents.md` Components with the matching provenance id.

## 21st.dev

**Source:** `source:21st-dev` · see `twentyfirst-dev.md` · provenance: `catalog.21st-sections`

Search/install real React/Tailwind sections before inventing. Adapt to project tokens.

## Motion Primitives

**Source:** `source:motion-primitives` · https://github.com/ibelick/motion-primitives · see `motion-stack.md`

Section/hero motion built with Motion + Tailwind. Docs: https://motion-primitives.com/docs

## Animate UI

**Source:** `source:animate-ui` · https://github.com/imskyleen/animate-ui · see `motion-stack.md`

Animated drop-ins for Radix / Base UI / React Aria — swap imports on existing shadcn primitives.

```bash
npx @animate-ui/cli@latest animate all
# or animate specific components after shadcn exists
```

Opt-in only (`motion.animate-ui-opt-in`). Do not auto-animate every control.

## Taste Skill

**Source:** `source:taste-skill` · https://github.com/Leonxlnx/taste-skill · skill id `design-taste-frontend`

Install:

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

Use for company/marketing sites: classify business, plan screen-by-screen, one section per desktop viewport, real product UI/photos, browser consistency checker + finish gate. Needs Node 22+ and Chrome/Chromium.

## Impeccable

**Source:** `source:impeccable` · https://github.com/pbakaus/impeccable

Install:

```bash
npx impeccable install --providers=claude,cursor --scope=project
```

Then in agent chat: `/impeccable init`, later `/impeccable document`, and steer with `critique`, `audit`, `polish`, `bolder`, `quieter`, etc.

CLI detector:

```bash
npx impeccable detect src/
npx impeccable detect http://localhost:<port>
```

Keep `PRODUCT.md` / `DESIGN.md` aligned with this pack’s `context.md` (product narrative) after UI approval.

## Personal overrides vs companions

Owned files win for this user’s projects: `typography.md`, `taste-memory.md`, `design-checklist.md`, `motion-stack.md`, `ui-craft-patterns.md`.

- Taste Skill already lists Space Grotesk among faces to avoid; this pack additionally enforces `type.no-space-grotesk`, `type.no-decorative-mono`, and `type.no-bullet-char` as **personal** rules.
- If Taste Skill / 21st / Impeccable / catalog code suggests decorative monospace chrome, the rejected tracked-caps eyebrow, or a non-approved face, **restyle after install**. Do not fork or patch third-party skill packages to encode personal taste.
- `proposed` fonts in `typography.md` stay out of the default pool until visual approval.

## Our pack

**Source:** `source:our-skill` — inventory, checklist, craft refs, typography, DoD, a11y, provenance, taste-memory, project docs templates.
