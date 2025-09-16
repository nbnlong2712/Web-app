# EPIC C – Library Grid & Filters
**Goal:** Browse all tools, filter quickly.
- **C-01 (M):** `/library` (ISR 10m) renders 3–4 column grid.
  - **AC:** Responsive; skeleton on ISR fallback.
- **C-02 (S):** `ToolCard` (glass, 16:9, title, desc clamp-2, chips, pricing badge).
  - **AC:** Keyboard-focusable; “Open” tooltip.
- **C-03 (M):** Filters: Category/Tags chips + Pricing/Platform/Language panel.
  - **AC:** Toggles without full reload; syncs with URL query.
- **C-04 (S):** Empty state + Reset filters.
