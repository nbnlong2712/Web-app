# User Stories (PO) — AI Tools Library Web App

**Input source:** `/mnt/data/brief.md` (Brainstorming Session Results, Sep 15, 2025)

**MVP goals (2–3 weeks, 2 devs):** Help users find the right 1–3 AI tools within ≤2 interactions; outbound CTR (affiliate) ≥ 8%; seed 100–200 tools. Tech: Next.js + Supabase.

---

## Legend
- **Priority:** P0 (Must‑have for MVP) · P1 (Nice‑to‑have for MVP) · P2 (Post‑MVP)
- **Story points:** 1, 2, 3, 5 (by complexity)
- **Status:** Todo / In‑Progress / Done

---

## MVP Backlog Overview
| ID | User Story (English) | Priority | Points | Dependencies |
|---|---|---:|---:|---|
| US‑01 | As a **visitor**, I want a **chat‑style input** on the home page to describe my need in natural language **so that** the system can quickly suggest suitable tools. | P0 | 3 | — |
| US‑02 | As a **visitor**, when I type in the search box I want to see **instant suggestions** (suggestion chips/autocomplete) **so that** I can pick quickly. | P0 | 3 | US‑01 |
| US‑03 | As a **visitor**, I want to filter **by category, tags, price (free/paid), output type (Text/Image/Video/Code), use case** **so that** I can narrow the results. | P0 | 5 | — |
| US‑04 | As a **visitor**, I want a **card grid** with image, name, short description, tags, and an **Open ↗** button **so that** I can scan quickly. | P0 | 3 | US‑03 |
| US‑05 | As a **visitor**, I want a **tool detail modal/page** with description, pricing, tags, last_updated, and a **Visit (affiliate)** button **so that** I can decide to use it. | P0 | 3 | — |
| US‑06 | As a **product owner**, I want to **track outbound clicks** from the Visit button (attach UTM/ID) **so that** I can measure CTR and affiliate revenue. | P0 | 3 | US‑05 |
| US‑07 | As an **admin/editor**, I want to **add/edit tools** (name, slug, description, link, affiliate_id, pricing, category, tags, last_updated) **so that** I can seed the initial 100–200 tools. | P0 | 5 | — |
| US‑08 | As an **admin/editor**, I want to **import CSV/JSON** in batch (~100–200 tools) **so that** I can bootstrap data quickly. | P1 | 5 | US‑07 |
| US‑09 | As a **visitor**, I want to **copy the tool link** in the detail view **so that** I can share it. | P1 | 1 | US‑05 |
| US‑10 | As a **visitor**, while waiting for data I want to see **skeleton shimmer (glass card)** **so that** the experience feels smooth. | P1 | 2 | — |
| US‑11 | As a **visitor**, I want **quick suggestion chips** under the chat box (e.g., "write content", "generate image", "translation") **so that** I can explore. | P1 | 2 | US‑01 |
| US‑12 | As a **visitor**, I want **SEO‑friendly URL/meta** for each tool **so that** it's easy to discover on Google. | P1 | 3 | US‑07 |
| US‑13 | As a **submitter**, I want a **Submit Tool form** (name, link, description, optional email) and **moderation** **so that** I can contribute new tools. | P1 | 3 | US‑07 |
| US‑14 | As a **visitor**, I want a **VI/EN language toggle** (at minimum for titles & short descriptions) **so that** it's easier to read. | P2 | 3 | — |
| US‑15 | As an **admin**, I want a **minimal dashboard** (tool count, 7/30‑day CTR, top outbound) **so that** I can monitor performance. | P2 | 3 | US‑06 |

---

## Detailed Acceptance Criteria

### US‑01 — Chat‑style input (Home)
- **Given** I am on the home page, **When** I focus the input and type ≥ 2 characters, **Then** the placeholder disappears and relevant suggestions appear below.
- **Given** I press Enter or the Send button, **When** the content is valid, **Then** the system navigates to the results page and shows the top 3 best‑matching results.
- **Given** the query is natural language (VI/EN), **When** submitted, **Then** the system maps it to the internal taxonomy (use case + tags) for querying.

### US‑02 — Instant suggestions
- **Given** I am typing, **When** there are matches by tool name, tags, or use case, **Then** show up to 6 quick‑pick suggestions.
- **Given** I choose a suggestion, **When** I click/tap it, **Then** navigate directly to the corresponding results.

### US‑03 — Filters
- **Given** I am on the results page, **When** I toggle filters (category, tags, price, output), **Then** the list updates within ≤300ms.
- **Given** I reset filters, **When** I click "Clear", **Then** results return to the default state.

### US‑04 — Results card grid
- **Given** there are results, **When** the list renders, **Then** each card shows: 16:9 thumbnail, name, 1‑line description (line‑clamp), 3 tag chips, **Open ↗** button.
- **Given** there are no results, **When** the query returns empty, **Then** show an Empty State plus suggestions to refine the query.

### US‑05 — Tool detail (modal/page)
- **Given** I click a card, **When** the detail opens, **Then** I see full description, pricing (free/paid), tags, last_updated, **Visit** (primary), **Copy Link** (secondary).
- **Given** I click **Visit**, **When** navigating outbound, **Then** append affiliate parameters (if any) and log the click.

