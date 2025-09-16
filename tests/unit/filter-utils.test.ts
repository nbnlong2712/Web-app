import { describe, it, expect } from 'vitest'
import { filterTools, serializeFilters, deserializeFilters, hasActiveFilters } from '@/lib/filter-utils'
import type { Tool } from '@/lib/db/types'
import type { FilterState } from '@/components/Filters'

describe('filter-utils', () => {
  // Sample tools data for testing
  const sampleTools: Tool[] = [
    {
      id: '1',
      name: 'AI Writing Assistant',
      slug: 'ai-writing-assistant',
      description: 'An AI-powered tool for writing assistance',
      primary_tag: 'writing',
      tags: ['writing', 'content', 'ai'],
      pricing: 'freemium',
      platform: 'web',
      language: ['en', 'es'],
      no_signup: false,
      status: 'live',
      last_updated: '2023-01-01',
      created_at: '2023-01-01',
      homepage_url: 'https://example.com',
      affiliate_url: 'https://example.com/affiliate',
    },
    {
      id: '2',
      name: 'Image Generator',
      slug: 'image-generator',
      description: 'Generate images using AI',
      primary_tag: 'image',
      tags: ['image', 'design', 'ai'],
      pricing: 'paid',
      platform: 'web',
      language: ['en'],
      no_signup: true,
      status: 'live',
      last_updated: '2023-01-02',
      created_at: '2023-01-02',
      homepage_url: 'https://example.com',
      affiliate_url: 'https://example.com/affiliate',
    },
    {
      id: '3',
      name: 'Video Editor',
      slug: 'video-editor',
      description: 'Edit videos with AI assistance',
      primary_tag: 'video',
      tags: ['video', 'editing', 'ai'],
      pricing: 'free',
      platform: 'desktop',
      language: ['en', 'fr'],
      no_signup: false,
      status: 'live',
      last_updated: '2023-01-03',
      created_at: '2023-01-03',
      homepage_url: 'https://example.com',
      affiliate_url: 'https://example.com/affiliate',
    }
  ]

  describe('filterTools', () => {
    it('should return all tools when no filters are applied', () => {
      const filters: FilterState = {
        categories: [],
        tags: [],
        pricing: null,
        platform: null,
        language: null
      }
      
      const result = filterTools(sampleTools, filters)
      expect(result).toHaveLength(3)
      expect(result).toEqual(sampleTools)
    })

    it('should filter tools by category', () => {
      const filters: FilterState = {
        categories: ['writing'],
        tags: [],
        pricing: null,
        platform: null,
        language: null
      }
      
      const result = filterTools(sampleTools, filters)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('AI Writing Assistant')
    })

    it('should filter tools by tag', () => {
      const filters: FilterState = {
        categories: [],
        tags: ['image'],
        pricing: null,
        platform: null,
        language: null
      }
      
      const result = filterTools(sampleTools, filters)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Image Generator')
    })

    it('should filter tools by pricing', () => {
      const filters: FilterState = {
        categories: [],
        tags: [],
        pricing: 'free',
        platform: null,
        language: null
      }
      
      const result = filterTools(sampleTools, filters)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Video Editor')
    })

    it('should filter tools by platform', () => {
      const filters: FilterState = {
        categories: [],
        tags: [],
        pricing: null,
        platform: 'desktop',
        language: null
      }
      
      const result = filterTools(sampleTools, filters)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Video Editor')
    })

    it('should filter tools by language', () => {
      const filters: FilterState = {
        categories: [],
        tags: [],
        pricing: null,
        platform: null,
        language: 'fr'
      }
      
      const result = filterTools(sampleTools, filters)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Video Editor')
    })

    it('should filter tools by multiple criteria', () => {
      const filters: FilterState = {
        categories: ['writing'],
        tags: ['ai'],
        pricing: 'freemium',
        platform: 'web',
        language: 'en'
      }
      
      const result = filterTools(sampleTools, filters)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('AI Writing Assistant')
    })
  })

  describe('serializeFilters', () => {
    it('should serialize filters to query string', () => {
      const filters: FilterState = {
        categories: ['writing', 'image'],
        tags: ['ai', 'content'],
        pricing: 'free',
        platform: 'web',
        language: 'en'
      }
      
      const result = serializeFilters(filters)
      // We don't need to check the exact format since URLSearchParams handles encoding
      expect(result).toContain('categories=')
      expect(result).toContain('tags=')
      expect(result).toContain('pricing=')
      expect(result).toContain('platform=')
      expect(result).toContain('language=')
    })

    it('should handle empty filters', () => {
      const filters: FilterState = {
        categories: [],
        tags: [],
        pricing: null,
        platform: null,
        language: null
      }
      
      const result = serializeFilters(filters)
      expect(result).toBe('')
    })
  })

  describe('deserializeFilters', () => {
    it('should deserialize query string to filters', () => {
      const queryString = 'categories=writing%2Cimage&tags=ai%2Ccontent&pricing=free&platform=web&language=en'
      
      const result = deserializeFilters(queryString)
      expect(result.categories).toEqual(['writing', 'image'])
      expect(result.tags).toEqual(['ai', 'content'])
      expect(result.pricing).toBe('free')
      expect(result.platform).toBe('web')
      expect(result.language).toBe('en')
    })

    it('should handle empty query string', () => {
      const queryString = ''
      
      const result = deserializeFilters(queryString)
      expect(result.categories).toEqual([])
      expect(result.tags).toEqual([])
      expect(result.pricing).toBeNull()
      expect(result.platform).toBeNull()
      expect(result.language).toBeNull()
    })
  })

  describe('hasActiveFilters', () => {
    it('should return true when filters are active', () => {
      const filters: FilterState = {
        categories: ['writing'],
        tags: [],
        pricing: null,
        platform: null,
        language: null
      }
      
      const result = hasActiveFilters(filters)
      expect(result).toBe(true)
    })

    it('should return false when no filters are active', () => {
      const filters: FilterState = {
        categories: [],
        tags: [],
        pricing: null,
        platform: null,
        language: null
      }
      
      const result = hasActiveFilters(filters)
      expect(result).toBe(false)
    })
  })
})