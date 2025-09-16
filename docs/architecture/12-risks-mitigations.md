# 12) Risks & Mitigations
- **R1: Low‑quality seed data** → Editorial checklist, schema validation, moderation queue via `submissions`.
- **R2: Low CTR** → Prominent CTA, top‑3 layout, A/B tests on sort order (relevance vs CTR).
- **R3: Filter performance degradation** → Proper indexes, debounce, limited payload, server‑side pagination.
- **R4: Affiliate link volatility** → Store `affiliate_url` separate; scheduled checks; canonicalized UTM merge.
- **R5: Taxonomy drift** → Document conventions; linter script for `tags`; cap tag count.

---
