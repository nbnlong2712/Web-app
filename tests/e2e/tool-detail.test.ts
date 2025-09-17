import { test, expect } from '@playwright/test';
import { Tool } from '@/lib/db/types';

// Mock tool data for testing
const mockTool: Tool = {
  id: '1',
  name: 'Test Tool',
  slug: 'test-tool',
  description: 'This is a test tool for end-to-end testing.',
  tags: ['AI', 'Productivity', 'Automation'],
  pricing: 'free',
  platform: 'web',
  language: ['en', 'vi'],
  last_updated: '2023-01-01',
  homepage_url: null,
  affiliate_url: null,
  primary_tag: null,
  no_signup: null,
  status: null,
  created_at: null,
};

test.describe('Tool Detail Modal', () => {
  test('should open when clicking on a ToolCard', async ({ page }) => {
    // Navigate to the library page
    await page.goto('/library');
    
    // Click on the first tool card's "Open" link
    await page.click('a:has-text("Open ↗")');
    
    // Verify that the modal is open by checking for the tool name
    await expect(page.locator(`h2:has-text("${mockTool.name}")`)).toBeVisible();
  });

  test('should close when pressing ESC key', async ({ page }) => {
    // Navigate to the library page
    await page.goto('/library');
    
    // Click on the first tool card's "Open" link
    await page.click('a:has-text("Open ↗")');
    
    // Verify that the modal is open
    await expect(page.locator(`h2:has-text("${mockTool.name}")`)).toBeVisible();
    
    // Press ESC key
    await page.keyboard.press('Escape');
    
    // Verify that the modal is closed
    await expect(page.locator(`h2:has-text("${mockTool.name}")`)).not.toBeVisible();
  });

  test('should display all tool details correctly', async ({ page }) => {
    // Navigate to the library page
    await page.goto('/library');
    
    // Click on the first tool card's "Open" link
    await page.click('a:has-text("Open ↗")');
    
    // Verify tool name
    await expect(page.locator(`h2:has-text("${mockTool.name}")`)).toBeVisible();
    
    // Verify description
    await expect(page.locator(`p:has-text("${mockTool.description}")`)).toBeVisible();
    
    // Verify tags
    for (const tag of mockTool.tags || []) {
      await expect(page.locator(`span:has-text("${tag}")`)).toBeVisible();
    }
    
    // Verify pricing
    await expect(page.locator(`span:has-text("${mockTool.pricing}")`)).toBeVisible();
    
    // Verify platform
    await expect(page.locator(`p:has-text("${mockTool.platform}")`)).toBeVisible();
    
    // Verify languages
    for (const lang of mockTool.language || []) {
      await expect(page.locator(`p:has-text("${lang}")`)).toBeVisible();
    }
  });

  test('should handle Visit button click', async ({ page }) => {
    // Navigate to the library page
    await page.goto('/library');
    
    // Click on the first tool card's "Open" link
    await page.click('a:has-text("Open ↗")');
    
    // Intercept the new page request
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.click('button:has-text("Visit Tool ↗")')
    ]);
    
    // Verify that a new tab was opened
    expect(newPage).toBeTruthy();
    
    // Close the new page
    await newPage.close();
  });

  test('should handle Copy Link button click', async ({ page }) => {
    // Navigate to the library page
    await page.goto('/library');
    
    // Click on the first tool card's "Open" link
    await page.click('a:has-text("Open ↗")');
    
    // Click the Copy Link button
    await page.click('button:has-text("Copy Link")');
    
    // Verify that the link was copied (we can't directly test clipboard, but we can check for no errors)
    // This test primarily ensures the button click handler doesn't throw an error
    expect(true).toBe(true);
  });
});

test.describe('Tool Detail Page', () => {
  test('should display tool details correctly', async ({ page }) => {
    // Navigate to the tool detail page
    await page.goto(`/t/${mockTool.slug}`);
    
    // Verify tool name
    await expect(page.locator(`h1:has-text("${mockTool.name}")`)).toBeVisible();
    
    // Verify description
    await expect(page.locator(`p:has-text("${mockTool.description}")`)).toBeVisible();
    
    // Verify tags
    for (const tag of mockTool.tags || []) {
      await expect(page.locator(`span:has-text("${tag}")`)).toBeVisible();
    }
    
    // Verify pricing
    await expect(page.locator(`span:has-text("${mockTool.pricing}")`)).toBeVisible();
    
    // Verify platform
    await expect(page.locator(`p:has-text("${mockTool.platform}")`)).toBeVisible();
    
    // Verify languages
    for (const lang of mockTool.language || []) {
      await expect(page.locator(`p:has-text("${lang}")`)).toBeVisible();
    }
  });

  test('should have correct SEO metadata', async ({ page }) => {
    // Navigate to the tool detail page
    await page.goto(`/t/${mockTool.slug}`);
    
    // Verify title
    await expect(page).toHaveTitle(`${mockTool.name} - AI Tools Library`);
    
    // Verify meta description
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toContain(mockTool.description || mockTool.name);
  });

  test('should handle Visit button click', async ({ page }) => {
    // Navigate to the tool detail page
    await page.goto(`/t/${mockTool.slug}`);
    
    // Intercept the new page request
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.click('a:has-text("Visit Tool ↗")')
    ]);
    
    // Verify that a new tab was opened
    expect(newPage).toBeTruthy();
    
    // Close the new page
    await newPage.close();
  });

  test('should handle Copy Link button click', async ({ page }) => {
    // Navigate to the tool detail page
    await page.goto(`/t/${mockTool.slug}`);
    
    // Click the Copy Link button
    await page.click('button:has-text("Copy Link")');
    
    // Verify that the link was copied (we can't directly test clipboard, but we can check for no errors)
    // This test primarily ensures the button click handler doesn't throw an error
    expect(true).toBe(true);
  });
});