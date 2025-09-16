# Front-End Specification (MVP) — AI Tools Library

> Tech target: **Next.js (App Router)** + **Tailwind + shadcn/ui + Framer Motion**, data via **Supabase**. Theme: **Neo-Glassmorphism**. KPIs: **≤2 actions to find tools**, **≥8% outbound CTR**.

---

## 1) Product Goals & Success Criteria (FE-owned slice)
- **G1 – Effective discovery:** User finds the right 1–3 tools in ≤2 interactions (chat input → results → detail/visit). FE must minimize friction and surface the **top results fast**.
- **G2 – Monetization:** Prominent **Visit** CTA, clear outbound path, and reliable click logging (+UTM) to reach **≥8% CTR**.
- **G3 – Content bootstrapping:** UI supports quick scanning (card grid, tags, filters) for an initial **100–200 tools** dataset.

---

## 2) Information Architecture & Routing
```
/                 → Home (Chat Search + SSR results below the input)
/library          → Library grid (ISR 5–15m)
/t/[slug]         → Tool detail page (ISR 5–15m); openable from modal
/go/[slug]        → Edge Route Handler: log click → 302 to affiliate
/admin/import     → (P1) CSV upload + preview + upsert (protected)
```
... (the full detailed spec continues here, as in prior response) ...
