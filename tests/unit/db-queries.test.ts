import { describe, it, expect, vi } from 'vitest'
import { searchTools } from '../../src/lib/db/queries'

// Mock the Supabase client
vi.mock('../../src/lib/db/client', () => {
  return {
    supabase: {
      rpc: vi.fn(),
      from: vi.fn(),
    }
  }
})

// Import the mocked supabase after the mock is defined
import { supabase } from '../../src/lib/db/client'

describe('Database Queries', () => {
  it('should call RPC with correct parameters', async () => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Mock the RPC call to return empty data
    const mockRpc = supabase.rpc as unknown as ReturnType<typeof vi.fn>
    mockRpc.mockResolvedValue({ data: [], error: null })
    
    await searchTools({
      q: 'test query',
      primary_tag: 'writing',
      pricing: 'free',
      platform: 'web',
      language: 'en',
      no_signup: true,
      tags: ['writing', 'text'],
      limit: 15,
    })
    
    expect(mockRpc).toHaveBeenCalledWith('search_tools', {
      q: 'test query',
      primary_tag: 'writing',
      pricing: 'free',
      platform: 'web',
      language: 'en',
      no_signup: true,
      tags: ['writing', 'text'],
      limit: 15,
    })
  })

  it('should handle RPC errors', async () => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Mock the RPC call to throw an error
    const mockRpc = supabase.rpc as unknown as ReturnType<typeof vi.fn>
    mockRpc.mockRejectedValue(new Error('RPC not available'))
    
    // We expect the function to throw an error
    await expect(searchTools({ q: 'error' })).rejects.toThrow()
  })
})