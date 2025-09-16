import type { Tool } from '@/lib/db/types'
import type { FilterState } from '@/components/Filters'

/**
 * Filter tools based on the provided filter state
 * @param tools - Array of tools to filter
 * @param filters - Current filter state
 * @returns Filtered array of tools
 */
export function filterTools(tools: Tool[], filters: FilterState): Tool[] {
  // Start with all tools
  let filteredTools = [...tools]

  // Apply category filter
  if (filters.categories.length > 0) {
    filteredTools = filteredTools.filter(tool => 
      tool.primary_tag && filters.categories.includes(tool.primary_tag)
    )
  }

  // Apply tag filter
  if (filters.tags.length > 0) {
    filteredTools = filteredTools.filter(tool => {
      if (!tool.tags) return false
      return filters.tags.some(tag => tool.tags!.includes(tag))
    })
  }

  // Apply pricing filter
  if (filters.pricing) {
    filteredTools = filteredTools.filter(tool => tool.pricing === filters.pricing)
  }

  // Apply platform filter
  if (filters.platform) {
    filteredTools = filteredTools.filter(tool => tool.platform === filters.platform)
  }

  // Apply language filter
  if (filters.language) {
    filteredTools = filteredTools.filter(tool => {
      if (!tool.language) return false
      return tool.language.includes(filters.language!)
    })
  }

  return filteredTools
}

/**
 * Serialize filter state to URL query parameters
 * @param filters - Current filter state
 * @returns Query parameter string
 */
export function serializeFilters(filters: FilterState): string {
  const params = new URLSearchParams()

  if (filters.categories.length > 0) {
    params.set('categories', filters.categories.join(','))
  }

  if (filters.tags.length > 0) {
    params.set('tags', filters.tags.join(','))
  }

  if (filters.pricing) {
    params.set('pricing', filters.pricing)
  }

  if (filters.platform) {
    params.set('platform', filters.platform)
  }

  if (filters.language) {
    params.set('language', filters.language)
  }

  return params.toString()
}

/**
 * Deserialize filter state from URL query parameters
 * @param queryString - Query string from URL
 * @returns Filter state object
 */
export function deserializeFilters(queryString: string): FilterState {
  // If queryString is empty, return default filters
  if (!queryString) {
    return {
      categories: [],
      tags: [],
      pricing: null,
      platform: null,
      language: null
    }
  }
  
  const params = new URLSearchParams(queryString)
  
  return {
    categories: params.get('categories')?.split(',') || [],
    tags: params.get('tags')?.split(',') || [],
    pricing: (params.get('pricing') as 'free' | 'freemium' | 'paid' | null) || null,
    platform: (params.get('platform') as 'web' | 'api' | 'desktop' | null) || null,
    language: params.get('language') || null
  }
}

/**
 * Check if any filters are active
 * @param filters - Current filter state
 * @returns True if any filters are active
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.pricing !== null ||
    filters.platform !== null ||
    filters.language !== null
  )
}

/**
 * Create a debounced version of a function
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}