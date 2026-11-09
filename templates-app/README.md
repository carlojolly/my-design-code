# Templates App

Next.js + TypeScript + Tailwind CSS + shadcn/ui showcase for reusable UI templates.

## Stack

- Next.js App Router (`src/app`)
- Tailwind CSS v4 + shadcn (`components.json`, `src/components/ui`)
- GSAP + Lucide for the glassmorphism workspace

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

## Templates

| Slug | Route | Component |
|------|-------|-----------|
| Glassmorphism | `/templates/glassmorphism` | `src/components/ui/adjustable-glass-dashboard.tsx` |

Catalog registry: `src/lib/templates.ts`.

## Adding another template

1. Drop the component under `src/components/ui/` (shadcn default).
2. Add a demo under `src/components/templates/`.
3. Register it in `src/lib/templates.ts`.
4. Create `src/app/templates/<slug>/page.tsx`.
