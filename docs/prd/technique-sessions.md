# Technique Sessions

## SCAMPER – Expansion (15’)
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

## Component Spec (no image references)
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

## Mind Mapping – Taxonomy (10’)
**Main branches (suggested):** Use case (Text→X, Image→X, Video→X, Audio→X, Data, Code), Pricing (Free, Freemium, Paid), Platform (Web, API, Desktop), Skill (Beginner, Pro), Compliance (NSFW, Safe), Language (VI, EN), Status (Live, Beta).

## Resource Constraints – Distill MVP (5’)
- Constraints: 2 devs, 2–3 weeks, seed 100–200 tools.
- Outcome target: Find a tool in ≤2 clicks, affiliate CTR ≥ 8%.

---

## What If Scenarios – Kickoff (10’)
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
