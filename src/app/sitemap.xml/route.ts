import { getAllTools } from '@/lib/db/queries';
import { Tool } from '@/lib/db/types';

export async function GET() {
  try {
    // Get all tools
    const tools = await getAllTools();
    
    // Generate sitemap XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.com/library</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${tools.map((tool: Tool) => `
  <url>
    <loc>https://your-domain.com/t/${tool.slug}</loc>
    <lastmod>${tool.last_updated ? new Date(tool.last_updated).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
</urlset>`;
    
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}