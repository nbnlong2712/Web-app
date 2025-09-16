# 2) Routing & Rendering Strategy (Next.js App Router)
- `/` **Home (SSR)**: Chat-style input → server action parses intent → SSR results below input.
- `/library` **ISR (5–15m)**: Global browse grid with filters; hydrates for client-side facet toggles without full reload.
- `/t/[slug]` **ISR (5–15m)**: Tool detail page; also openable as a modal from grid for smooth UX and deep-linking.
- `/go/[slug]` **Edge Route Handler**: Insert click log, append missing UTM parameters, HTTP 302 to affiliate URL.
- `/api/suggest` (optional): Chips suggestions/autocomplete based on cached taxonomy and top clicks.
- `/admin/import` (optional, protected): CSV upload → preview → upsert.

**Why this mix?**  
- SSR ensures query freshness and low TTFB for search.  
- ISR provides SEO and fast loads for browse & detail pages with easy cache revalidation after imports.

---
