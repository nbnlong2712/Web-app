# 6) Edge & Server Logic
**/go/[slug] route (Edge)**
- Lookup tool by slug → insert row in `clicks` (`tool_id`, timestamp, `referrer`, any `utm_*`).
- Append default UTM if missing (`utm_source=ailib&utm_medium=referral&utm_campaign=default`).
- 302 to `affiliate_url`.
- Basic antibot: ignore `HEAD`, filter common bad user‑agents, light IP rate‑limit.

**Server Action: Search**
- Normalize incoming query → `parseIntent()` → construct SQL → fetch ≤ 24 results → render SSR.
- Log anonymized query (normalized query, result count) for funnel analysis.

---
