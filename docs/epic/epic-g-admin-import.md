# EPIC G – Admin Import
**Goal:** Quick CSV upsert.
- **G-01 (M):** `/admin/import` (CSV form + server action).
  - **AC:** Show created/updated counts; row-level error reporting.
- **G-02 (S):** Generate `slug` if missing; normalize `tags` from `;`.
- **G-03 (S):** Protect via env access key or simple Basic Auth.
