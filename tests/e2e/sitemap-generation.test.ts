import { test, expect } from '@playwright/test';

test.describe('Sitemap Generation', () => {
  test('should generate valid sitemap.xml', async ({ page }) => {
    // Navigate to sitemap.xml
    const response = await page.goto('/sitemap.xml');
    
    // Check response status
    expect(response?.status()).toBe(200);
    
    // Check content type
    const contentType = await response?.headerValue('content-type');
    expect(contentType).toMatch(/application\/xml/);
    
    // Check that sitemap contains expected elements
    const content = await page.content();
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    
    // Check that sitemap contains homepage and library
    expect(content).toContain('<loc>https://your-domain.com</loc>');
    expect(content).toContain('<loc>https://your-domain.com/library</loc>');
    
    // Check that sitemap contains at least one tool page
    expect(content).toMatch(/<loc>https:\/\/your-domain\.com\/t\/[^<]+<\/loc>/);
    
    // Check changefreq and priority for homepage
    expect(content).toContain('<changefreq>daily</changefreq>');
    expect(content).toContain('<priority>1.0</priority>');
    
    // Check changefreq and priority for library
    expect(content).toContain('<changefreq>daily</changefreq>');
    expect(content).toContain('<priority>0.9</priority>');
    
    // Check changefreq and priority for tool pages
    expect(content).toContain('<changefreq>weekly</changefreq>');
    expect(content).toContain('<priority>0.8</priority>');
  });
  
  test('should include all tool pages in sitemap', async ({ page }) => {
    // Navigate to sitemap.xml
    await page.goto('/sitemap.xml');
    
    // Get the sitemap content
    const content = await page.content();
    
    // Check that the sitemap includes multiple tool pages
    const toolUrls = content.match(/<loc>https:\/\/your-domain\.com\/t\/[^<]+<\/loc>/g);
    expect(toolUrls).toBeTruthy();
    expect(toolUrls?.length).toBeGreaterThan(0);
    
    // Check that each tool URL has the correct structure
    for (const url of toolUrls || []) {
      expect(url).toMatch(/<loc>https:\/\/your-domain\.com\/t\/[^<]+<\/loc>/);
    }
  });
});