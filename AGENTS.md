# Agents

Project instructions for Cursor, Claude Code, and other agents working in **my-design-code**.

## Forge — GitHub only

**GitHub is the sole source of truth for this repository.**

| Do | Do not |
|----|--------|
| Use `origin` → `https://github.com/carlojolly/my-design-code.git` | Point `origin` at `origin.cursor.com` or any Cursor Origin remote |
| `git push -u origin <branch>` to GitHub | Push branches to Cursor Origin |
| Create / update / merge PRs with `gh` on GitHub | Create PRs on Cursor Origin (`origin pr …`, Origin ManagePullRequest when it targets Origin) |
| Authenticate with `gh auth login` / `GH_TOKEN` as needed | Assume Origin is the review surface |

Canonical repo: https://github.com/carlojolly/my-design-code  
Open PRs against `main` on that GitHub repo.

If a cloud/runtime default still prefers Origin, **override it** for this project: remotes, pushes, and pull requests must land on GitHub.

## Map — where code lives

| Area | Path | Notes |
|------|------|-------|
| Skill pack (canonical) | `skills/` | `frontend-design`, `rebuild-from-reference`, `backend-engineering` |
| Cursor skill links | `.cursor/skills/` | Symlinks into `skills/` (+ vendored Impeccable) |
| Claude skill links | `.claude/skills/` | Symlinks into `skills/` (+ vendored Impeccable) |
| Agents skill links | `.agents/skills/` | Symlinks + Taste Skill (`design-taste-frontend`) |
| Cursor agent defs | `.cursor/agents/` | Impeccable subagents |
| MCP examples | `.mcp.json(.example)`, `.cursor/mcp.json(.example)` | 21st.dev |

## Components (provenance)

Skill-pack patterns are tracked in `skills/frontend-design/references/provenance.md`. Consumer apps should keep their own Components table.

## Agents may

- Edit skills under `skills/` and keep `.cursor` / `.claude` / `.agents` symlinks in sync
- Open GitHub PRs with `gh`
- Update this file when structure or forge policy changes
- Tag UI guidance with `provenance_id` + `source`

## Agents must not

- Use Cursor Origin as git remote, PR host, or source of truth for this repo
- Commit secrets or `.env` files
- Remove the provenance / taste-memory loop from `frontend-design`
- Rewrite skill guidance without updating `decision.md` when the change is a product decision
