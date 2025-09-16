# AI-Agent Coding Standards (Next.js + Vite)

> **Audience:** Autonomous/assisted AI agents contributing to this repository.  
> **Scope:** Next.js (App Router) + Tailwind + shadcn/ui + Framer Motion; data via Supabase; TypeScript‑first; Vitest for tests.  
> **Prime Directives:** *No redundancy*, *no re‑declaration*, *one entity per file*. Follow the repository structure and architecture decisions defined for the AI Tools Library MVP.

---

## 0) Do‑No‑Harm Rules (MUST)

1. **No duplicates / no re‑declaration**  
   - Before generating code, **search** the repo for an existing implementation. Reuse or extend; do not create parallel copies.  
   - Never define the same exported identifier (component, hook, util, type, route) in more than one file.  
   - When updating, **modify in place** (preserve file path and export name) unless a refactor is explicitly requested.

2. **One entity per file**  
   - Exactly **one top‑level export** per file (component OR hook OR util OR store OR type group).  
   - Private helpers may stay in the same file **only** if they are not exported and are small.  
   - Do not aggregate multiple unrelated entities into a single file. No “god” files (e.g., `utils.ts` dumping many exports).

3. **Idempotent generation**  
   - Re‑running the same task must not generate new files if they already exist; ensure updates are deterministic.

4. **Lint & types are authoritative**  
   - All changes must pass ESLint and TypeScript with zero errors. If ESLint and Prettier disagree, ESLint prevails.

---

## 1) Repository Topology (Authoritative)

Follow this layout and do not invent new top‑level folders without an RFC.

```
ai-tools-library/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                       # Home (SSR search)
│  ├─ library/
│  │  └─ page.tsx                    # Library (ISR)
│  ├─ t/
│  │  └─ [slug]/
│  │     └─ page.tsx                 # Tool detail (ISR)
│  ├─ go/
│  │  └─ [slug]/
│  │     └─ route.ts                 # Edge redirect + click log
│  ├─ api/
│  │  ├─ suggest/route.ts            # (opt) suggestions
│  │  └─ log-click/route.ts          # click logging (server)
│  └─ admin/import/page.tsx          # (opt) CSV import UI
│
├─ components/
│  ├─ ui/                            # shadcn/ui extensions
│  ├─ ToolCard.tsx
│  ├─ ToolDetail.tsx
│  ├─ Filters.tsx
│  ├─ SearchBox.tsx
│  └─ Skeletons.tsx
│
├─ lib/
│  ├─ supabase/
│  │  ├─ client.ts                   # anon client
│  │  └─ admin.ts                    # service role client (server only)
│  ├─ intent/
│  │  ├─ parse.ts                    # EN/VI non‑LLM parser
│  │  └─ synonyms.ts
│  ├─ db/
│  │  ├─ queries.ts                  # typed SQL/RPC
│  │  └─ types.ts                    # DB types
│  ├─ analytics.ts                   # Plausible/GA wrappers
│  ├─ config.ts                      # constants/flags
│  └─ utils.ts                       # minimal helpers
│
├─ styles/ (globals.css, tailwind.css)
├─ public/og/
├─ supabase/ (migrations, seed, init.sql)
├─ scripts/ (import-csv.ts, revalidate.ts)
├─ tests/ (unit, e2e, utils)
├─ .env.example
├─ next.config.mjs
├─ tailwind.config.ts
├─ postcss.config.js
├─ tsconfig.json
├─ package.json
└─ README.md
```

> **Barrels:** A single `index.ts` per folder is allowed **only for re‑exports** (no logic).

---

## 2) Language, Tooling & Config

- **TypeScript:** `"strict": true`. No `any` unless justified with comments.  
- **Next.js:** App Router, RSC‑first; client components gated with `"use client"`.  
- **Vite:** Used for local tooling and Vitest; do **not** replace Next’s prod build.  
- **Styling:** Tailwind CSS; CSS Modules for scoped overrides only.  
- **UI Kit:** shadcn/ui; motion via Framer Motion.  
- **Testing:** Vitest + @testing-library/react.  
- **Lint/Format:** ESLint (Next.js core web vitals) + Prettier.

Minimum scripts to keep green:

