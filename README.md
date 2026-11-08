# Dual Frontend / Backend Agent Skills

Portable skill pack for **Claude Code** and **Cursor**. Two skills orchestrate UI-first product work and production-minded backend engineering, with a **provenance + taste-memory** loop so disliked patterns can be traced to their source and removed from the skill.

| Skill | Use when |
|-------|----------|
| `/frontend-design` | Screens, landings, dashboards, components, unslop, taste rejection (“never do X again”) |
| `/backend-engineering` | Architecture, APIs, schema, caching, performance, audit/debug/refactor modes |

## Recommended order

1. Create a GitHub (or forge) repo and connect Claude Code / Cursor  
2. Run **frontend-design**: screen inventory → every screen → companions → checklist → a11y → UI DoD  
3. Create root docs: `agents.md`, `decision.md`, `context.md`  
4. Run **backend-engineering**: architecture → minimal scalable implementation → launch-ready gates  

## Install these two skills

Copy or symlink the folders:

```bash
# Claude Code (project)
mkdir -p .claude/skills
ln -sfn ../../skills/frontend-design .claude/skills/frontend-design
ln -sfn ../../skills/backend-engineering .claude/skills/backend-engineering

# Cursor (project) — also loads .claude/skills and .agents/skills
mkdir -p .cursor/skills .agents/skills
ln -sfn ../../skills/frontend-design .cursor/skills/frontend-design
ln -sfn ../../skills/backend-engineering .cursor/skills/backend-engineering
ln -sfn ../../skills/frontend-design .agents/skills/frontend-design
ln -sfn ../../skills/backend-engineering .agents/skills/backend-engineering
```

Personal installs: `~/.claude/skills/` or `~/.cursor/skills/`.

This repository already links them under `.claude/skills`, `.cursor/skills`, and `.agents/skills`.

## Companions (not forks)

| Tool | Role | Source id |
|------|------|-----------|
| [shadcn/ui](https://github.com/shadcn-ui/ui) | Accessible primitives | `source:shadcn-ui` |
| [Motion Primitives](https://github.com/ibelick/motion-primitives) | Intentional section/hero motion | `source:motion-primitives` |
| [Animate UI](https://github.com/imskyleen/animate-ui) | Opt-in animated shadcn/Radix swaps | `source:animate-ui` |
| [21st.dev](https://21st.dev) | Catalog search/install for sections | `source:21st-dev` |
| [Taste Skill](https://github.com/Leonxlnx/taste-skill) | Marketing sites + browser finish gate | `source:taste-skill` |
| [Impeccable](https://github.com/pbakaus/impeccable) | Critique/audit/polish + slop detector | `source:impeccable` |

### 21st.dev CLI + MCP

```bash
npm i -g @21st-dev/cli          # or: npm config set prefix ~/.npm-global && npm i -g @21st-dev/cli
21st login                      # browser auth; token saved locally
```

CI / non-interactive: `--api-key $API_KEY_21ST` or set `API_KEY_21ST` / `TWENTYFIRST_TOKEN`.

```bash
21st init --client cursor --write
21st init --client claude --write
```

Example configs: [`.cursor/mcp.json.example`](.cursor/mcp.json.example), [`.mcp.json.example`](.mcp.json.example). Create an API key at https://21st.dev/mcp.

If `21st login` cannot open a browser in your environment, use the API key path above — builds still work using craft references without 21st.

### Impeccable + Taste Skill

Already installed in this project when you clone it (or re-run):

```bash
npx impeccable install --providers=claude,cursor --scope=project
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

Taste Skill needs Node 22+ and Chrome/Chromium for its checker.  
Impeccable engine binaries are gitignored; re-run `npx impeccable install` after clone to download them.

### shadcn / Motion / Animate UI

Use inside a real app (not required to open this skill pack):

```bash
npx shadcn@latest init
npx shadcn@latest add button dialog input
# Motion Primitives — follow https://motion-primitives.com/docs
npx @animate-ui/cli@latest animate all   # only when you want motion on shadcn primitives
```

## Provenance & taste feedback

- [`skills/frontend-design/references/provenance.md`](skills/frontend-design/references/provenance.md) — every default pattern → source + skill path  
- [`skills/frontend-design/references/taste-memory.md`](skills/frontend-design/references/taste-memory.md) — preferred / rejected / replaced  

When building UI, agents tag `decision.md` and the Components table in `agents.md` with `provenance_id` and `source:…`.

When you dislike something, say so. The agent should find the root (source + skill file), ask whether to **remove**, **replace**, or keep as a one-off, then update the skill so it does not repeat.

Mockups under `skills/frontend-design/assets/` are **quality references** (Code XR, FluxEdit, Palmatech) — craft patterns only, not forced brand colors.

## Layout

```text
skills/
  frontend-design/
  backend-engineering/
.cursor/mcp.json(.example)
.mcp.json(.example)
.claude/skills/   # impeccable + links to our skills
.cursor/skills/
.agents/skills/   # design-taste-frontend + links
```
