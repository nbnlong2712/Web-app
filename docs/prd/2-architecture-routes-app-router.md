# 2) Architecture & Routes (App Router)
```
/                 → Home (Chat Search, SSR results)
/library          → Library grid (ISR 5–15m)
/t/[slug]         → Tool Detail page (ISR 5–15m) + openable from modal
/go/[slug]        → Route Handler redirect (log click → 302 to affiliate)
/api/suggest      → (optional) chips suggestions by input
/admin/import     → (optional) CSV upload (protected by simple key)
```
- **Rendering strategy:** Home (SSR) for query responsiveness; Library & Detail (ISR) for SEO + speed; `/go` as an **Edge Route Handler** for low latency.
