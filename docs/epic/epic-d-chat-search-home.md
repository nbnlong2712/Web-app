# EPIC D – Chat Search (Home)
**Goal:** Natural-language in → relevant results below input.
- **D-01 (S):** Hero + large input; suggestion chips below.
  - **AC:** Submit via Enter or Send.
- **D-02 (M):** Server Action `parseIntent()` (non-LLM fallback) → normalize `{primary_tag, tags[], pricing, no_signup}`.
  - **AC:** Unit test 10 common phrases.
- **D-03 (M):** Supabase FTS + filters; SSR render results.
  - **AC:** P50 TTFB ≤ 500ms with cache; skeleton during wait.
- **D-04 (S):** Highlight applied keywords/filters above results.
- **D-05 (S):** Minimal query logging (anonymized): normalized query, result count.
