# Project Brief — AI Tools Library (MVP)

**Date:** Sep 15, 2025  
**Owner:** Product / Analyst  
**Source Inputs:** `/mnt/data/brief.md`, current User Stories & ACs (canvas)  
**Tech (target):** Next.js + Supabase (+ Vercel deploy)

---

## 1) Elevator Pitch
A web library that lets users describe their need in natural language and get 1–3 suitable AI tools in ≤2 actions; optimized for affiliate click‑outs.

---

## 2) Problem Statement
- Users struggle to choose among countless AI tools; information is scattered, noisy, and often outdated.  
- The product owner needs to measure effectiveness (CTR/outbound) but lacks transparent tracking.

**Why now:** The AI‑tool wave is accelerating; there is strong demand to pick the right tool for specific use cases.

---

## 3) Goals & Success Metrics (MVP)
- **G1: Effective discovery** → Users find the right 1–3 tools in ≤2 actions.  
  **Metric:** % of sessions with ≤2 actions before click‑out ≥ **60%**.  
- **G2: Monetization via affiliate** → Optimize outbound.  
  **Metric:** Outbound CTR (Visit) ≥ **8%** within 30 days.  
- **G3: Content bootstrapping** → Seed the initial dataset.  
  **Metric:** **100–200 tools** normalized to a single schema before go‑live.

**Secondary:** Home TTFB/SSR < 500ms; filter response < 300ms; 0 critical bugs after QA.

---

## 4) Target Users & JTBD
**Persona A — Content/Marketing**  
JTBD: “When I need ideas or content quickly, I want an AI tool matched to my use case so I can save time.”

**Persona B — Maker/Founder/Developer**  
JTBD: “When I build an MVP/side‑project, I want to quickly pick an AI tool (API/SaaS) that fits my scenario so I can integrate or experiment fast.”

**Persona C — Newcomer**  
JTBD: “When I’m curious about AI tools, I want simple, clear suggestions so I can start without feeling overwhelmed.”

---

## 5) Value Proposition
- **Natural search:** Chat‑style input mapped to an internal taxonomy (use case/tags).  
- **Fast decisions:** Clear card grid and detail view (pricing, tags, last_updated).  
- **Monetization:** Transparent affiliate tracking and a minimal performance dashboard.

---

## 6) Scope (MVP)
**In‑scope**
1. Home page with chat input and suggestion chips.  
2. Results with filters (category/tags/price/output).  
3. Card grid + tool detail modal/page.  
4. Outbound (CTR) tracking with basic aggregation.  
5. Admin Tool CRUD; batch import (CSV/JSON) if time permits.  
6. Minimal SEO for each tool; copy link.

**Out‑of‑scope (MVP)**
- End‑user accounts / social login.  
- User reviews/ratings.  
- Full multilingual content (beyond minimal VI/EN).  
- Direct tool comparison tables.  
- Advanced ML recommendations (use rules/taxonomy in MVP).

---

## 7) Content & Data
**Taxonomy (draft):** `category` (e.g., writing, image, video, code) · `use_case` (verb‑noun) · `tags` (snake_case) · `pricing` (free/paid) · `output_type` (text/image/video/code) · `affiliate_id` · `last_updated`.

**Data sources:** Manual seeding + CSV/JSON import; Submit Tool form (pending → moderation → tools).

---

## 8) Experience Overview
**Happy path (≤2 actions):**  
(1) Enter need (EN/VI) → (2) Receive top‑3 suggestions → (3) Open detail and **Visit**.

**Empty/Error states:** Helpful suggestions to adjust the query; skeleton shimmer when loading >100ms.

**Accessibility:** Adequate contrast; keyboard navigation; confirmation toast for copy.

---

## 9) Analytics & Experimentation
- **Events:** impression (card, detail), search_submitted, filter_applied, suggest_click, visit_click (with tool_id, query_id/session_id, source_page).  
- **Funnels:** home → results → detail → visit.  
- **Dashboards:** 7/30‑day CTR, top outbound, clicks/day.  
- **A/B (later, optional):** sort strategy (relevance vs CTR), show 3 vs 6 top results.

---

## 10) Architecture Snapshot (MVP)
- **Frontend:** Next.js (App Router, ISR/SSR), glass‑card UI; state: URL query + light client store.  
- **Backend/Data:** Supabase (Postgres + Auth for admin), RLS for tables `tools`, `click_logs`, `submissions`.  
- **Import pipeline:** upload → column mapping → preview → commit.  
- **Observability:** logs + simple metrics; lightweight feature flags (env‑based).

---

## 11) Constraints & Non‑functional
- **Performance:** TTFB/SSR < 500ms; filters < 300ms; thumbnails 16:9, lazy‑loaded, compressed.  
- **Security:** Admin auth (magic link); rate‑limit form; lightweight captcha.  
- **Reliability:** Basic tests; no critical bugs; preview deployment.  
- **SEO:** Route `/tool/[slug]`, meta/OG/Twitter tags.

---

## 12) Risks & Mitigations
- **R1: Low‑quality seed data** → Normalize schema + moderation; editorial checklist.  
- **R2: Low CTR** → Optimize layout/Visit button; A/B tests; highlight top‑3.  
- **R3: Filter performance** → Prefetch/ISR + DB indexes; limit payload; debounce.  
- **R4: Changing affiliate links** → Separate `affiliate_id` config; periodic checks.  
- **R5: Taxonomy drift** → Document conventions; tag‑lint script; limit tag count.

---

## 13) Delivery Plan
**Team:** 2 full‑stack devs + 1 PO/Analyst (part‑time) + 1 QA support.  
**Sprints (proposed):**  
- Sprint 1: Home chat input, filters, card grid, Admin CRUD, seed ≥50 tools.  
- Sprint 2: Detail + Visit tracking, skeleton, suggestion chips; seed ≥120 tools.  
- Sprint 3 (if time): Autocomplete, batch import, SEO, submit form, mini dashboard.

**Milestones:**  
- **M1 (end W1):** Search + browse usable (internal demo).  
- **M2 (end W2):** Tracking live; soft launch.  
- **M3:** Post‑MVP polish + content scale.

---

## 14) Open Questions
1. Ranking rule for top‑3: weighting relevance vs historical CTR?  
2. Include “model‑based” tags (e.g., GPT‑4o, Claude, Llama) or hide them?  
3. Collect emails (newsletter) in MVP?  
4. Spam protection threshold for Submit Tool (honeypot vs captcha)?

---

## 15) Approvals
- Product/Owner: ___  
- Engineering: ___  
- Design: ___  
- Date: ___
