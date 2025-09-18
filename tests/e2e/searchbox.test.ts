import { test, expect } from '@playwright/test'

test.describe('SearchBox Component', () => {
  test('should have the correct height and styling', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/')
    
    // Check that we are redirected to the library page
    await expect(page).toHaveURL(/\/library/)
    
    // Find the search box
    const searchBox = page.locator('[aria-label="Search for AI tools"]').first();
    await expect(searchBox).toBeVisible();
    
    // Check the height of the search box container
    const searchBoxContainer = searchBox.locator('xpath=..'); // Get the parent div
    const containerBoundingBox = await searchBoxContainer.boundingBox();
    expect(containerBoundingBox?.height).toBeCloseTo(160, -1); // Allow for some rounding
    
    // Check glass styling
    const containerStyles = await searchBoxContainer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        backdropFilter: style.backdropFilter,
        border: style.border,
        boxShadow: style.boxShadow,
      };
    });
    
    // These checks are approximate due to browser rendering differences
    expect(containerStyles.backdropFilter).toContain('blur');
    expect(containerStyles.border).toContain('1px solid');
  })
})