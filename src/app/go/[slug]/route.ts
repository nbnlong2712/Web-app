// app/go/[slug]/route.ts
import { NextResponse } from 'next/server';
import { getToolBySlug } from '@/lib/db/queries';

// This is a server-side redirect handler for tracking clicks
// In a production environment, you would add click tracking here
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const tool = await getToolBySlug(params.slug);
  
  if (!tool) {
    return NextResponse.redirect(new URL('/404', request.url));
  }
  
  // In a real implementation, you would:
  // 1. Record the click in your database
  // 2. Extract UTM parameters from the request
  // 3. Store referrer information
  // 4. Then redirect to the affiliate URL
  
  // For this implementation, we'll redirect to the homepage
  // In a real app, you would redirect to tool.affiliate_url or tool.homepage_url
  return NextResponse.redirect(new URL('/', request.url));
}