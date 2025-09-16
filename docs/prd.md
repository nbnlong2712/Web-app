**Facilitator:** Business Analyst – Mary
**Participant:** You

# Brainstorming Session Results

## Executive Summary

**Topic:** AI tools library web app (categorize, tag, fast discovery, monetizable via affiliate)

**Session Goals:** Broad ideation; ship a simple MVP fast; set up monetization/affiliate; keep tech stack minimal (Next.js + Supabase)

**Techniques Used:** What If Scenarios; SCAMPER; Mind Mapping; Resource Constraints; Assumption Reversal; Question Storming

**Total Ideas Generated:** 6

---

## Technique Sessions

### SCAMPER – Expansion (15’)
**S – Substitute:** Replace chat box with a 1–2 question quiz?
**C – Combine:** Chat + facet filters in parallel?
**A – Adapt:** Borrow UX from API/SAAS finders (badge, chips, quick filters)?
**M – Modify:** Turn the popup into route `/t/[slug]` for SEO?
**P – Put to other use:** Use click data to power **Trending**.
**E – Eliminate:** Remove user accounts in MVP to reduce friction?
**R – Reverse:** Instead of users searching, suggest 3 **tool stacks** per goal.

**UI Style (chosen): Neo-Glassmorphism**
- **Background:** Dark gradient + subtle noise; glass containers (blur 12–16px, bg `rgba(255,255,255,0.08)`, 1px border `rgba(255,255,255,0.18)`, soft shadow).
- **Chat input:** XL rounded glass bar, mic/send icons; clear placeholder; **suggestion chips** underneath.
- **Card:** glass surface, subtle border; 16:9 thumbnail; 1-line title + 2-line description (line-clamp); tag chips; footer with “Open ↗”.
- **Detail Modal:** strong blur overlay; glass panel; primary CTA **Visit** (filled), secondary **Copy Link**; show `last_updated`.
- **Skeleton shimmer:** glass card placeholders with horizontal shimmer.
- **Motion:** hover elevate 2–4px; gentle fade/scale 100–150ms.

### Component Spec (no image references)
**A. Chat Search (Home)**
- **Layout:** hero centered; input max width 720px; suggestion chips below.
- **Behavior:** typing → instant suggestions; submit → server action parses intent → FTS query; results update below input; while waiting show **skeleton**; if empty show **Empty state** (title, copy, tag suggestions).
- **A11y:** visually-hidden label; results region `aria-live="polite"`.

**B. Library Grid**
- **Columns:** mobile 1, tablet 2, desktop 3–4; 24px gap.
- **Card:** 16:9 thumbnail; tool name; 2-line description clamp; tag chips; pricing badge; open icon/button.
- **Filters:** chip row (Category/Tags) + expandable panel (Pricing/Platform/Language).

