# Catalog component install

**Source:** `source:our-skill` · provenance: `rebuild.catalog-install`  
Also: `source:21st-dev` when the paste comes from 21st.dev

Use this when the user pastes an install brief that looks like:

- “Integrate an existing React component…”
- Requires shadcn + Tailwind + TypeScript
- Names a file such as `adjustable-glass-dashboard.tsx`
- Includes a `demo.tsx` and an `npm install …` list

## Steps

0. **Stack check** — follow `stack-and-paths.md`. Stop and give setup instructions
   if React / TS / Tailwind / shadcn structure is missing.
1. **Resolve the UI folder** — default `@/components/ui`. Create it if needed;
   explain why if the project used a different path.
2. **Write the component** — copy the provided TSX into
   `components/ui/<name>.tsx` (keep the export name the demo imports).
3. **Write the demo** — place `demo.tsx` beside it or behind a route/page that
   imports `@/components/ui/<name>`. Fix aliases to match `components.json`.
4. **Install NPM dependencies** listed in the prompt (and only those missing).
5. **Assets**
   - Replace broken or placeholder images with Unsplash (or known CDN) URLs that
     exist, or with user-provided assets
   - Use `lucide-react` (or the project’s icon set) for SVGs/logos the component
     expects
6. **Wire into the app** — a page, story, or existing shell so the user can see it
7. **Analyze props / state** before calling it done:
   - Required vs optional props
   - Controlled callbacks (`onGlassChange`, theme, filters, …)
   - Context providers / hooks the component assumes
   - Responsive behavior already encoded in its CSS
8. **Restyle** — for inspired product work, map colors to host tokens; for a
   faithful licensed install, keep the demo palette unless the user asks to
   tokenize it
9. **Tag provenance** — `source:21st-dev` (or catalog vendor) + component
   slug/id in `decision.md` and the `agents.md` Components table

## Questions to ask (only if unanswered)

- What data/props will the host pass?
- Any state-management constraints (URL state, global store)?
- Required assets (brand imagery, charts data)?
- Expected responsive breakpoints beyond what ships in the component?
- Best mount point in the app (marketing page, app shell, settings)?

## Implementation guidelines (from typical catalog prompts)

1. Analyze structure and list every import / peer dependency
2. Review arguments and internal state (views, filters, theme, settings drawers)
3. Identify context providers or host hooks; install or stub them
4. Prefer composition over editing vendor internals until tokens require it

## Example shape (glass workspace dashboards)

Catalog prompts for frosted / adjustable glass dashboards often include:

| File | Role |
|------|------|
| `components/ui/adjustable-glass-dashboard.tsx` | Self-contained workspace UI + scoped CSS string |
| `demo.tsx` | Sample transactions, goals, cash-flow periods, background image |
| deps | `gsap`, `@gsap/react`, `lucide-react` |

Treat that as a **faithful component install** when the user pasted the prompt.
When they only shared a screenshot of a similar glass dashboard, do an
**inspired rebuild**: same material language and IA, their brand/data, prefer
shadcn + project motion stack unless GSAP is already a dependency.
