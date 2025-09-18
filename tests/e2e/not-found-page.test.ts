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
    await expect(page.getByRole('button', { name: 'Go Home' })).toBeVisible()
  })

  test('should navigate to home page when "Go Home" button is clicked', async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto('/non-existent-page')
    
    // Click the "Go Home" button
    await page.getByRole('button', { name: 'Go Home' }).click()
    
    // Check that we are on the home page
    await expect(page).toHaveURL('/')
    await expect(page.getByText('AI Tools Library')).toBeVisible()
  })
})