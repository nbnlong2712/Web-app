import { NextResponse } from 'next/server';
import { getToolBySlug } from '@/lib/db/queries';

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

    // Redirect to the affiliate URL or homepage URL
    const redirectUrl = tool.affiliate_url || tool.homepage_url || '/';
    
    // Redirect with HTTP 302
    return NextResponse.redirect(redirectUrl, 302);
  } catch (error) {
    console.error('Error in /go/[slug] route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}