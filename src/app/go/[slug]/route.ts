import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const url = new URL(request.url)
  const ref = request.headers.get('referer') ?? undefined
  const params = await context.params
  
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/log-click`, {
    method: 'POST', 
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slug: params.slug, referrer: ref })
  }).catch(() => null)
  
  return NextResponse.redirect(`${url.origin}/`, 302)
}