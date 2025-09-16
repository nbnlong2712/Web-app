# 4) Search & Intent Mapping
**Non-LLM parser** converts natural language to filters; SSR query combines filters + FTS/trigram similarity and returns ≤ 24 results sorted by specificity and similarity.

**Parser (TypeScript, pseudocode)**
```ts
export function parseIntent(input: string) {
  const text = normalize(input); // lowercase, strip punctuation, remove diacritics (VI)
  const out: any = { tags: [] };
  if (/(mien phi|free|0d|0đ)/.test(text)) out.pricing = 'free';
  else if (/freemium/.test(text)) out.pricing = 'freemium';
  else if (/(tra phi|paid|\$|usd|vnd|đ)/.test(text)) out.pricing = 'paid';
  if (/(khong can dang ky|no signup|khong can account)/.test(text)) out.no_signup = true;
  if (/\bapi\b/.test(text)) out.platform = 'api';
  if (/(web|trinh duyet)/.test(text)) out.platform = 'web';
  if (/(desktop|windows|macos|mac)/.test(text)) out.platform = 'desktop';
  if (/(tieng viet|vietnamese|\bvi\b)/.test(text)) out.language = ['vi'];
  if (/(english|\ben\b)/.test(text)) out.language = [...(out.language||[]), 'en'];
  // primary_tag & tag synonyms resolved from a static dictionary
  for (const [tag, syns] of Object.entries(SYN)) {
    if (syns.some(s => text.includes(s))) { out.primary_tag = tag; break; }
  }
  for (const [t, syns] of Object.entries(FLAT_TAGS)) {
    if (syns.some(s => text.includes(s))) out.tags.push(t);
  }
  return out;
}
```

**SQL (parameterized example)**
```sql
select * from tools
where (
  (coalesce(:primary_tag,'') = '' or primary_tag = :primary_tag)
  and (:pricing is null or pricing = :pricing)
  and (:no_signup is null or no_signup = :no_signup)
  and (:platform is null or platform = :platform)
  and (:language is null or :language = any(language))
)
and (
  to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,'')) @@ plainto_tsquery('simple', :q)
  or (:q = '' and true)
  or (:tags_cnt > 0 and tags && :tags)
)
order by (case when primary_tag = :primary_tag then 0 else 1 end),
         similarity(name, :q) desc
limit 24;
```

**Test Cases**
Provide 20 representative phrases (EN/VI) and expected filters to unit test the parser.

---
