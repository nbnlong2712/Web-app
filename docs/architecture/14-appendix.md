# 14) Appendix
## 14.1 Example Edge Route (`/app/go/[slug]/route.ts`)
```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function GET(req: NextRequest, { params }: { params: { slug: string }}) {
  const url = new URL(req.url)
  const ref = req.headers.get('referer') || undefined
  const { slug } = params

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
  const { data: tool } = await supabase.from('tools').select('id, affiliate_url').eq('slug', slug).single()
  if (!tool?.affiliate_url) return NextResponse.redirect(new URL('/', url.origin))

  const u = new URL(tool.affiliate_url)
  if (!u.searchParams.get('utm_source')) u.searchParams.set('utm_source', 'ailib')
  if (!u.searchParams.get('utm_medium')) u.searchParams.set('utm_medium', 'referral')
  if (!u.searchParams.get('utm_campaign')) u.searchParams.set('utm_campaign', 'default')

  // Fire‑and‑forget logging; in practice use service role at server or RPC
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/log-click`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ tool_id: tool.id, referrer: ref })
  }).catch(() => {})

  return NextResponse.redirect(u.toString(), 302)
}
```

## 14.2 Minimal CSV Columns
`name, slug, description, homepage_url, affiliate_url, primary_tag, tags, pricing, platform, language, no_signup, last_updated`.

## 14.3 Performance Budgets
- Home SSR TTFB ≤ 500ms (P50)
- DB query ≤ 80ms on 1k–5k rows
- Lighthouse Perf ≥ 85; A11y ≥ 90

## 14.4 Future Enhancements
- Normalize tags into `tags`, `tool_tags` join; Tag admin UI.
- Embeddings + reranker; Meilisearch/pgvector for semantic suggestions.
- User accounts + bookmarks/collections.
- Light crawler for `last_updated` and dead‑link checks.

