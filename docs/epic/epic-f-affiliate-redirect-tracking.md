# EPIC F – Affiliate Redirect & Tracking
**Goal:** Log click and redirect fast.
- **F-01 (S):** Edge Route Handler `/go/[slug]`.
  - **AC:** Insert row into `clicks` (tool_id, ts, referrer, utm_*) then 302.
- **F-02 (S):** Append `utm_source=ailib&utm_medium=referral&utm_campaign=default` if missing.
  - **AC:** Ensure UTM not duplicated.
- **F-03 (S):** Simple anti-bot: ignore HEAD, filter common user-agents, light IP rate-limit.
