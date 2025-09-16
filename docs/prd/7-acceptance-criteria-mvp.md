# 7) Acceptance Criteria (MVP)
**Home – Chat Search**
- [ ] Enter/Submit shows **SSR results** below input; P50 **TTFB ≤ 500ms** (with cache) and **FCP ≤ 1s** on a typical desktop.
- [ ] **Suggestion chips** toggle instantly (client) and update results.
- [ ] Loading shows **skeletons**; if empty, show **Empty state** with 6 suggested tags.

**Library**
- [ ] Responsive grid: 1/2/3/4 columns (mobile/tablet/sm/md+).
- [ ] Category/Tags chips + Pricing/Platform/Language filters work **without full page reload**.
- [ ] Page uses **ISR** and has complete SEO meta (title/description/canonical).

**Tool Detail (Modal + /t/[slug])**
- [ ] Modal opens from card; route `/t/[slug]` is accessible directly.
- [ ] Show at minimum: name, description, primary_tag, tags, pricing, platform, language, last_updated.
- [ ] **Visit** CTA goes via `/go/[slug]`.

**Affiliate Redirect (/go/[slug])**
- [ ] Write **one row** into `clicks` with `tool_id`, `clicked_at`, `referrer`, and any `utm_*`.
- [ ] 302 to `affiliate_url` with `utm_source=ailib&utm_medium=referral&utm_campaign=default` if missing.

**Admin Import**
- [ ] Upload CSV; valid → upsert; show created/updated counts.
- [ ] Auto-generate `slug` if missing; prevent duplicates.

**Security & RLS**
- [ ] `tools` readable publicly; writes only via service role.
- [ ] `clicks` insert-only for anon; **no selects**.

**Performance & Quality**
- [ ] P50 Postgres query time **≤ 80ms** on 1k–5k tools dataset.
- [ ] Lighthouse Performance **≥ 85** on Home & Library.
