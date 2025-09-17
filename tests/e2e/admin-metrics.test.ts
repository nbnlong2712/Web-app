// tests/e2e/admin-metrics.test.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Metrics Page', () => {
  test('should display CTR metrics', async ({ page }) => {
    // Navigate to the admin metrics page
    await page.goto('/admin/metrics');
    
    // Check for 7-day CTR card
    const ctr7DayCard = page.locator('text=7-day CTR');
    await expect(ctr7DayCard).toBeVisible();
    
    // Check for 30-day CTR card
    const ctr30DayCard = page.locator('text=30-day CTR');
    await expect(ctr30DayCard).toBeVisible();
    
    // Check that CTR values are displayed (they should be percentages)
    const ctr7DayValue = await page.locator('text=7-day CTR').locator('..').locator('.text-3xl').textContent();
    const ctr30DayValue = await page.locator('text=30-day CTR').locator('..').locator('.text-3xl').textContent();
    
    // Verify that the values are percentages (contain % symbol)
    expect(ctr7DayValue).toMatch(/\d+\.\d+%/);
    expect(ctr30DayValue).toMatch(/\d+\.\d+%/);
  });

  test('should display daily clicks chart', async ({ page }) => {
    // Navigate to the admin metrics page
    await page.goto('/admin/metrics');
    
    // Check for daily clicks chart
    const dailyClicksChart = page.locator('text=Daily Clicks').locator('..').locator('canvas');
    await expect(dailyClicksChart).toBeVisible();
    
    // Check that the chart has data points
    // Since we're using Recharts, we can't easily check the canvas content
    // But we can check that the chart container exists
    const chartContainer = page.locator('text=Daily Clicks').locator('..').locator('.h-80');
    await expect(chartContainer).toBeVisible();
  });

  test('should display top tools', async ({ page }) => {
    // Navigate to the admin metrics page
    await page.goto('/admin/metrics');
    
    // Check for top tools card
    const topToolsCard = page.locator('text=Top Tools');
    await expect(topToolsCard).toBeVisible();
    
    // Check that at least one tool is listed
    const toolItems = await page.locator('text=Top Tools').locator('..').locator('.flex.items-center.justify-between').all();
    expect(toolItems.length).toBeGreaterThan(0);
    
    // Check that the tools have names and click counts
    for (const item of toolItems) {
      const toolName = await item.locator('.font-medium').textContent();
      const clickCount = await item.locator('.text-muted-foreground:last-child').textContent();
      
      expect(toolName).toBeTruthy();
      expect(clickCount).toMatch(/\d+/); // Should be a number
    }
  });

  test('should display top tags', async ({ page }) => {
    // Navigate to the admin metrics page
    await page.goto('/admin/metrics');
    
    // Check for top tags card
    const topTagsCard = page.locator('text=Top Tags');
    await expect(topTagsCard).toBeVisible();
    
    // Check that at least one tag is listed
    const tagItems = await page.locator('text=Top Tags').locator('..').locator('.flex.items-center.justify-between').all();
    expect(tagItems.length).toBeGreaterThan(0);
    
    // Check that the tags have names and counts
    for (const item of tagItems) {
      const tagName = await item.locator('.font-medium').textContent();
      const tagCount = await item.locator('.text-muted-foreground:last-child').textContent();
      
      expect(tagName).toBeTruthy();
      expect(tagCount).toMatch(/\d+/); // Should be a number
    }
  });

  test('should have refresh button', async ({ page }) => {
    // Navigate to the admin metrics page
    await page.goto('/admin/metrics');
    
    // Check for refresh button
    const refreshButton = page.locator('button:has-text("Refresh Data")');
    await expect(refreshButton).toBeVisible();
    
    // Click the refresh button
    await refreshButton.click();
    
    // Verify that the page reloads data (we can't easily test this without a real backend)
    // But we can check that the button still exists after clicking
    await expect(refreshButton).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Navigate to the admin metrics page
    await page.goto('/admin/metrics');
    
    // Check that loading spinner is not visible after page loads
    const loadingSpinner = page.locator('.animate-spin');
    await expect(loadingSpinner).not.toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock the API to return an error
    await page.route('/api/metrics?days=30', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Navigate to the admin metrics page
    await page.goto('/admin/metrics');
    
    // Check that error message is displayed
    const errorMessage = page.locator('text=Error');
    await expect(errorMessage).toBeVisible();
  });
});