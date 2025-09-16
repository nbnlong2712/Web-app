# 6) Search & Intent Mapping (MVP)
- **Client:** extract simple **keywords**: task (“text to video”), constraints (“free”, “no signup”).
- **Server action:** normalize into filters `{primary_tag, tags[], pricing, no_signup}` and run FTS + filter query.
- **LLM rewriter (optional):** normalize natural language into defined tags; fallback to non-LLM if disabled.
