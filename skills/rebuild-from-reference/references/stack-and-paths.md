# Stack and paths

**Source:** `source:our-skill` · provenance: `rebuild.stack-shadcn`

Rebuilds target a **React + TypeScript + Tailwind** app with **shadcn-style**
component layout. If the project is missing any of these, set them up before
copying UI files.

## Detect

Look for:

| Signal | Means |
|--------|--------|
| `components.json` | shadcn initialized (read `aliases`, `tailwind.css`, `tsx`) |
| `tailwind.config.*` or `@import "tailwindcss"` / `@theme` | Tailwind v3 or v4 |
| `tsconfig.json` + `.tsx` sources | TypeScript |
| `package.json` with `react` / `next` / `vite` | React host |

Also resolve the components alias (`@/components`, `~/components`, etc.) from
`components.json` or `tsconfig` paths.

## Default paths

| Kind | Default | Notes |
|------|---------|-------|
| UI primitives / catalog components | `components/ui` (often `@/components/ui`) | **Create this folder** even if the app currently dumps components elsewhere |
| Demo / preview wrappers | next to the component, or `app/.../page.tsx` / a Storybook story | Keep demos out of the primitive file when possible |
| Global CSS / tokens | path from `components.json` → `tailwind.css`, else `app/globals.css` / `src/index.css` | Theme tokens (`--color-*`, `--background`, etc.) live here |

### Why `/components/ui` matters

shadcn CLI, 21st.dev installs, and most catalog prompts assume
`components/ui`. Keeping that folder:

- Lets `npx shadcn@latest add …` and `21st add …` land files where imports expect them
- Keeps primitives separate from feature/route code
- Matches `@/components/ui/...` imports in pasted demos

If the project uses another folder today, either:

1. **Prefer creating `components/ui`** and importing from there (recommended), or
2. Document the alternate path in `agents.md` and rewrite pasted imports — do not
   leave broken `@/components/ui/...` paths.

## Setup when missing

### TypeScript

```bash
# Vite example
npm install -D typescript @types/react @types/react-dom
npx tsc --init
```

Ensure `jsx` / `paths` support `.tsx` and the `@/` alias used by the project.

### Tailwind CSS

Follow the host docs (Next, Vite, etc.). Tailwind v4 often uses CSS-first
`@import "tailwindcss"` + `@theme`. v3 uses `tailwind.config.*`.

### shadcn/ui

```bash
npx shadcn@latest init
npx shadcn@latest add button  # smoke-test that components/ui is writable
```

`init` creates `components.json`, the UI folder, and wires CSS variables.

If CLI cannot run non-interactively, create `components/ui` manually, add a
minimal `lib/utils.ts` (`cn` helper), and document that full shadcn init is still
needed for future `add` commands.

## Dependencies for motion / icons (common on catalog rebuilds)

Install only what the rebuild actually imports, for example:

```bash
npm install lucide-react
npm install gsap @gsap/react   # only when the reference/component uses GSAP
```

Prefer existing project icon/motion libraries when already present
(Motion / Framer, etc.) unless the pasted component hard-requires GSAP.

## Host theme tokens

Many glass / dashboard catalog components read Tailwind v4-style
`--color-background`, `--color-foreground`, `--color-primary`, etc. Prefer
`useHostTheme` (or equivalent) so the app owns light/dark switching. Local theme
toggles are fine only when the host has no theme system.