### US‑06 — CTR/affiliate tracking
- **Given** an outbound click occurs, **When** the log request is sent, **Then** store: tool_id, timestamp, source_page, query_id (if any), session_id.
- **Given** I need to view CTR, **When** aggregating, **Then** display: clicks / impressions for 7/30 days and top tools.

### US‑07 — Tool CRUD (Admin)
- **Given** I am a logged‑in admin, **When** creating/editing a tool, **Then** validate required fields: name, url, unique slug, pricing, category, ≥1 tag.
- **Given** save succeeds, **When** updating, **Then** the `last_updated` field is automatically set to now().

### US‑08 — CSV/JSON import (batch)
- **Given** I upload a valid file, **When** mapping columns → schema, **Then** preview 10 rows and confirm before import.
- **Given** import completes, **When** some rows fail, **Then** return a report of failed rows for fixing.

### US‑09 — Copy link
- **Given** I am on the tool detail, **When** I press **Copy Link**, **Then** the link with UTM/affiliate (if any) is copied to the clipboard and a "Copied" toast appears.

### US‑10 — Skeleton shimmer
- **Given** data is loading, **When** wait time >100ms, **Then** show skeleton cards with shimmer effect, and hide them when data is ready.

### US‑11 — Suggestion chips
- **Given** the home page, **When** it renders, **Then** show 6 hot use‑case chips; **When** a chip is clicked, **Then** fill the input and run the search.

### US‑12 — SEO
- **Given** each tool, **When** building, **Then** create route `/tool/[slug]`, set `<title>`, `<meta description>`, and OpenGraph/Twitter tags from data.

### US‑13 — Submit tool + Moderation
- **Given** the form is valid, **When** submitted, **Then** save into table `submissions` with status `pending` and send an email notification to admin (if configured).
- **Given** the admin reviews, **When** approved, **Then** move data to table `tools` and set `last_updated`.

### US‑14 — Language (VI/EN minimal)
- **Given** the user selects VI/EN, **When** switching, **Then** titles and short descriptions display in the chosen language (fallback to EN if missing).

### US‑15 — Minimal dashboard
- **Given** I am an admin, **When** I open the dashboard, **Then** I see total tools, 7/30‑day CTR, clicks‑per‑day chart, top 10 tools.

---

## Constraints & Non‑functional Requirements
- **Performance:** TTFB/SSR < 500ms (home); client‑side filtering < 300ms; 16:9 thumbnails compressed & lazy‑loaded.
- **Security:** Supabase Auth (email magic link) for admin; rate‑limit submit form; lightweight captcha.
- **UI:** Neo‑Glassmorphism (dark background + glass cards), 100–150ms motion, 2xl border radius.
- **Usability:** Clear Empty State; minimum content for SEO; normalized tags (snake_case).

## Definition of Ready (DoR)
- Clear description, sufficient acceptance criteria; lightweight UI wireframes; sample data available.

## Definition of Done (DoD)
- Basic tests; CTR tracking works; no critical bugs; preview deployment; QA verifies 100% of ACs.

---

## Suggested Sprint Plan
- **Sprint 1 (week 1):** US‑01, US‑03, US‑04, US‑07 (basic CRUD), seed 50 tools.
- **Sprint 2 (week 2):** US‑05, US‑06, US‑10, US‑11, increase seed to 120 tools.
- **Sprint 3 (if time):** US‑02, US‑08, US‑09, US‑12, US‑13, US‑15.

---

## Epics

### User Accounts and Bookmarks - Brownfield Enhancement

#### Epic Goal
Add user authentication and bookmarking functionality to allow users to save and manage their favorite AI tools, enhancing personalization and engagement.

#### Epic Description

**Existing System Context:**
- Current relevant functionality: Public browsing of AI tools with search and filtering
- Technology stack: Next.js, Supabase, Tailwind CSS, shadcn/ui
- Integration points: Supabase database, authentication system, existing tool display components

**Enhancement Details:**
- What's being added/changed: User authentication system, bookmarking capability, personal dashboard
- How it integrates: Through Supabase Auth, new database tables, and UI components that integrate with existing tool display
- Success criteria: Users can authenticate, bookmark tools, and view bookmarks in a dashboard

#### Stories
1. **Story 1:** Implement user authentication (login/signup) with Supabase Auth
2. **Story 2:** Add bookmarking functionality to tool cards and detail views
3. **Story 3:** Create user dashboard to display bookmarks

#### Compatibility Requirements
- [x] Existing APIs remain unchanged
- [x] Database schema changes are backward compatible
- [x] UI changes follow existing patterns
- [x] Performance impact is minimal

#### Risk Mitigation
- **Primary Risk:** Integration with existing authentication might conflict with admin access
- **Mitigation:** Use separate auth flows for users and admins
- **Rollback Plan:** Remove new auth tables and components, revert to public-only access

#### Definition of Done
- [x] All stories completed with acceptance criteria met
- [x] Existing functionality verified through testing
- [x] Integration points working correctly
- [x] Documentation updated appropriately
- [x] No regression in existing features