import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const { slug, referrer, utm_source, utm_medium, utm_campaign } = await request.json()
  const sb = createSupabaseServer()
  const { data: tool } = await sb.from('tools').select('id, affiliate_url').eq('slug', slug).single()
  
  if (!tool) return NextResponse.json({ ok: false }, { status: 404 })
  
  await sb.from('clicks').insert({ 
    tool_id: tool.id, 
    referrer, 
    utm_source, 
    utm_medium, 
    utm_campaign 
  })
  
  return NextResponse.json({ ok: true, redirect: tool.affiliate_url })
}