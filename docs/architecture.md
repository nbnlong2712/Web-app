# Full-Stack Architecture — AI Tools Library (MVP)
**Version:** 0.1  
**Date:** Sep 15, 2025  
**Owner:** Winston (Architect)  

---

## 0) Context & Inputs
This document synthesizes the product brief, front‑end specification, MVP backlog, and user stories provided by the team. It defines a practical, scalable, and cost‑conscious architecture for shipping the MVP in 2–3 weeks with 2 developers while achieving the monetization and discovery KPIs.

**Source inputs** (traceability)
- Project Brief — AI Tools Library (MVP)
- Front‑End Specification (MVP) — AI Tools Library
- Brainstorming/Architecture notes — MVP Definition, Taxonomy & Intent Mapping
- User Stories (PO) — AI Tools Library Web App

---

## 1) Architecture at a Glance
**Goal:** Users describe their need (EN/VI) and receive 1–3 highly relevant tools in ≤2 interactions, with a clear outbound "Visit" CTA and affiliate tracking.  
**Stack:** Next.js (App Router) + Tailwind + shadcn/ui + Framer Motion; Supabase (Postgres + RLS) for data & simple auth; Vercel for hosting.  
**Rendering:** SSR for search; ISR for library and tool detail; Edge route for `/go/[slug]` logging + redirect.  
**KPIs:** ≤2 actions to find tools; outbound CTR ≥ 8%; TTFB/SSR ≤ 500ms; filter response ≤ 300ms.

### 1.1 High-Level Diagram
```mermaid
flowchart TD
  U[User (Desktop/Mobile)] -->|EN/VI natural query| App[Next.js (App Router)]
  App -->|SSR search| SA[Server Actions / Route Handlers]
  SA -->|FTS + filter queries| PG[(Supabase Postgres)]
  App -->|ISR/SSG| Pages[/Library & Tool Detail/]
  App -->|Edge redirect| GO[/go/[slug]/]
  GO -->|INSERT click| PG
  Admin[Admin UI /admin/import] -->|CSV upload| SA
  SA -->|UPSERT tools| PG
  App -->|Analytics events| Analytic[(Plausible or GA4)]
```

### 1.2 Core Decisions
- **Next.js App Router** for hybrid SSR/ISR, route handlers, and edge runtime support.
- **Supabase Postgres** as a single source of truth (tables: `tools`, `clicks`, optional `submissions`).
- **RLS**: public read for `tools`; insert-only for `clicks` by anonymous; admin writes via service role.
- **Non-LLM intent parsing first** (fast regex/dictionary) with optional LLM rewriter later.
- **Edge redirect** for `/go/[slug]` to minimize latency and ensure click logging even under load.
- **Minimal admin** for CSV import and CRUD; secure via env-gated access key or basic auth.

---

## 2) Routing & Rendering Strategy (Next.js App Router)
- `/` **Home (SSR)**: Chat-style input → server action parses intent → SSR results below input.
- `/library` **ISR (5–15m)**: Global browse grid with filters; hydrates for client-side facet toggles without full reload.
- `/t/[slug]` **ISR (5–15m)**: Tool detail page; also openable as a modal from grid for smooth UX and deep-linking.
- `/go/[slug]` **Edge Route Handler**: Insert click log, append missing UTM parameters, HTTP 302 to affiliate URL.
- `/api/suggest` (optional): Chips suggestions/autocomplete based on cached taxonomy and top clicks.
- `/admin/import` (optional, protected): CSV upload → preview → upsert.

**Why this mix?**  
- SSR ensures query freshness and low TTFB for search.  
- ISR provides SEO and fast loads for browse & detail pages with easy cache revalidation after imports.

---

## 3) Data Model (Supabase / Postgres)
**Tables**
- `tools`: Core catalog of AI tools and attributes.  
- `clicks`: Outbound click logs, insert-only by anonymous.  
- `submissions` (optional): User-submitted tools awaiting moderation.

**Schema (DDL)**
```sql
-- Enable extensions once per database (if not already):
-- create extension if not exists pg_trgm;
-- create extension if not exists pgcrypto; -- for gen_random_uuid()

create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  homepage_url text,
  affiliate_url text,
  primary_tag text,
  tags text[],
  pricing text check (pricing in ('free','freemium','paid')),
  platform text check (platform in ('web','api','desktop')),
  language text[],
  no_signup boolean default false,
  status text default 'live',
  last_updated date,
  created_at timestamp default now()
);

create table if not exists clicks (
  id bigserial primary key,
  tool_id uuid references tools(id) on delete set null,
  clicked_at timestamp default now(),
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip inet
);

create table if not exists submissions (
  id bigserial primary key,
  name text not null,
  homepage_url text not null,
  description text,
  email text,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamp default now()
);

-- Indexes & FTS
create index if not exists idx_tools_tags_gin on tools using gin(tags);
create index if not exists idx_tools_primary_tag on tools(primary_tag);
create index if not exists idx_tools_pricing on tools(pricing);
create index if not exists idx_tools_status on tools(status);
-- Optional: trigram + FTS over name+description
-- create index if not exists idx_tools_name_trgm on tools using gin (name gin_trgm_ops);
-- create index if not exists idx_tools_fts on tools using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,'')));
```

