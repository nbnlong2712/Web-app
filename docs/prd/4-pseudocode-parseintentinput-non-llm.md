# 4) Pseudocode `parseIntent(input)` (non-LLM)
```ts
function parseIntent(input: string) {
  const text = normalize(input); // lowercase + strip + remove diacritics (vi)
  const out: any = { tags: [] };
  if (/(mien phi|free|0d|0đ)/.test(text)) out.pricing = 'free';
  else if (/freemium/.test(text)) out.pricing = 'freemium';
  else if (/(tra phi|paid|\$|usd|vnd|đ)/.test(text)) out.pricing = 'paid';
  if (/(khong can dang ky|no signup|khong can account)/.test(text)) out.no_signup = true;
  if (/api/.test(text)) out.platform = 'api';
  if (/(web|trinh duyet)/.test(text)) out.platform = 'web';
  if (/(desktop|windows|macos|mac)/.test(text)) out.platform = 'desktop';
  if (/(tieng viet|vietnamese|vi)/.test(text)) out.language = ['vi'];
  if (/(english|en)/.test(text)) out.language = [...(out.language||[]), 'en'];
  for (const [tag, syns] of Object.entries(SYN)) {
    if (syns.some(s => text.includes(s))) { out.primary_tag = tag; break; }
  }
  for (const [t, syns] of Object.entries(FLAT_TAGS)) {
    if (syns.some(s => text.includes(s))) out.tags.push(t);
  }
  return out;
}
```
