# EPIC B – Supabase & Data Model
**Goal:** Tables, indexes, RLS; seed data.
- **B-01 (S):** Create `tools`, `clicks` as per spec.
  - **AC:** Migration runs; columns match doc.
- **B-02 (S):** Add FTS + trigram + GIN(tags) indexes.
  - **AC:** Reasonable EXPLAIN cost; demo query < 80ms on 1k rows.
- **B-03 (S):** RLS: `tools` public read; `clicks` anonymous insert, no select.
  - **AC:** Tested with anon/service role.
- **B-04 (M):** Seed 100–200 tools from sample CSV.
  - **AC:** No errors, unique `slug`; ≥ 8 diverse primary_tags.
