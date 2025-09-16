# 11) Deployment & Environments
- **Hosting:** Vercel (App Router + Edge) + Supabase (managed Postgres).
- **Env vars:** `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_ACCESS_KEY` (if using key‑gate).
- **Branches:** `main` → production; `next`/PRs → preview deployments.
- **Migrations:** SQL files in `supabase/migrations/` applied via Supabase CLI or SQL editor.

---
