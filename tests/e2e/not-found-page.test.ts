import { test, expect } from '@playwright/test'

test.describe('404 Page', () => {
  test('should display the 404 page for non-existent routes', async ({ page }) => {
    // Navigate to a non-existent page
    const response = await page.goto('/non-existent-page')
    
    // Check that the response status is 404
    expect(response?.status()).toBe(404)
    
    // Check that the 404 page content is displayed
    await expect(page.getByText('404 - Page Not Found')).toBeVisible()
    await expect(page.getByText('Sorry, the page you are looking for does not exist.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Go to Library' })).toBeVisible()
  })

  test('should navigate to library page when "Go to Library" link is clicked', async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto('/non-existent-page')
    
    // Click the "Go to Library" link
    await page.getByRole('link', { name: 'Go to Library' }).click()
    
    // Check that we are on the library page
    await expect(page).toHaveURL('/library')
    await expect(page.getByText('AI Tools Library')).toBeVisible()
  })
})