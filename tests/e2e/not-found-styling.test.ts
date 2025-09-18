import { test, expect } from '@playwright/test'

test.describe('404 Page Styling', () => {
  test('should have the correct background and glass styling', async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto('/non-existent-page')
    
    // Check that the 404 page is displayed
    await expect(page.getByText('404 - Page Not Found')).toBeVisible()
    
    // Check background color (approximate)
    const bodyBackgroundColor = await page.evaluate(() => {
      const body = document.querySelector('body');
      return body ? getComputedStyle(body).backgroundColor : '';
    });
    expect(bodyBackgroundColor).toContain('rgb(15, 12, 41)'); // Approximate color from gradient
    
    // Check glass container styling
    const glassContainer = page.locator('.glass').first();
    await expect(glassContainer).toBeVisible();
    
    // Check glass effect properties (approximate)
    const glassStyles = await glassContainer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        border: style.border,
        boxShadow: style.boxShadow,
        backdropFilter: style.backdropFilter,
      };
    });
    
    // These checks are approximate due to browser rendering differences
    expect(glassStyles.backdropFilter).toContain('blur');
    expect(glassStyles.border).toContain('1px solid');
  })
})