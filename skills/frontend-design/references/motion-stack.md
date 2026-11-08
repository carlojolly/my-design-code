# Motion stack

**Sources:** `source:motion-primitives`, `source:animate-ui`, `source:our-skill`, `source:user-feedback:baseline`  
**Provenance ids:** `motion.hero-entrance`, `motion.section-reveal`, `motion.animate-ui-opt-in`, `motion.no-stack`, `motion.fullscreen-nav-baseline`

## Default policy

1. Prefer **static, clear UI** first (shadcn primitives).
2. Add **one** intentional motion moment per page when it helps hierarchy (usually a hero entrance).
3. Optionally add **one** secondary dealt moment (section reveal), not a circus of animations.
4. **Do not stack** Animate UI + Motion Primitives + flashy 21st motion on the same surface by default (`motion.no-stack`).
5. Always respect `prefers-reduced-motion` (static fallbacks).
6. **Approved user-triggered menu transitions** (below) are compatible with this restrained policy. They are not permission to animate every page element.

## Motion Primitives (`source:motion-primitives`)

- Repo: https://github.com/ibelick/motion-primitives
- Docs: https://motion-primitives.com/docs
- Use for: hero entrance, text/image reveals, spotlight moments on marketing or product showcases.
- Tag: `motion.hero-entrance` / `motion.section-reveal` in `decision.md` and `agents.md`.

## Animate UI (`source:animate-ui`)

- Repo: https://github.com/imskyleen/animate-ui
- Use to animate **existing** shadcn/Radix primitives after the user asks for motion on controls.
- CLI: `npx @animate-ui/cli@latest animate all` (or per-component).
- Tag: `motion.animate-ui-opt-in`.
- Do **not** auto-animate form inputs, checkboxes, or dense data tables unless requested.

## With 21st / Taste Skill / Impeccable

- If a 21st section already includes strong motion, skip adding Motion Primitives on top.
- Taste Skill may deal hero entrance + 1–2 moments — treat those as the motion budget.
- Impeccable `animate` / `delight` / `overdrive` are steer commands after a draft exists; still honor the no-stack rule and reduced motion.
- If a catalog nav ships with abrupt show/hide or decorative monospace labels, restyle to owned overrides (`typography.md`, this fullscreen-nav recipe).

## Baseline fullscreen navigation

**Provenance:** `motion.fullscreen-nav-baseline` · `source:user-feedback:baseline` (recipe detail also `source:baseline-reference`)  
**Specimen:** [`../assets/baseline-preferences-specimen/`](../assets/baseline-preferences-specimen/)  
**Status:** Approved **interaction pattern** for marketing sites when a fullscreen menu fits. Not a license to animate everything.

### Reference appearance

- Fullscreen overlay fill: deep navy `#0f2f63`
- Brand mark top left; circular close control top right
- Large vertically stacked navigation links
- Bottom row: primary CTA + secondary social links
- Align the header menu trigger and overlay close control on the same vertical/horizontal rhythm

### Opening (tension / friction spring model)

These numbers describe a **tension/friction spring** model. Map them into the project’s existing motion solution (Motion, a small spring helper, etc.) — do not copy blindly into incompatible APIs (CSS transition-only stacks, mismatched spring units).

| Layer | From → to | Spring |
|-------|-----------|--------|
| Backdrop | opacity 0 → 1 | tension 260 / friction 30 |
| Panel | opacity 0 → 1, translateY(-24px) → 0 | tension 220 / friction 28 |
| Links | opacity 0 → 1, translateY(28px) → 0 | tension 200 / friction 26 |

Link delays: `120ms + index × 70ms`.

### Closing

- Animate backdrop out and panel toward opacity 0 / `translateY(-24px)`.
- **Keep the overlay mounted until exit completes** — never abruptly unmount before the exit finishes.
- Baseline reference close springs: backdrop tension **240** / friction **30**; panel tension **240** / friction **26**.
- On rapid open/close toggling: **cancel or retarget** active animations so stale completion callbacks cannot hide a menu that was reopened.

### Optional desktop detail

- Close icon rotates 0 → 90° on hover (tension 300 / friction 18).
- Disable hover-only motion on touch / coarse pointers.

### Behavior & a11y

- Lock background scrolling while open; restore on close.
- Escape and the close control dismiss.
- Navigation links close the menu and move to the selected section (or route).
- Manage focus: trap within the open overlay, make background content inert (`inert` or equivalent), return focus to the menu trigger on close.
- Support `prefers-reduced-motion` (instant or short opacity-only open/close; no large travel).

### Hero word entrance (optional, separate)

See `typography.md` optional entrance for Baseline hero words (`type.hero-baseline`). That recipe is optional display motion, not part of the nav pattern.
