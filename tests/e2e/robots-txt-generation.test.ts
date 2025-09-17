import { test, expect } from '@playwright/test';

test.describe('Robots.txt Generation', () => {
  test('should generate valid robots.txt', async ({ page }) => {
    // Navigate to robots.txt
    const response = await page.goto('/robots.txt');
    
    // Check response status
    expect(response?.status()).toBe(200);
    
    // Check content type
    const contentType = await response?.headerValue('content-type');
    expect(contentType).toMatch(/text\/plain/);
    
    // Get the robots.txt content
    const content = await page.content();
    
    // Check that robots.txt contains expected content
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('Disallow: /admin/');
    expect(content).toContain('Disallow: /api/log-click');
    expect(content).toContain('Sitemap: https://your-domain.com/sitemap.xml');
  });
});