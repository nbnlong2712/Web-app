// app/api/metrics/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/client';

// Helper function to get date N days ago
function getDateNDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

// GET /api/metrics
export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const startDate = getDateNDaysAgo(days);

    // Fetch tools (needed for tool names)
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, slug, tags')
      .order('name');

    if (toolsError) {
      console.error('Error fetching tools:', toolsError);
      return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
    }

    // Create a map of tools for easy lookup
    const toolsMap = new Map(tools.map(tool => [tool.id, tool]));

    // Fetch clicks data for the specified period
    const { data: clicks, error: clicksError } = await supabase
      .from('clicks')
      .select('tool_id, clicked_at')
      .gte('clicked_at', startDate)
      .order('clicked_at');

    if (clicksError) {
      console.error('Error fetching clicks:', clicksError);
      return NextResponse.json({ error: 'Failed to fetch clicks' }, { status: 500 });
    }

    // Calculate overall CTR (clicks / total tools viewed)
    // For simplicity, we'll approximate this as total clicks / total tools
    const totalClicks = clicks.length;
    const totalTools = tools.length;
    const overallCTR = totalTools > 0 ? (totalClicks / totalTools) * 100 : 0;

    // Calculate 7-day and 30-day CTR
    const sevenDaysAgo = getDateNDaysAgo(7);
    
    const { count: clicks7Day, error: countError } = await supabase
      .from('clicks')
      .select('*', { count: 'exact', head: true })
      .gte('clicked_at', sevenDaysAgo);

    if (countError) {
      console.error('Error counting clicks:', countError);
      return NextResponse.json({ error: 'Failed to count clicks' }, { status: 500 });
    }

    const ctr7Day = totalTools > 0 ? ((clicks7Day || 0) / totalTools) * 100 : 0;
    const ctr30Day = overallCTR;

    // Get top tools by click count
    const toolClickCounts: Record<string, number> = {};
    
    clicks.forEach(click => {
      if (click.tool_id) {
        toolClickCounts[click.tool_id] = (toolClickCounts[click.tool_id] || 0) + 1;
      }
    });

    const topTools = Object.entries(toolClickCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([toolId, clicks]) => {
        const tool = toolsMap.get(toolId);
        return {
          id: toolId,
          name: tool?.name || 'Unknown Tool',
          slug: tool?.slug || 'unknown',
          clicks
        };
      });

    // Get top tags
    const tagCounts: Record<string, number> = {};
    
    tools.forEach(tool => {
      if (tool.tags) {
        tool.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + (toolClickCounts[tool.id] || 0);
        });
      }
    });

    const topTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({
        tag,
        count
      }));

    // Get daily clicks for the chart
    const dailyClicks: Record<string, number> = {};
    
    clicks.forEach(click => {
      if (click.clicked_at) {
        const date = click.clicked_at.split('T')[0]; // Get YYYY-MM-DD
        dailyClicks[date] = (dailyClicks[date] || 0) + 1;
      }
    });

    const dailyClicksArray = Object.entries(dailyClicks)
      .map(([date, clicks]) => ({
        date,
        clicks
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Return the metrics data
    return NextResponse.json({
      ctr: {
        '7-day': ctr7Day,
        '30-day': ctr30Day
      },
      topTools,
      topTags,
      dailyClicks: dailyClicksArray
    });
  } catch (error) {
    console.error('Error in metrics API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}