**RLS Policies (sketch)**
```sql
-- Tools: public read
alter table tools enable row level security;
create policy tools_public_read on tools for select using (true);

-- Clicks: anonymous insert, no select
alter table clicks enable row level security;
create policy clicks_insert_only on clicks for insert with check (true);
create policy clicks_no_select on clicks for select using (false);
```

**Notes**
- Start with `tags text[]` for speed; normalize into join tables post‑MVP.
- Ensure `slug` uniqueness; generate from name when missing.

---

## 4) Search & Intent Mapping
**Non-LLM parser** converts natural language to filters; SSR query combines filters + FTS/trigram similarity and returns ≤ 24 results sorted by specificity and similarity.

**Parser (TypeScript, pseudocode)**
```ts
export function parseIntent(input: string) {
  const text = normalize(input); // lowercase, strip punctuation, remove diacritics (VI)
  const out: any = { tags: [] };
  if (/(mien phi|free|0d|0đ)/.test(text)) out.pricing = 'free';
  else if (/freemium/.test(text)) out.pricing = 'freemium';
  else if (/(tra phi|paid|\$|usd|vnd|đ)/.test(text)) out.pricing = 'paid';
  if (/(khong can dang ky|no signup|khong can account)/.test(text)) out.no_signup = true;
  if (/\bapi\b/.test(text)) out.platform = 'api';
  if (/(web|trinh duyet)/.test(text)) out.platform = 'web';
  if (/(desktop|windows|macos|mac)/.test(text)) out.platform = 'desktop';
  if (/(tieng viet|vietnamese|\bvi\b)/.test(text)) out.language = ['vi'];
  if (/(english|\ben\b)/.test(text)) out.language = [...(out.language||[]), 'en'];
  // primary_tag & tag synonyms resolved from a static dictionary
  for (const [tag, syns] of Object.entries(SYN)) {
    if (syns.some(s => text.includes(s))) { out.primary_tag = tag; break; }
  }
  for (const [t, syns] of Object.entries(FLAT_TAGS)) {
    if (syns.some(s => text.includes(s))) out.tags.push(t);
  }
  return out;
}
```

**SQL (parameterized example)**
```sql
select * from tools
where (
  (coalesce(:primary_tag,'') = '' or primary_tag = :primary_tag)
  and (:pricing is null or pricing = :pricing)
  and (:no_signup is null or no_signup = :no_signup)
  and (:platform is null or platform = :platform)
  and (:language is null or :language = any(language))
)
and (
  to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,'')) @@ plainto_tsquery('simple', :q)
  or (:q = '' and true)
  or (:tags_cnt > 0 and tags && :tags)
)
order by (case when primary_tag = :primary_tag then 0 else 1 end),
         similarity(name, :q) desc
limit 24;
```

**Test Cases**
Provide 20 representative phrases (EN/VI) and expected filters to unit test the parser.

---

## 5) Front-End Application Structure
**UI Framework:** Tailwind + shadcn/ui, motion via Framer Motion; theme: Neo‑Glassmorphism (dark gradient background, glass cards and modals, 2xl radius, 100–150ms micro-interactions).

**Pages & Key Components**
- `app/page.tsx` (Home): chat input, suggestion chips, SSR results region (aria-live="polite"), empty/loading states (skeleton shimmer >100ms).
- `app/library/page.tsx` (ISR): grid of `ToolCard`s; filter chips (category/tags) + panel (pricing/platform/language). State synced to URL query.
- `app/t/[slug]/page.tsx` (ISR): detail content; also opened as modal from grid.
- `app/go/[slug]/route.ts` (Edge): click logging + redirect.
- `app/admin/import/page.tsx` (optional): CSV import flow (upload → map columns → preview → commit) gated by access key.

**Components**
- `ToolCard`: 16:9 thumbnail, title, 2‑line description, tag chips, pricing badge, Open ↗.
- `ToolDetail`: description, pricing, tags, last_updated, primary **Visit** CTA, **Copy Link** secondary.
- `Filters`: chip row + panel; debounced client side with server fallbacks.

**Accessibility**
- Visible focus styles, proper roles/labels, `aria-live` for results, ESC to close modals, focus trap.

---

## 6) Edge & Server Logic
**/go/[slug] route (Edge)**
- Lookup tool by slug → insert row in `clicks` (`tool_id`, timestamp, `referrer`, any `utm_*`).
- Append default UTM if missing (`utm_source=ailib&utm_medium=referral&utm_campaign=default`).
- 302 to `affiliate_url`.
- Basic antibot: ignore `HEAD`, filter common bad user‑agents, light IP rate‑limit.

