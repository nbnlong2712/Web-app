import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as nextNavigation from 'next/navigation'
import React from 'react'
import NotFound from '@/app/not-found'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('NotFound Page', () => {
  it('should render the 404 page with correct content', () => {
    // Mock router
    const mockPush = vi.fn()
    vi.mocked(nextNavigation.useRouter).mockReturnValue({
      push: mockPush,
    } as any)

    // Render the component
    const { unmount } = render(<NotFound />)

    // Check that the title and description are rendered
    expect(screen.getByText('404 - Page Not Found')).toBeTruthy()
    expect(screen.getByText('Sorry, the page you are looking for does not exist.')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Go to Library' })).toBeTruthy()
    
    // Clean up
    unmount();
  })

  it('should navigate to library page when "Go to Library" button is clicked', () => {
    // Mock router
    const mockPush = vi.fn()
    vi.mocked(nextNavigation.useRouter).mockReturnValue({
      push: mockPush,
    } as any)

    // Render the component
    const { unmount } = render(<NotFound />)

    // Click the "Go to Library" button
    fireEvent.click(screen.getByRole('button', { name: 'Go to Library' }))

    // Check that router.push was called with '/library'
    expect(mockPush).toHaveBeenCalledWith('/library')
    
    // Clean up
    unmount();
  })
})