```jsonc
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

---

## 3) Naming & File Rules

- **One file = one exported entity.** File name mirrors the exported name.  
  - Components: `PascalCase.tsx` → default export allowed (name must match file).  
  - Hooks/Utils: `camelCase.ts` with **named export** matching the file name (e.g., `useUser.ts` exports `useUser`).  
  - Types: `domain.types.ts` with one coherent type group.
- **Folder names:** `kebab-case` except component folders that match component name.  
- **No catch‑all files** (`helpers.ts`, `index.ts` with logic, etc.).  
- **Tests:** one test per entity, same folder or `tests/unit`, named `*.test.ts(x)`.

---

## 4) Imports & Module Boundaries

- Use absolute imports via `@/` paths (`tsconfig.paths`).  
- Import **only** from public entry points of a feature; do not deep‑import private files from other features.  
- Avoid circular dependencies; if detected, extract shared types/utils into `src/lib` (or `lib/`).

---

## 5) Next.js Rendering & Routes

- **Home `/`**: **SSR**; calls server action to parse intent and query tools.  
- **Library `/library`**: **ISR** (5–15m).  
- **Detail `/t/[slug]`**: **ISR** (5–15m), also openable as a modal.  
- **Edge `/go/[slug]`**: Edge runtime; log click via server endpoint; then 302 to affiliate URL.  
- **API**: Minimal route handlers under `app/api/*`.

**Do not change** runtime choices (SSR/ISR/Edge) without approval; they are tied to perf/SEO KPIs.

---

## 6) Data & Supabase

- Use Supabase Postgres as the single source of truth.  
- Public **read** for `tools`; insert‑only for `clicks` (no public selects).  
- Prefer RPC/typed helpers in `lib/db/queries.ts` and centralized types in `lib/db/types.ts`.  
- Environment contracts (mandatory):

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ADMIN_ACCESS_KEY (if admin UI enabled)
```

- Never expose server secrets in client components. `admin.ts` (service role) is **server‑only**.

---

## 7) Styling, A11y & Motion

- **Tailwind‑first.** Prefer composable utility classes; extract repeated class lists to a `cx` helper.  
- **Glass UI:** respect theme tokens (blur, borders, subtle shadows).  
- **A11y:** visible focus states, semantic HTML, proper ARIA; SSR results region uses `aria-live="polite"`.  
- **Motion:** short (100–150ms) micro‑interactions; avoid excessive parallax/heavy animations.

---

## 8) Testing Standards

- **Unit:** Vitest + Testing Library per entity.  
- **Server:** mock external I/O; verify DB calls via fakes/spies.  
- **Snapshots:** minimal; prefer explicit assertions.  
- **Coverage:** add/keep tests for new/changed logic.

---

## 9) Performance & Quality Budgets

- Home SSR TTFB ≤ **500ms** (P50).  
- Filter/query response ≤ **300ms** where feasible.  
- Lighthouse Perf ≥ **85**, A11y ≥ **90**.  
- Use `next/image` with correct sizing; lazy‑load thumbnails; code‑split heavy features.

---

## 10) Prohibited Patterns (Fail the PR)

- Creating a new component/hook/util when an equivalent already exists.  
- Multiple unrelated exports in one file.  
- Duplicate symbol names across files.  
- Client component without explicit `"use client"`.  
- Importing from deep private paths of other features.  
- Edge route performing privileged DB writes with service role (must delegate to server handler).

---

## 11) Agent Execution Protocol (Step‑by‑Step)

1. **Discovery:** Search for existing entity; gather the canonical file path.  
2. **Plan:** If new code is truly required, choose the **single** target file path and export name.  
3. **Generate:** Create exactly one file with one exported entity; include minimal private helpers if needed.  
4. **Wire:** Add/adjust imports where the entity is consumed; update a single barrel if applicable (re‑exports only).  
5. **Test:** Create/modify exactly one test file for the entity.  
6. **Validate:** Run lint, typecheck, and tests; ensure idempotency (re‑run should not create duplicates).  
7. **Docs:** If a new public entity, add a short JSDoc and update README or feature docs if needed.

---

## 12) Example: Compliant Component

```tsx
// components/ToolCard.tsx
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function ToolCard({ tool }: { tool: { slug: string; name: string; description?: string; tags?: string[] } }) {
  return (
    <Card className="glass p-4">
      <div className="text-lg font-semibold line-clamp-1">{tool.name}</div>
      <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {tool.tags?.slice(0, 3).map(t => (
            <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20">{t}</span>
          ))}
        </div>
        <Link href={`/t/${tool.slug}`} className="text-sm underline">Open ↗</Link>
      </div>
    </Card>
  )
}
```

---

## 13) PR Checklist (Agent MUST verify)

- [ ] No duplicates were created; existing entities were reused/extended.  
- [ ] Exactly one exported entity in each changed/added file.  
- [ ] Lint + typecheck + tests pass; no warnings introduced.  
- [ ] Route/runtime choices (SSR/ISR/Edge) respected.  
- [ ] Env secrets not leaked to client.  
- [ ] A11y and performance budgets respected.  
- [ ] Barrel files contain re‑exports only.

---

## 14) Change Control

- Any deviation from these standards (e.g., introducing new folders, multi‑entity files, runtime changes) requires an **Architecture Note** and approval.  
- Keep commit messages conventional (e.g., `feat:`, `fix:`, `refactor:`) and scope‑limited.
