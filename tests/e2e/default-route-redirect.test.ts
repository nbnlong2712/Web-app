import { test, expect } from '@playwright/test'

test.describe('Default Route Redirect', () => {
  test('should redirect from root route to library page', async ({ page }) => {
    // Navigate to the root route
    const response = await page.goto('/')
    
    // Check that the response is a redirect
    expect(response?.status()).toBe(307) // 307 is the status code for redirect in Playwright
    
    // Check that we are redirected to the library page
    await page.waitForURL(/\/library/)
    expect(page.url()).toContain('/library')
  })
})