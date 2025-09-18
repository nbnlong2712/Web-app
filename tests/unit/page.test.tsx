import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as nextNavigation from 'next/navigation'
import React from 'react'
import Home from '@/app/page'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Home Page', () => {
  it('should redirect to the library page', () => {
    // Mock redirect
    const mockRedirect = vi.fn()
    vi.mocked(nextNavigation.redirect).mockImplementation(mockRedirect)

    // Render the component
    render(<Home />)

    // Check that redirect was called with '/library'
    expect(mockRedirect).toHaveBeenCalledWith('/library')
  })
})