**Server Action: Search**
- Normalize incoming query → `parseIntent()` → construct SQL → fetch ≤ 24 results → render SSR.
- Log anonymized query (normalized query, result count) for funnel analysis.

---

## 7) Observability & Analytics
- **Analytics provider:** Plausible or GA4 with events: `tool_card_view`, `visit_click`, `search_submit`, `filter_applied`.
- **Dashboards:** 7/30‑day CTR, top outbound tools, clicks/day.
- **Logs:** Server action logs (query, latency), Edge logs for `/go` (success/fail), import results.

---

## 8) Security, Privacy & Compliance
- **Admin access:** Supabase Auth (magic link) or env-gated access key for `/admin/import`.
- **RLS:** Enforced for runtime reads/writes as specified.
- **PII:** Avoid storing user PII in `clicks`; keep IP optional and masked where feasible.
- **Rate limiting:** Simple IP‑based throttle at edge for `/go`.

---

## 9) Performance & Cost
- **Targets:** Home TTFB (SSR) ≤ 500ms, Library/Detail LCP fast via ISR; filter updates ≤ 300ms.
- **Tactics:** DB indexes; small card payload; image lazy‑loading; ISR cache (10m) with on‑demand revalidation post‑import.
- **Scale path:** When data > 5k rows or complex queries arise, introduce pgvector/Meilisearch for semantic search and reranking. Keep Vercel/Supabase tiers minimal until CTR & traffic justify upgrades.

---

## 10) SEO & Shareability
- Route `/t/[slug]` has full meta (title/description/canonical); OpenGraph/Twitter images via dynamic OG if feasible.
- `sitemap.xml` and `robots.txt` auto‑generated; warm ISR for top 100 tools.
- Minimal Product JSON‑LD on detail pages.

---

## 11) Deployment & Environments
- **Hosting:** Vercel (App Router + Edge) + Supabase (managed Postgres).
- **Env vars:** `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_ACCESS_KEY` (if using key‑gate).
- **Branches:** `main` → production; `next`/PRs → preview deployments.
- **Migrations:** SQL files in `supabase/migrations/` applied via Supabase CLI or SQL editor.

---

## 12) Risks & Mitigations
- **R1: Low‑quality seed data** → Editorial checklist, schema validation, moderation queue via `submissions`.
- **R2: Low CTR** → Prominent CTA, top‑3 layout, A/B tests on sort order (relevance vs CTR).
- **R3: Filter performance degradation** → Proper indexes, debounce, limited payload, server‑side pagination.
- **R4: Affiliate link volatility** → Store `affiliate_url` separate; scheduled checks; canonicalized UTM merge.
- **R5: Taxonomy drift** → Document conventions; linter script for `tags`; cap tag count.

---

## 13) Open Questions
1. Sorting policy for top‑3: pure relevance vs weighted by historical CTR?  
2. Whether to expose model‑specific tags (e.g., `gpt‑4o`, `llama‑3`) at MVP?  
3. Minimal VI/EN localization scope for titles/descriptions?  
4. Anti‑bot thresholds for `/go` and how to tune without losing legitimate clicks.

---

## 14) Appendix
### 14.1 Example Edge Route (`/app/go/[slug]/route.ts`)
```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function GET(req: NextRequest, { params }: { params: { slug: string }}) {
  const url = new URL(req.url)
  const ref = req.headers.get('referer') || undefined
  const { slug } = params

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
  const { data: tool } = await supabase.from('tools').select('id, affiliate_url').eq('slug', slug).single()
  if (!tool?.affiliate_url) return NextResponse.redirect(new URL('/', url.origin))

  const u = new URL(tool.affiliate_url)
  if (!u.searchParams.get('utm_source')) u.searchParams.set('utm_source', 'ailib')
  if (!u.searchParams.get('utm_medium')) u.searchParams.set('utm_medium', 'referral')
  if (!u.searchParams.get('utm_campaign')) u.searchParams.set('utm_campaign', 'default')

  // Fire‑and‑forget logging; in practice use service role at server or RPC
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/log-click`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ tool_id: tool.id, referrer: ref })
  }).catch(() => {})

  return NextResponse.redirect(u.toString(), 302)
}
```

### 14.2 Minimal CSV Columns
`name, slug, description, homepage_url, affiliate_url, primary_tag, tags, pricing, platform, language, no_signup, last_updated`.

### 14.3 Performance Budgets
- Home SSR TTFB ≤ 500ms (P50)
- DB query ≤ 80ms on 1k–5k rows
- Lighthouse Perf ≥ 85; A11y ≥ 90

### 14.4 Future Enhancements
- Normalize tags into `tags`, `tool_tags` join; Tag admin UI.
- Embeddings + reranker; Meilisearch/pgvector for semantic suggestions.
- User accounts + bookmarks/collections.
- Light crawler for `last_updated` and dead‑link checks.

