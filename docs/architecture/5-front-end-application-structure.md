# 5) Front-End Application Structure
**UI Framework:** Tailwind + shadcn/ui, motion via Framer Motion; theme: Neo‑Glassmorphism (dark gradient background, glass cards and modals, 2xl radius, 100–150ms micro-interactions).

**Pages & Key Components**
- `app/page.tsx` (Home): chat input, suggestion chips, SSR results region (aria-live="polite"), empty/loading states (skeleton shimmer >100ms).
- `app/library/page.tsx` (ISR): grid of `ToolCard`s; filter chips (category/tags) + panel (pricing/platform/language). State synced to URL query.
- `app/t/[slug]/page.tsx` (ISR): detail content; also opened as modal from grid.
- `app/go/[slug]/route.ts` (Edge): click logging + redirect.
- `app/admin/import/page.tsx` (optional): CSV import flow (upload → map columns → preview → commit) gated by access key.

**Components**
- `ToolCard`: 16:9 thumbnail, title, 2‑line description, tag chips, pricing badge, Open ↗.
- `ToolDetail`: description, pricing, tags, last_updated, primary **Visit** CTA, **Copy Link** secondary.
- `Filters`: chip row + panel; debounced client side with server fallbacks.

**Accessibility**
- Visible focus styles, proper roles/labels, `aria-live` for results, ESC to close modals, focus trap.

---
