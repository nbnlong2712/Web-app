import { test, expect } from '@playwright/test';

test.describe('SEO Metadata Generation', () => {
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