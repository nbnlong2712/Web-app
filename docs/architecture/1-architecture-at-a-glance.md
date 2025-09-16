# 1) Architecture at a Glance
**Goal:** Users describe their need (EN/VI) and receive 1–3 highly relevant tools in ≤2 interactions, with a clear outbound "Visit" CTA and affiliate tracking.  
**Stack:** Next.js (App Router) + Tailwind + shadcn/ui + Framer Motion; Supabase (Postgres + RLS) for data & simple auth; Vercel for hosting.  
**Rendering:** SSR for search; ISR for library and tool detail; Edge route for `/go/[slug]` logging + redirect.  
**KPIs:** ≤2 actions to find tools; outbound CTR ≥ 8%; TTFB/SSR ≤ 500ms; filter response ≤ 300ms.

## 1.1 High-Level Diagram
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

## 1.2 Core Decisions
- **Next.js App Router** for hybrid SSR/ISR, route handlers, and edge runtime support.
- **Supabase Postgres** as a single source of truth (tables: `tools`, `clicks`, optional `submissions`).
- **RLS**: public read for `tools`; insert-only for `clicks` by anonymous; admin writes via service role.
- **Non-LLM intent parsing first** (fast regex/dictionary) with optional LLM rewriter later.
- **Edge redirect** for `/go/[slug]` to minimize latency and ensure click logging even under load.
- **Minimal admin** for CSV import and CRUD; secure via env-gated access key or basic auth.

---
