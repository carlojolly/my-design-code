# Project docs templates

**Source:** `source:our-skill` · provenance: `workflow.project-docs`  

Create these at the **repository root** with these exact names.

---

## `agents.md` / `AGENTS.md`

Prefer `AGENTS.md` at the repo root (Cursor reads it). Keep `agents.md` in sync or pointing at it.

```markdown
# Agents

## Forge

- Source of truth: GitHub (set `origin` to the GitHub clone URL)
- Create and update PRs with `gh` against the default branch
- Do not use Cursor Origin as the git remote or PR host unless the user explicitly opts in

## Map — where code lives

| Area | Path | Notes |
|------|------|-------|
| UI screens | | |
| UI components | | |
| API | | |
| DB / migrations | | |
| Jobs / workers | | |
| Config | | |

## Components (provenance)

| path | role | provenance_id | source |
|------|------|---------------|--------|
| components/ui/button.tsx | primary CTA | prim.button | source:shadcn-ui |

## Agents may

- …
- Update this file when structure changes
- Tag new UI with provenance_id + source
- Push and open GitHub PRs with `gh`

## Agents must not

- Commit secrets or `.env` files
- Remove the Components provenance table
- Rewrite approved UI without updating screen inventory / decision.md
- Point `origin` at Cursor Origin or open Origin PRs by default
- …
```

---

## `decision.md`

```markdown
# Decisions

Newest first. Every material product or technical choice gets a row.

| When (ISO 8601 with offset) | Decision | Why | Alternatives rejected | source | provenance_id |
|-----------------------------|----------|-----|----------------------|--------|---------------|
| 2026-11-08T21:00:00+01:00 | Use shadcn Button for primary CTA | Accessible open-code primitive | Hand-rolled button | source:shadcn-ui | prim.button |
```

---

## `context.md`

```markdown
# Context

## What it does

…

## Who it is for

…

## How it works

…

## Out of scope (for now)

…
```

---

## Sync with Impeccable (if installed)

- `context.md` product narrative → input for `PRODUCT.md` (`/impeccable init`)
- After UI approval → `/impeccable document` writes `DESIGN.md`
- Do not delete `agents.md` / `decision.md` / `context.md` in favor of Impeccable files; keep both sets consistent