**C. Tool Detail Modal**
- **Info:** name, `primary_tag`, description, pricing, platform, language, `no_signup`, `last_updated`.
- **Actions:** **Visit** → redirect `/go/[slug]` (log click + UTM) then go to affiliate URL; **Copy Link**, **Share`**.
- **SEO:** dedicated detail page at `/t/[slug]` (ISR) accessible outside modal.

**D. Empty & Loading**
- **Loading:** 8–12 card skeletons.
- **Empty:** title + copy + popular tag suggestions + **Reset filters** button.

### Mind Mapping – Taxonomy (10’)
**Main branches (suggested):** Use case (Text→X, Image→X, Video→X, Audio→X, Data, Code), Pricing (Free, Freemium, Paid), Platform (Web, API, Desktop), Skill (Beginner, Pro), Compliance (NSFW, Safe), Language (VI, EN), Status (Live, Beta).

### Resource Constraints – Distill MVP (5’)
- Constraints: 2 devs, 2–3 weeks, seed 100–200 tools.
- Outcome target: Find a tool in ≤2 clicks, affiliate CTR ≥ 8%.

---

### What If Scenarios – Kickoff (10’)
**Description:** Use hypotheticals to broaden approaches and value.
**Prompt 1:** If users describe needs in natural language (e.g., “create a talking avatar from text”), how do we route them to 1–3 relevant tools **fastest**?
- Thinking frame: (1) map intent → taxonomy; (2) quick suggestions via community/ratings; (3) 1–2 clarifying quiz questions; (4) SEO + LLM query rewrite.

**Ideas Generated:**
1. Home has a **central chat-style input** (placeholder: “Describe what you need…”, Send button, Enter to submit). On submit, the system converts natural language to **filters** and **renders results** right below; the results region is a live-updating grid.
2. **Library page** shows a **responsive 3–4 column grid** of tool cards; top filter bar with **chips** (Category/Tags) and a **filter panel** (Pricing/Platform/Language).
3. Clicking a tool opens a **detail popup** (name, short description, tags, last updated, images/screens) + **CTA** linking to the tool’s site with **affiliate**.
4. **Database** has tables for tools, categories, tags, join table tool_tags; store `affiliate_url`.
5. **Tag-based filtering** (MVP: one **primary_tag** per tool: images, image-generator, text-to-video…; later add `extra_tags[]`).
6. **UI loading states:** if results ready, render grid immediately; otherwise show 8–12 card **skeletons**; if no results → clear Empty state + popular tag suggestions.

**Insights (temp):**
- Need a clear **taxonomy** + **intent → tag** mapping for natural language queries.
- With **Next.js**, use **SSG/ISR** for library & detail pages; **SSR** for natural-language search results.
- MVP search can use **Postgres full-text + trigram** (Supabase); add a lightweight **LLM rewriter** (server action) to map phrases → filters.
- Add **click tracking** (table `clicks`) to measure affiliate performance.

**Prompt 2:** If 80% of users don’t know tool names and state only **task + constraints** (“free”, “no signup”), what **filter set** do we generate and how does the UI respond within 300ms?

**Prompt 2 – Proposed design (yours + Mary’s notes):**
- **Filter mapping:** task → `category`; constraints → `facets`: `pricing: free`, `no_signup: true`, `trial: yes/no`, `language: vi/en`, `platform: web/api`.
- **Tag model (MVP):** allow exactly **one `primary_tag`**; keep `extra_tags[]` optional for future.
- **UI ≤300ms:** (1) instant client-side keyword parse for **immediate hints** (cache top results); (2) **SSR** for canonical results; (3) show **skeleton shimmer** during wait; (4) if empty, show **Empty state** + suggested tags.
- **State machine:** `initial → loading → results | empty`.
- **Perf notes:** Edge-cache common facets, Postgres FTS + trigram indexes, minimal card payloads for low TTFB.

**Prompt 3:** If strong **SEO** is required while keeping a chat experience, how should Next.js routing/rendering be designed (app router, route handlers, SSG + ISR mix)?

---

## Idea Categorization

### Immediate Opportunities (Ready now)
1. Chat-like search → map to filters and show results beneath (SSR).
2. Library grid + tool detail modal + affiliate CTA.
3. Minimal Supabase schema (tools, categories, tags, tool_tags, clicks).
4. Affiliate tracking via `/go/[toolSlug]` redirect + UTM.

### Future Innovations (Needs R&D)
1. Auto-tagging via embeddings (pgvector/Meilisearch) & metadata crawling.
2. LLM/Reranker-based suggestions from longer user descriptions.
3. **Community reviews** and trust scoring.

### Moonshots
1. “Build your stack”: create goal-based playbooks and export automated workflows.
2. Browser extension: context-aware suggestions based on the current page.

### Insights & Learnings
- Chat-like search is compelling, but must **map fast** to filters; target response < 500ms.
- **SSG/ISR** for static pages; **SSR** for search to keep results fresh.
- Need **data ops** (CSV import, curation, periodic updates).

---

## Action Planning

### Top 3 Priority Ideas

1. **MVP Chat Search + Filters**
   - Rationale: Differentiated UX, addresses natural-language intent → better conversion.
   - Next steps: Design taxonomy; implement server action to parse intent; Postgres FTS queries.
   - Resources: 1 FE, 1 BE (Next.js + Supabase); 1 content curator to seed 100 tools.
   - Timeline: 1–2 weeks (seed in parallel).

2. **Library Grid + Modal + Affiliate Redirect**
   - Rationale: Browse-all view, clear CTA, measurable click-through.
   - Next steps: Card component, Modal, `/go/[slug]` logging; ISR for detail pages.
   - Resources: FE dev + Supabase tables + light content.
   - Timeline: ~1 week.

3. **Data Schema & Admin Import**
   - Rationale: Real data to launch quickly.
   - Next steps: Create tables; admin CSV upload; metadata checklist.
   - Resources: BE dev + Notion/Sheet.
   - Timeline: 3–4 days.

---

# MVP Definition – Next.js + Supabase (Neo-Glassmorphism)

## 1) Goals & Scope
- **Goal:** Users describe needs in natural language → receive 3–12 relevant tools in ≤ 1 second, with a clear affiliate CTA.
- **In-scope (MVP):**
  1. Home with **Chat Search** + results grid.
  2. **Library** showing all tools + chip filters.
  3. **Tool Detail** (modal + route `/t/[slug]`) with **Visit** CTA.
  4. **Affiliate Redirect** `/go/[slug]` + log **clicks** + UTM.
  5. Seed **100–200 tools** from CSV.
- **Out-of-scope (MVP):** user accounts, reviews/ratings, auto-crawler, Meilisearch/pgvector, payments.

## 2) Architecture & Routes (App Router)
```
/                 → Home (Chat Search, SSR results)
/library          → Library grid (ISR 5–15m)
/t/[slug]         → Tool Detail page (ISR 5–15m) + openable from modal
/go/[slug]        → Route Handler redirect (log click → 302 to affiliate)
/api/suggest      → (optional) chips suggestions by input
/admin/import     → (optional) CSV upload (protected by simple key)
```
- **Rendering strategy:** Home (SSR) for query responsiveness; Library & Detail (ISR) for SEO + speed; `/go` as an **Edge Route Handler** for low latency.

## 3) UI Components (neo-glass summary)
- **Chat input:** glass, rounded, mic/send; chips below.
- **Card:** glass, 16:9 thumbnail, 1-line title, 2-line description, tag chips, pricing badge, open icon.
- **Modal:** blur overlay; glass panel; primary **Visit** CTA; show `last_updated`.
- **States:** 8–12 skeletons; empty state with tag suggestions + reset button.

## 4) Data Model (Supabase / Postgres)
> To **minimize MVP**, use `tags text[]` instead of join tables; normalize later.

**tables.tools**
- `id uuid pk default gen_random_uuid()`
- `name text not null`
- `slug text unique not null`
- `description text`
- `homepage_url text`
- `affiliate_url text`  — UTM appended on server during redirect
- `primary_tag text`    — e.g., 'image-generation', 'text-to-video'
- `tags text[]`         — e.g., {'images','image-generator'}
- `pricing text`        — 'free'|'freemium'|'paid'
- `platform text`       — 'web'|'api'|'desktop'
- `language text[]`     — {'en','vi'} (optional)
- `no_signup boolean default false`
- `status text default 'live'` — 'live'|'beta'|'deprecated'
- `last_updated date`
- `created_at timestamp default now()`

**tables.clicks**
- `id bigint pk generated always as identity`
- `tool_id uuid references tools(id)`
- `clicked_at timestamp default now()`
- `referrer text`
- `utm_source text`
- `utm_medium text`
- `utm_campaign text`
- `ip inet`            — optional (Edge)

**Indexes / FTS**
- `GIN` on `to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,''))`
- `GIN` on `tags`
- `GIN` trigram on `name` (pg_trgm)
- `BTREE` on `primary_tag`, `pricing`, `status`

**RLS Policies (suggested)**
- `tools`: `SELECT` allowed for `anon` (public read). `INSERT/UPDATE/DELETE` only for `service_role`.
- `clicks`: allow `INSERT` by `anon`, but **deny `SELECT`** (protect data). Optionally limit columns via `WITH CHECK`.

## 5) Data Import & Admin
- **CSV fields:** name, slug, description, homepage_url, affiliate_url, primary_tag, tags (`images;image-generator`), pricing, platform, language (`vi;en`), no_signup, last_updated.
- **Admin Import:** `/admin/import` form → server action parses → upsert into `tools`.
- **Validation:** require `name`, `slug`, `homepage_url`, at least one `primary_tag`.

## 6) Search & Intent Mapping (MVP)
- **Client:** extract simple **keywords**: task (“text to video”), constraints (“free”, “no signup”).
- **Server action:** normalize into filters `{primary_tag, tags[], pricing, no_signup}` and run FTS + filter query.
- **LLM rewriter (optional):** normalize natural language into defined tags; fallback to non-LLM if disabled.

## 7) Acceptance Criteria (MVP)
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

## 8) KPIs & Tracking
- **Affiliate CTR** (Visit clicks ÷ card views) target **≥ 8%**.
- **Search success rate:** sessions with at least one tool click.
- **Median latency:** Home TTFB ≤ 500ms (cached), Detail ≤ 400ms.
- **Indexable pages:** ≥ 100 `/t/[slug]` pages indexed in 2 weeks.

## 9) Post-MVP Roadmap
1. Normalize `tags` into separate tables + tag admin.
2. Smarter suggestions (embeddings/pgvector/Meilisearch).
3. User accounts + bookmarks/collections.
4. Lightweight crawler to refresh `last_updated` and check dead links.

---

# Taxonomy & Intent Mapping (MVP)

## 1) `primary_tag` catalog (36 suggested) + short synonyms
- **text-to-image** — t2i, image generator
- **image-editing** — remove bg, inpaint, retouch
- **image-upscaling** — upscale, super-resolution
- **image-to-image** — img2img, style transfer
- **text-to-video** — t2v, video generator
- **talking-avatar** — talking head, avatar video
- **video-editing** — auto caption, cut, remove filler
- **text-to-speech** — TTS, voiceover
- **speech-to-text** — STT, transcribe
- **voice-cloning** — clone voice
- **music-generation** — music ai
- **sound-effects** — sfx
- **chatbot** — ai chat
- **document-qa** — chat with pdf, RAG
- **summarization** — summarize
- **translation** — translate
- **paraphrase** — rewrite, rephrase
- **coding-assistant** — copilot
- **code-generation** — generate code
- **sql-generation** — text-to-sql
- **data-analysis** — analyze csv
- **presentation** — slides generator
- **notetaking** — meeting notes
- **research** — web research
- **agent-builder** — AI agents, automation
- **rag-platform** — vector search, ingestion
- **model-hosting** — inference API
- **fine-tuning** — finetune
- **design-generator** — logo/UI/brand
- **prompt-library** — prompt marketplace
- **seo-writing** — blog/SEO
- **email-assistant** — email writer
- **ecommerce** — product description
- **education** — flashcards, quiz
- **security-privacy** — moderation
- **nsfw** — adult (hidden by default)

> Keep 24–36 `primary_tag` for coverage vs. maintainability. `nsfw` is special for safety filtering.

## 2) Facets & standard tags
- `pricing`: `free`, `freemium`, `paid`
- `platform`: `web`, `api`, `desktop`
- `language`: `vi`, `en`, …
- `no_signup`: `true`
- `special`: `open-source`, `self-hosted`, `mobile`, `trial`, `watermark-free`, `brand-safe`, `education`

## 3) Mapping rules (natural language → filters)
- **Normalize:** lowercase, strip punctuation; add **diacritics-free** Vietnamese for matching.
- **Constraints (high priority):**
  - `free|0đ` → `pricing=free`
  - `freemium` → `pricing=freemium`
  - `paid|$|đ` → `pricing=paid`
  - `no signup` → `no_signup=true`
  - `api` → `platform=api`; `web` → `platform=web`; `desktop|windows|mac` → `platform=desktop`
  - `vietnamese|` → include `vi`; `english` → include `en`
- **Use case → `primary_tag`:** synonym dictionary; if multiple matches, prefer **specific > generic** (e.g., `talking-avatar` over `text-to-video`).
- **Fallback:** if no `primary_tag`, take **top-3 nearest tags** via FTS+trigram from `name/description/tags` as suggestions.
- **Sanitization:** drop stop-phrases (“I need”, “please”, “help”).

## 4) Pseudocode `parseIntent(input)` (non-LLM)
```ts
function parseIntent(input: string) {
  const text = normalize(input); // lowercase + strip + remove diacritics (vi)
  const out: any = { tags: [] };
  if (/(mien phi|free|0d|0đ)/.test(text)) out.pricing = 'free';
  else if (/freemium/.test(text)) out.pricing = 'freemium';
  else if (/(tra phi|paid|\$|usd|vnd|đ)/.test(text)) out.pricing = 'paid';
  if (/(khong can dang ky|no signup|khong can account)/.test(text)) out.no_signup = true;
  if (/api/.test(text)) out.platform = 'api';
  if (/(web|trinh duyet)/.test(text)) out.platform = 'web';
  if (/(desktop|windows|macos|mac)/.test(text)) out.platform = 'desktop';
  if (/(tieng viet|vietnamese|vi)/.test(text)) out.language = ['vi'];
  if (/(english|en)/.test(text)) out.language = [...(out.language||[]), 'en'];
  for (const [tag, syns] of Object.entries(SYN)) {
    if (syns.some(s => text.includes(s))) { out.primary_tag = tag; break; }
  }
  for (const [t, syns] of Object.entries(FLAT_TAGS)) {
    if (syns.some(s => text.includes(s))) out.tags.push(t);
  }
  return out;
}
```

## 5) Supabase query (example)
```sql
select * from tools
where (
  (coalesce(:primary_tag,'') = '' or primary_tag = :primary_tag)
  and (:pricing is null or pricing = :pricing)
  and (:no_signup is null or no_signup = :no_signup)
  and (:platform is null or platform = :platform)
  and (:language is null or :language = ANY(language))
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

## 6) 20 test cases (input → expected filters)
1. “create **images** from text, **free**” → `{primary_tag: 'text-to-image', pricing: 'free'}`
2. “**remove background** fast, **no signup**” → `{primary_tag: 'image-editing', no_signup: true}`
3. “**upscale** old photos on the **web**” → `{primary_tag: 'image-upscaling', platform: 'web'}`
4. “**talking avatar** from **text**, **free**” → `{primary_tag: 'talking-avatar', pricing: 'free'}`
5. “**generate video** from prompt, **Vietnamese**” → `{primary_tag: 'text-to-video', language: ['vi']}`
6. “**auto subtitles** for videos” → `{primary_tag: 'video-editing'}`
7. “**TTS** Vietnamese via **API**” → `{primary_tag: 'text-to-speech', platform: 'api', language: ['vi']}`
8. “**transcribe** English meetings” → `{primary_tag: 'speech-to-text', language: ['en']}`
9. “**clone voice** baritone male” → `{primary_tag: 'voice-cloning'}`
10. “**ask PDF** in Vietnamese” → `{primary_tag: 'document-qa', language: ['vi']}`
11. “**summarize** long article” → `{primary_tag: 'summarization'}`
12. “**translate** EN ↔ VI, **free**” → `{primary_tag: 'translation', pricing: 'free'}`
13. “**rewrite** a polite email” → `{primary_tag: 'paraphrase'}`
14. “**coding assistant** for JavaScript” → `{primary_tag: 'coding-assistant'}`
15. “write **SQL** from description” → `{primary_tag: 'sql-generation'}`
16. “**analyze CSV** quickly” → `{primary_tag: 'data-analysis'}`
17. “**generate slides** for pitch” → `{primary_tag: 'presentation'}`
18. “**agent** to automate web tasks” → `{primary_tag: 'agent-builder'}`
19. “**host models** via **API**” → `{primary_tag: 'model-hosting', platform: 'api'}`
20. “**fine-tune** a small model” → `{primary_tag: 'fine-tuning'}`

## 7) Copy & SEO conventions (short)
- `name`: one clear benefit; `description`: 120–160 chars including `primary_tag`/synonyms.
- `slug`: kebab-case; prefer short `name`, add `primary_tag` if duplicate.
- `/t/[slug]`: H1=`name`, H2=key benefit; add minimal Product JSON-LD.

---

## Reflection & Follow-up

**What Worked Well**
- (to be updated)

**Areas for Further Exploration**
- (to be updated)

**Recommended Follow-up Techniques**
- (to be updated)

**Questions That Emerged**
- (to be updated)

**Next Session Planning**
- **Suggested topics:** MVP features, tagging taxonomy, search UX, monetization funnels
- **Recommended timeframe:** This week
- **Preparation needed:** Collect 20–50 AI tools (name, URL, short description, tags, price, affiliate link if any)


# Development Backlog (MVP)

## Milestones (2–3 weeks)
1. **M1 – Foundation & Data (Week 1):** Project setup, Supabase schema, seed 100–200 tools, basic Library grid.
2. **M2 – Search & Detail (Week 2):** Chat Search (SSR), modal/detail, affiliate redirect, SEO/ISR.
3. **M3 – Admin & Polishing (Week 3):** CSV import, analytics/KPI, performance tuning, QA & Launch.

> Estimates: S (≤0.5 day), M (1–2 days), L (3–4 days). Task IDs `[EPIC]-[number]`.

---

## EPIC A – Project Setup & UI Theme
**Goal:** Init Next.js (App Router), Tailwind + shadcn/ui, Neo-Glassmorphism theme.
- **A-01 (S):** Init Next.js + TypeScript + App Router + ESLint/Prettier.
  - **AC:** App builds, lint passes; `@/` alias works.
- **A-02 (S):** Configure Tailwind; install shadcn/ui, lucide-react, Framer Motion.
  - **AC:** `Button`, `Card`, `Dialog` baseline; sample motion works.
- **A-03 (S):** Set Neo-Glass tokens: colors, blur, border, shadow.
  - **AC:** `.glass` utility class reusable for card/modal.
- **A-04 (S):** Base layout: simple header/footer, 1200px container.
  - **AC:** Responsive; Lighthouse A11y ≥ 90.

## EPIC B – Supabase & Data Model
**Goal:** Tables, indexes, RLS; seed data.
- **B-01 (S):** Create `tools`, `clicks` as per spec.
  - **AC:** Migration runs; columns match doc.
- **B-02 (S):** Add FTS + trigram + GIN(tags) indexes.
  - **AC:** Reasonable EXPLAIN cost; demo query < 80ms on 1k rows.
- **B-03 (S):** RLS: `tools` public read; `clicks` anonymous insert, no select.
  - **AC:** Tested with anon/service role.
- **B-04 (M):** Seed 100–200 tools from sample CSV.
  - **AC:** No errors, unique `slug`; ≥ 8 diverse primary_tags.

## EPIC C – Library Grid & Filters
**Goal:** Browse all tools, filter quickly.
- **C-01 (M):** `/library` (ISR 10m) renders 3–4 column grid.
  - **AC:** Responsive; skeleton on ISR fallback.
- **C-02 (S):** `ToolCard` (glass, 16:9, title, desc clamp-2, chips, pricing badge).
  - **AC:** Keyboard-focusable; “Open” tooltip.
- **C-03 (M):** Filters: Category/Tags chips + Pricing/Platform/Language panel.
  - **AC:** Toggles without full reload; syncs with URL query.
- **C-04 (S):** Empty state + Reset filters.

## EPIC D – Chat Search (Home)
**Goal:** Natural-language in → relevant results below input.
- **D-01 (S):** Hero + large input; suggestion chips below.
  - **AC:** Submit via Enter or Send.
- **D-02 (M):** Server Action `parseIntent()` (non-LLM fallback) → normalize `{primary_tag, tags[], pricing, no_signup}`.
  - **AC:** Unit test 10 common phrases.
- **D-03 (M):** Supabase FTS + filters; SSR render results.
  - **AC:** P50 TTFB ≤ 500ms with cache; skeleton during wait.
- **D-04 (S):** Highlight applied keywords/filters above results.
- **D-05 (S):** Minimal query logging (anonymized): normalized query, result count.

## EPIC E – Tool Detail (Modal + Page)
**Goal:** View details and go affiliate.
- **E-01 (S):** Detail modal (Dialog) opened from card.
  - **AC:** ESC closes; focus trap; deep-link to `/t/[slug]`.
- **E-02 (M):** `/t/[slug]` (ISR 10m) mirrors modal content.
  - **AC:** SEO meta (title/desc/canonical) + minimal Product JSON-LD.
- **E-03 (S):** **Visit** and **Copy Link** CTA.
  - **AC:** Copy appends UTM if present.

## EPIC F – Affiliate Redirect & Tracking
**Goal:** Log click and redirect fast.
- **F-01 (S):** Edge Route Handler `/go/[slug]`.
  - **AC:** Insert row into `clicks` (tool_id, ts, referrer, utm_*) then 302.
- **F-02 (S):** Append `utm_source=ailib&utm_medium=referral&utm_campaign=default` if missing.
  - **AC:** Ensure UTM not duplicated.
- **F-03 (S):** Simple anti-bot: ignore HEAD, filter common user-agents, light IP rate-limit.

## EPIC G – Admin Import
**Goal:** Quick CSV upsert.
- **G-01 (M):** `/admin/import` (CSV form + server action).
  - **AC:** Show created/updated counts; row-level error reporting.
- **G-02 (S):** Generate `slug` if missing; normalize `tags` from `;`.
- **G-03 (S):** Protect via env access key or simple Basic Auth.

## EPIC H – SEO & Discoverability
**Goal:** Good indexing & share previews.
- **H-01 (S):** Standard metadata + OpenGraph/Twitter cards.
- **H-02 (S):** Auto sitemap.xml & robots.txt.
- **H-03 (S):** Breadcrumb JSON-LD: Home → Library → Tool.
- **H-04 (S):** ISR warm-up for top 100 `/t/[slug]`.

## EPIC I – Analytics & KPI
**Goal:** Measure affiliate CTR and search performance.
- **I-01 (S):** Integrate Plausible or GA4.
- **I-02 (S):** Events: `tool_card_view`, `visit_click`, `search_submit`.
- **I-03 (S):** Simple `/admin/metrics` page with CTR, top tools, top tags.

## EPIC J – Performance & A11y
**Goal:** Fast and accessible.
- **J-01 (S):** ISR cache 10m; revalidate on import.
- **J-02 (S):** Lazy-load images; correct `next/image` sizes.
- **J-03 (S):** Lighthouse: Perf ≥ 85, A11y ≥ 90.

## EPIC K – QA & Launch
**Goal:** Stable & launch-ready.
- **K-01 (S):** QA checklist per MVP Acceptance Criteria.
- **K-02 (S):** Custom **404/500** (glass style).
- **K-03 (S):** Env hygiene (`NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ADMIN_ACCESS_KEY`).
- **K-04 (S):** Deploy on Vercel; Supabase prod DB; domain & SSL.

---

## Definition of Ready (DoR)
- Task has clear description & AC; copy/mocks ready (if needed); ≥ 50 sample rows; env configured.

## Definition of Done (DoD)
- Lint/tests pass; AC met; events/logs tracked; docs updated; Lighthouse stays above thresholds.

