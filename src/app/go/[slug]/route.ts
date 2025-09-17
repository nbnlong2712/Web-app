import { NextResponse } from 'next/server';
import { getToolBySlug } from '@/lib/db/queries';
import { supabase } from '@/lib/db/client';
import type { Database } from '@/lib/db/types';

// Set the runtime to 'edge'
export const runtime = 'edge';

// Simple list of bad user agents to filter
const BAD_USER_AGENTS = [
  'bot',
  'crawler',
  'spider',
  'scraper',
  'curl',
  'wget',
  'python-requests',
  'axios',
];

// Simple in-memory rate limiting (in production, you'd use a proper rate-limiting service)
const rateLimitStore = new Map<string, number>();

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // Anti-bot: Ignore HEAD requests
  if (request.method === 'HEAD') {
    return new NextResponse(null, { status: 405 });
  }

  // Anti-bot: Filter common bad user-agents
  const userAgent = request.headers.get('user-agent') || '';
  const isBadAgent = BAD_USER_AGENTS.some((agent) => 
    userAgent.toLowerCase().includes(agent.toLowerCase())
  );
  
  if (isBadAgent) {
    return new NextResponse(null, { status: 403 });
  }

  // Get client IP
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  // Anti-bot: Light IP rate-limiting (5 requests per minute)
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window
  const requestTimes = rateLimitStore.get(ip) || 0;
  
  if (requestTimes > windowStart) {
    // If the last request was within the window, check count
    // Note: This is a simplified rate limit implementation
    // In production, you'd use a proper rate-limiting service
    return new NextResponse(null, { status: 429 });
  }
  
  // Update rate limit store
  rateLimitStore.set(ip, now);

  // Clean up old entries periodically
  if (rateLimitStore.size > 1000) {
    for (const [key, time] of rateLimitStore.entries()) {
      if (time < windowStart) {
        rateLimitStore.delete(key);
      }
    }
  }

  // Validate slug parameter
  if (!params.slug) {
    return new NextResponse('Missing slug parameter', { status: 400 });
  }

  try {
    // Look up tool by slug
    const tool = await getToolBySlug(params.slug);
    
    if (!tool) {
      return new NextResponse('Tool not found', { status: 404 });
    }

    // Extract UTM parameters from the request
    const url = new URL(request.url);
    const utm_source = url.searchParams.get('utm_source') || 'ailib';
    const utm_medium = url.searchParams.get('utm_medium') || 'referral';
    const utm_campaign = url.searchParams.get('utm_campaign') || 'default';
    
    // Get referrer
    const referrer = request.headers.get('referer') || null;

    // Insert click data into the clicks table
    const { error: insertError } = await supabase
      .from('clicks')
      .insert({
        tool_id: tool.id,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        ip,
      });

    if (insertError) {
      console.error('Error inserting click data:', insertError);
      // We don't return an error to the user because we still want to redirect
    }

    // Determine redirect URL (affiliate URL or homepage URL)
    const redirectUrl = tool.affiliate_url || tool.homepage_url || '/';
    
    // Append default UTM parameters if they're not already present
    const redirectUrlObj = new URL(redirectUrl);
    
    if (!redirectUrlObj.searchParams.get('utm_source')) {
      redirectUrlObj.searchParams.set('utm_source', utm_source);
    }
    
    if (!redirectUrlObj.searchParams.get('utm_medium')) {
      redirectUrlObj.searchParams.set('utm_medium', utm_medium);
    }
    
    if (!redirectUrlObj.searchParams.get('utm_campaign')) {
      redirectUrlObj.searchParams.set('utm_campaign', utm_campaign);
    }

    // Redirect to the affiliate URL with HTTP 302
    return NextResponse.redirect(redirectUrlObj.toString(), 302);
  } catch (error) {
    console.error('Error in /go/[slug] route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}