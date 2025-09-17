import { NextResponse } from 'next/server';
import { getToolBySlug } from '@/lib/db/queries';
import { supabase } from '@/lib/db/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Validate slug parameter
  if (!params || !(await params).slug) {
    return new NextResponse('Missing slug parameter', { status: 400 });
  }

  const { slug } = await params;

  try {
    // Look up tool by slug
    const tool = await getToolBySlug(slug);
    
    if (!tool) {
      return new NextResponse('Tool not found', { status: 404 });
    }

    // Track the visit click event
    const url = new URL(request.url);
    const referrer = request.headers.get('referer') || null;
    // const userAgent = request.headers.get('user-agent') || null; // Not used currently
    
    // Extract UTM parameters
    const utm_source = url.searchParams.get('utm_source') || null;
    const utm_medium = url.searchParams.get('utm_medium') || null;
    const utm_campaign = url.searchParams.get('utm_campaign') || null;
    
    // Get client IP (this might need to be adjusted based on your hosting environment)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;

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

    // Redirect to the affiliate URL or homepage URL
    const redirectUrl = tool.affiliate_url || tool.homepage_url || '/';
    
    // Redirect with HTTP 302
    return NextResponse.redirect(redirectUrl, 302);
  } catch (error) {
    console.error('Error in /go/[slug] route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}