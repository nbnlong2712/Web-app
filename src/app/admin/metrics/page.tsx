// app/admin/metrics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  // BarChart, 
  // Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// Types for our metrics data
interface ClickThroughRate {
  period: string;
  ctr: number;
}

interface TopTool {
  id: string;
  name: string;
  slug: string;
  clicks: number;
}

interface TopTag {
  tag: string;
  count: number;
}

interface DailyClicks {
  date: string;
  clicks: number;
}

export default function MetricsPage() {
  const [ctrData, setCtrData] = useState<ClickThroughRate[]>([]);
  const [topTools, setTopTools] = useState<TopTool[]>([]);
  const [topTags, setTopTags] = useState<TopTag[]>([]);
  const [dailyClicks, setDailyClicks] = useState<DailyClicks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch metrics data
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/metrics?days=30');
        
        if (!response.ok) {
          throw new Error('Failed to fetch metrics data');
        }
        
        const data = await response.json();
        
        // Transform the data for our UI
        const ctrDataTransformed: ClickThroughRate[] = [
          { period: '7-day', ctr: data.ctr['7-day'] },
          { period: '30-day', ctr: data.ctr['30-day'] }
        ];
        
        setCtrData(ctrDataTransformed);
        setTopTools(data.topTools);
        setTopTags(data.topTags);
        setDailyClicks(data.dailyClicks);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Format CTR as percentage
  const formatCTR = (ctr: number) => {
    return `${ctr.toFixed(1)}%`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Metrics</h1>
        <p className="text-muted-foreground">
          Track and analyze tool performance and user engagement
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
          <h3 className="font-semibold text-destructive">Error</h3>
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* CTR Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ctrData.map((item) => (
              <Card key={item.period}>
                <CardHeader>
                  <CardTitle>{item.period} CTR</CardTitle>
                  <CardDescription>Click-through rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCTR(item.ctr)}</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {item.period === '7-day' 
                      ? 'Based on last 7 days of data' 
                      : 'Based on last 30 days of data'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Clicks Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Daily Clicks</CardTitle>
                <CardDescription>Click volume over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyClicks}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Clicks"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Top Tools</CardTitle>
                <CardDescription>Most clicked tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topTools.map((tool, index) => (
                    <div key={tool.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-muted-foreground w-5">#{index + 1}</span>
                        <span className="font-medium">{tool.name}</span>
                      </div>
                      <span className="text-muted-foreground">{tool.clicks}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Top Tags</CardTitle>
                <CardDescription>Most popular categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topTags.map((tag, index) => (
                    <div key={tag.tag} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-muted-foreground w-5">#{index + 1}</span>
                        <span className="font-medium">{tag.tag}</span>
                      </div>
                      <span className="text-muted-foreground">{tag.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-end">
            <Button 
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
              }}
            >
              Refresh Data
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}