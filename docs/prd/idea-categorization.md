# Idea Categorization

## Immediate Opportunities (Ready now)
1. Chat-like search → map to filters and show results beneath (SSR).
2. Library grid + tool detail modal + affiliate CTA.
3. Minimal Supabase schema (tools, categories, tags, tool_tags, clicks).
4. Affiliate tracking via `/go/[toolSlug]` redirect + UTM.

## Future Innovations (Needs R&D)
1. Auto-tagging via embeddings (pgvector/Meilisearch) & metadata crawling.
2. LLM/Reranker-based suggestions from longer user descriptions.
3. **Community reviews** and trust scoring.

## Moonshots
1. “Build your stack”: create goal-based playbooks and export automated workflows.
2. Browser extension: context-aware suggestions based on the current page.

## Insights & Learnings
- Chat-like search is compelling, but must **map fast** to filters; target response < 500ms.
- **SSG/ISR** for static pages; **SSR** for search to keep results fresh.
- Need **data ops** (CSV import, curation, periodic updates).

---
