# Source Tree — AI Tools Library (MVP)
**Owner:** Winston (Architect)  
**Date:** Sep 15, 2025  

This is the recommended repository layout for the MVP, aligned with the architecture already drafted.

---

## 1) Repository Layout
```text
ai-tools-library/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                         # Home (SSR search)
│  ├─ library/
│  │  └─ page.tsx                     # Library (ISR)
│  ├─ t/
│  │  └─ [slug]/
│  │     └─ page.tsx                  # Tool detail (ISR)
│  ├─ go/
│  │  └─ [slug]/
│  │     └─ route.ts                  # Edge redirect + click log
│  ├─ api/
│  │  ├─ suggest/
│  │  │  └─ route.ts                  # (opt) chips/autocomplete
│  │  └─ log-click/
│  │     └─ route.ts                  # click logging (server role)
│  └─ admin/
│     └─ import/
│        └─ page.tsx                  # (opt) CSV import UI (env/role gated)
│
├─ components/
│  ├─ ui/                             # shadcn/ui components
│  ├─ ToolCard.tsx
│  ├─ ToolDetail.tsx
│  ├─ Filters.tsx
│  ├─ SearchBox.tsx
│  └─ Skeletons.tsx
│
├─ lib/
│  ├─ supabase/
│  │  ├─ client.ts                    # anon client (browser/server components)
│  │  └─ admin.ts                     # service role client (server only)
│  ├─ intent/
│  │  ├─ parse.ts                     # non‑LLM intent mapping (EN/VI)
│  │  └─ synonyms.ts                  # tag & synonym dictionaries
│  ├─ db/
│  │  ├─ queries.ts                   # typed SQL/RPC helpers
│  │  └─ types.ts                     # DB types
│  ├─ analytics.ts                    # Plausible/GA wrappers
│  ├─ config.ts                       # constants (budgets, feature flags)
│  └─ utils.ts                        # misc helpers
│
├─ styles/
│  ├─ globals.css
│  └─ tailwind.css
│
├─ public/
│  └─ og/                             # dynamic/static OG assets
│
├─ supabase/
│  ├─ migrations/                     # SQL migrations: tools, clicks, submissions
│  ├─ seed/
│  │  └─ tools.csv                    # initial dataset (optional)
│  └─ init.sql                        # extensions + policies bootstrap
│
├─ scripts/
│  ├─ import-csv.ts                   # bulk import script
│  └─ revalidate.ts                   # on-demand ISR revalidate
│
├─ tests/
│  ├─ unit/
│  │  └─ intent-parser.test.ts
│  ├─ e2e/
│  └─ utils/
│
├─ .env.example
├─ next.config.mjs
├─ tailwind.config.ts
├─ postcss.config.js
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## 2) Minimum File Stubs (to unblock build)
**`lib/supabase/client.ts`**
```ts
import { createBrowserClient } from '@supabase/ssr'
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`lib/supabase/admin.ts`**
```ts
import { createClient } from '@supabase/supabase-js'
export function createSupabaseServer() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

**`lib/intent/parse.ts`** (sketch)
```ts
export type Intent = { q: string; pricing?: 'free'|'freemium'|'paid'; platform?: 'web'|'api'|'desktop'; language?: string[]; no_signup?: boolean; primary_tag?: string; tags: string[] }
export function parseIntent(raw: string): Intent {
  const text = raw.normalize('NFKD').toLowerCase()
  const out: Intent = { q: raw.trim(), tags: [] }
  if (/\bfree|0đ|mien phi\b/.test(text)) out.pricing = 'free'
  if (/\bfreemium\b/.test(text)) out.pricing = 'freemium'
  if (/(\$|paid|trả phí|usd|vnd|đ)/.test(text)) out.pricing = 'paid'
  if (/no\s?signup|không\s?cần\s?đăng\s?ký/.test(text)) out.no_signup = true
  if (/\bapi\b/.test(text)) out.platform = 'api'
  if (/desktop|windows|mac(os)?/.test(text)) out.platform = 'desktop'
  if (/vi(et)?(namese)?|\bvi\b/.test(text)) (out.language ||= []).push('vi')
  if (/english|\ben\b/.test(text)) (out.language ||= []).push('en')
  return out
}
```

**`app/go/[slug]/route.ts`** (Edge)
```ts
import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'edge'
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const url = new URL(req.url)
  const ref = req.headers.get('referer') ?? undefined
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/log-click`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slug: params.slug, referrer: ref })
  }).catch(() => null)
  return NextResponse.redirect(`${url.origin}/`, 302)
}
```

**`app/api/log-click/route.ts`** (Server)
```ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/admin'
export async function POST(req: NextRequest) {
  const { slug, referrer, utm_source, utm_medium, utm_campaign } = await req.json()
  const sb = createSupabaseServer()
  const { data: tool } = await sb.from('tools').select('id, affiliate_url').eq('slug', slug).single()
  if (!tool) return NextResponse.json({ ok: false }, { status: 404 })
  await sb.from('clicks').insert({ tool_id: tool.id, referrer, utm_source, utm_medium, utm_campaign })
  return NextResponse.json({ ok: true, redirect: tool.affiliate_url })
}
```

**`app/page.tsx`** (SSR search entry)
```tsx
import { parseIntent } from '@/lib/intent/parse'
export default async function Home({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams?.q ?? '').slice(0, 200)
  const intent = parseIntent(q)
  // TODO: call DB query once RPC is ready
  return (<main>/* input, results grid, a11y live region */</main>)
}
```

---

## 3) Environment Variables
Copy `.env.example` → `.env.local` and set:
```
NEXT_PUBLIC_SITE_URL=https://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_ACCESS_KEY=choose-a-strong-random
```

---

## 4) Suggested Package Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "import:csv": "ts-node ./scripts/import-csv.ts",
    "revalidate": "ts-node ./scripts/revalidate.ts",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

---

## 5) Notes & Conventions
- **Edge vs Server:** `/go/[slug]` runs at the Edge; DB writes use `/api/log-click` on the server with the service role.
- **RLS:** Public `select` on `tools`; insert‑only on `clicks`; no public `select` on `clicks`.
- **A11y:** Use `aria-live` for SSR result region; trap focus in modals; visible focus outlines.
- **Perf Budgets:** Respect targets from the architecture doc and track via Lighthouse CI if feasible.

