---
name: rebuild-from-reference
description: >-
  Rebuild a UI from a website the user likes, a screenshot, a mockup, or a pasted
  catalog install prompt (e.g. 21st.dev). Use when the user shares a URL, image,
  Figma frame, "make it look like this", "rebuild this", "clone this layout", or
  drops a shadcn/21st component prompt. Produces React + TypeScript + Tailwind
  (shadcn project structure) that matches the reference's composition, not a
  generic rewrite.
---

# Rebuild from reference

Turn a **visual reference** into working UI in the user's app. Companions
(`frontend-design`, Taste Skill, Impeccable, 21st) still apply for craft gates —
this skill owns **intake → analysis → stack check → rebuild → verify**.

Read on demand (do not load everything at once):

- `references/analysis-sheet.md` — what to extract from a URL / screenshot
- `references/stack-and-paths.md` — React / TS / Tailwind / shadcn paths
- `references/catalog-component-install.md` — pasted 21st/shadcn install prompts
- `references/rebuild-modes.md` — fidelity levels and legal/IP boundaries

Also route through `../frontend-design/SKILL.md` for inventory, provenance,
checklist, a11y, and taste feedback after the rebuild lands.

## Triggers

Activate when the user:

- Pastes a **website URL** they like
- Attaches or pastes a **screenshot / mockup / design frame**
- Says rebuild / recreate / clone / match / "like this" / "same vibe as"
- Pastes a **catalog component install prompt** (shadcn/21st-style: component file
  + demo + npm deps + `/components/ui` instructions)

## Workflow (ordered)

1. **Classify the input**
   - `url` — live site or public page
   - `screenshot` — still image of a page/section/app
   - `catalog-prompt` — pasted install brief with TSX + deps
   - `hybrid` — URL/screenshot plus product constraints for *their* brand
2. **Confirm rebuild mode** (`references/rebuild-modes.md`)
   - Default: **inspired rebuild** (same composition + craft, **their** product
     copy, brand, and data — not a pixel-perfect clone of someone else's IP)
   - Only do **faithful section clone** when they own the reference or explicitly
     ask to match a component they are licensed to use (e.g. 21st install)
3. **Capture visual truth**
   - Screenshot / browser capture at desktop (~1440) and mobile (~390) when a URL
     is given
   - Read image attachments with the image tool — do not guess from filenames
   - Fill `references/analysis-sheet.md` (layout, type, color, density, motion,
     components, empty states)
4. **Check the target project stack** (`references/stack-and-paths.md`)
   - Need: React, TypeScript, Tailwind, shadcn-style structure
   - If missing: give setup steps (do not invent a parallel stack)
   - Resolve component path (default `@/components/ui`) and global styles path
5. **Rebuild**
   - **URL / screenshot:** compose sections that match the analysis sheet; prefer
     shadcn primitives + 21st catalog search before inventing large blocks
   - **Catalog prompt:** follow `references/catalog-component-install.md` —
     install deps, write component + demo under the resolved UI path, wire a
     route or story, restyle to project tokens when this is not a faithful install
6. **Assets**
   - Prefer real product imagery the user owns
   - Otherwise use known-good Unsplash (or equivalent) stock URLs and
     `lucide-react` for icons — never leave broken image `src`s
7. **Verify**
   - Desktop + mobile layout against the reference
   - Interactive states: hover, focus, empty, loading, error when present in ref
   - Honor `prefers-reduced-motion`
8. **Hand off to gates**
   - Tag `decision.md` / `agents.md` with
     `source:user-reference` or `source:21st-dev` + a provenance id
   - Run frontend-design checklist + a11y; Impeccable critique/audit/polish when
     installed

## Hard rules

- **Match composition, not plagiarism.** Inspired rebuilds keep structure and
  craft; swap brand, copy, and proprietary illustration unless the user owns the
  reference or is installing a licensed catalog component.
- **One composition per first viewport** for marketing rebuilds — do not turn a
  hero into a dashboard.
- **Restyle foreign catalog chrome** to project tokens unless the user asked for
  a faithful install of that exact component.
- **Do not skip stack setup.** If the app is not React + TS + Tailwind + shadcn-
  ready, stop and provide setup instructions from `stack-and-paths.md`.
- **Do not invent missing screens.** Rebuild what the reference shows; ask (or
  note assumptions) for pages that were not provided.
- Skip any frontend-design provenance id with status `rejected`.

## Questions to resolve early

Ask only what blocks the rebuild (skip answers already in the message):

- Is this an **inspired** rebuild for their product, or a **faithful** install of
  a component they own/licensed?
- Which surface: full page, one section, or app shell/dashboard?
- Target path / route in the app?
- Brand tokens / `DESIGN.md` / `context.md` to honor?
- Any props, data, or API the rebuilt UI must accept?

## Done when

- [ ] Analysis sheet filled (even briefly) from the actual reference
- [ ] Stack + `/components/ui` (or documented alternate) confirmed
- [ ] UI renders at desktop and mobile and reads as the same composition
- [ ] Deps installed; images/icons resolve
- [ ] Provenance tagged; checklist + a11y run
