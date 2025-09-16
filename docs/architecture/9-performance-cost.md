# 9) Performance & Cost
- **Targets:** Home TTFB (SSR) ≤ 500ms, Library/Detail LCP fast via ISR; filter updates ≤ 300ms.
- **Tactics:** DB indexes; small card payload; image lazy‑loading; ISR cache (10m) with on‑demand revalidation post‑import.
- **Scale path:** When data > 5k rows or complex queries arise, introduce pgvector/Meilisearch for semantic search and reranking. Keep Vercel/Supabase tiers minimal until CTR & traffic justify upgrades.

---
