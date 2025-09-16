# 8) Security, Privacy & Compliance
- **Admin access:** Supabase Auth (magic link) or env-gated access key for `/admin/import`.
- **RLS:** Enforced for runtime reads/writes as specified.
- **PII:** Avoid storing user PII in `clicks`; keep IP optional and masked where feasible.
- **Rate limiting:** Simple IP‑based throttle at edge for `/go`.

---
