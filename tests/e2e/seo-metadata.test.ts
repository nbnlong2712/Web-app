import { test, expect } from '@playwright/test';

test.describe('SEO Metadata and Sitemap', () => {
  test('should generate correct metadata for tool detail pages', async ({ page }) => {
    // Navigate to a tool detail page
    await page.goto('/t/test-tool');
    
    // Check title
    await expect(page).toHaveTitle(/Test Tool - AI Tools Library/);
    
    // Check meta description
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toBeTruthy();
    
    // Check canonical URL
    const canonicalUrl = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonicalUrl).toMatch(/https:\/\/your-domain\.com\/t\/test-tool/);
    
    // Check OpenGraph tags
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).toMatch(/Test Tool - AI Tools Library/);
    
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    expect(ogDescription).toBeTruthy();
    
    const ogType = await page.getAttribute('meta[property="og:type"]', 'content');
    expect(ogType).toBe('website');
    
    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    expect(ogUrl).toMatch(/https:\/\/your-domain\.com\/t\/test-tool/);
    
    // Check Twitter tags
    const twitterCard = await page.getAttribute('meta[name="twitter:card"]', 'content');
    expect(twitterCard).toBe('summary_large_image');
    
    const twitterTitle = await page.getAttribute('meta[name="twitter:title"]', 'content');
    expect(twitterTitle).toMatch(/Test Tool - AI Tools Library/);
    
    const twitterDescription = await page.getAttribute('meta[name="twitter:description"]', 'content');
    expect(twitterDescription).toBeTruthy();
  });

  test('should generate sitemap.xml', async ({ page }) => {
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
  });

  test('should generate robots.txt', async ({ page }) => {
    // Navigate to robots.txt
    const response = await page.goto('/robots.txt');
    
    // Check response status
    expect(response?.status()).toBe(200);
    
    // Check content type
    const contentType = await response?.headerValue('content-type');
    expect(contentType).toMatch(/text\/plain/);
    
    // Check that robots.txt contains expected content
    const content = await page.content();
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('Disallow: /admin/');
    expect(content).toContain('Sitemap: https://your-domain.com/sitemap.xml');
  });

  test('should include breadcrumb JSON-LD on tool detail pages', async ({ page }) => {
    // Navigate to a tool detail page
    await page.goto('/t/test-tool');
    
    // Check for JSON-LD script tag
    const jsonLdScript = await page.$('script[type="application/ld+json"]');
    expect(jsonLdScript).toBeTruthy();
    
    // Get the JSON-LD content
    const jsonLdContent = await jsonLdScript?.textContent();
    expect(jsonLdContent).toBeTruthy();
    
    // Parse and verify the JSON structure
    if (jsonLdContent) {
      const jsonLd = JSON.parse(jsonLdContent);
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('BreadcrumbList');
      expect(jsonLd.itemListElement).toHaveLength(3);
      
      // Check breadcrumb items
      expect(jsonLd.itemListElement[0].name).toBe('Home');
      expect(jsonLd.itemListElement[1].name).toBe('Library');
      expect(jsonLd.itemListElement[2].name).toBe('Test Tool');
    }
  });
});