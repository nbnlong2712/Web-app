"use client"

import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { deserializeFilters, serializeFilters } from '@/lib/filter-utils'

// Define types for our filters
export type FilterState = {
  categories: string[]
  tags: string[]
  pricing: 'free' | 'freemium' | 'paid' | null
  platform: 'web' | 'api' | 'desktop' | null
  language: string | null
}

// Define props for our Filters component
type FiltersProps = {
  initialFilters?: FilterState
  onFilterChange: (filters: FilterState) => void
  availableCategories?: string[]
  availableTags?: string[]
  availableLanguages?: string[]
}

export default function Filters({
  initialFilters,
  onFilterChange,
  availableCategories = [],
  availableTags = [],
  availableLanguages = []
}: FiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Initialize filter state from URL or initialFilters
  const getInitialFilters = (): FilterState => {
    const serializedFilters = searchParams.toString()
    if (serializedFilters) {
      return deserializeFilters(serializedFilters)
    }
    return initialFilters || {
      categories: [],
      tags: [],
      pricing: null,
      platform: null,
      language: null
    }
  }

  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>(getInitialFilters())

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterState) => {
    const queryString = serializeFilters(newFilters)
    const newPath = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(newPath, { scroll: false })
  }, [pathname, router])

  // Handle category selection
  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
      
      const newFilters = { ...prev, categories: newCategories }
      onFilterChange(newFilters)
      updateURL(newFilters)
      return newFilters
    })
  }, [onFilterChange, updateURL])

  // Handle tag selection
  const toggleTag = useCallback((tag: string) => {
    setFilters(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
      
      const newFilters = { ...prev, tags: newTags }
      onFilterChange(newFilters)
      updateURL(newFilters)
      return newFilters
    })
  }, [onFilterChange, updateURL])

  // Handle pricing selection
  const setPricing = useCallback((pricing: 'free' | 'freemium' | 'paid' | null) => {
    setFilters(prev => {
      const newFilters = { ...prev, pricing }
      onFilterChange(newFilters)
      updateURL(newFilters)
      return newFilters
    })
  }, [onFilterChange, updateURL])

  // Handle platform selection
  const setPlatform = useCallback((platform: 'web' | 'api' | 'desktop' | null) => {
    setFilters(prev => {
      const newFilters = { ...prev, platform }
      onFilterChange(newFilters)
      updateURL(newFilters)
      return newFilters
    })
  }, [onFilterChange, updateURL])

  // Handle language selection
  const setLanguage = useCallback((language: string | null) => {
    setFilters(prev => {
      const newFilters = { ...prev, language }
      onFilterChange(newFilters)
      updateURL(newFilters)
      return newFilters
    })
  }, [onFilterChange, updateURL])

  // Reset all filters
  const resetFilters = useCallback(() => {
    const resetState = {
      categories: [],
      tags: [],
      pricing: null,
      platform: null,
      language: null
    }
    setFilters(resetState)
    onFilterChange(resetState)
    router.replace(pathname, { scroll: false })
  }, [onFilterChange, router, pathname])

  // Update filter state when URL changes
  useEffect(() => {
    const serializedFilters = searchParams.toString()
    if (serializedFilters) {
      const newFilters = deserializeFilters(serializedFilters)
      setFilters(newFilters)
      onFilterChange(newFilters)
    }
  }, [searchParams, onFilterChange])

  // Handle keyboard events for filter chips
  const handleChipKeyDown = useCallback((event: React.KeyboardEvent<HTMLSpanElement>, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }, [])

  return (
    <div className="glass p-4 rounded-2xl mb-6" role="region" aria-label="Library filters">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold">Filters</h2>
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="text-sm"
          aria-label="Reset all filters"
        >
          Reset Filters
        </Button>
      </div>

      {/* Categories/Tags Chips */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2" id="categories-heading">Categories</h3>
        <div 
          className="flex flex-wrap gap-2 mb-4" 
          role="group" 
          aria-labelledby="categories-heading"
        >
          {availableCategories.map(category => (
            <Badge
              key={category}
              variant={filters.categories.includes(category) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleCategory(category)}
              onKeyDown={(e) => handleChipKeyDown(e, () => toggleCategory(category))}
              tabIndex={0}
              role="checkbox"
              aria-checked={filters.categories.includes(category)}
              aria-label={`Toggle category ${category}`}
            >
              {category}
            </Badge>
          ))}
        </div>

        <h3 className="font-semibold mb-2" id="tags-heading">Tags</h3>
        <div 
          className="flex flex-wrap gap-2" 
          role="group" 
          aria-labelledby="tags-heading"
        >
          {availableTags.map(tag => (
            <Badge
              key={tag}
              variant={filters.tags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
              onKeyDown={(e) => handleChipKeyDown(e, () => toggleTag(tag))}
              tabIndex={0}
              role="checkbox"
              aria-checked={filters.tags.includes(tag)}
              aria-label={`Toggle tag ${tag}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Pricing/Platform/Language Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pricing Filter */}
        <div>
          <label className="block text-sm font-medium mb-1" id="pricing-label">Pricing</label>
          <Select
            value={filters.pricing || ""}
            onValueChange={(value) => setPricing(value as 'free' | 'freemium' | 'paid' | null)}
            aria-labelledby="pricing-label"
          >
            <SelectTrigger aria-label="Select pricing option">
              <SelectValue placeholder="Select pricing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="freemium">Freemium</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Platform Filter */}
        <div>
          <label className="block text-sm font-medium mb-1" id="platform-label">Platform</label>
          <Select
            value={filters.platform || ""}
            onValueChange={(value) => setPlatform(value as 'web' | 'api' | 'desktop' | null)}
            aria-labelledby="platform-label"
          >
            <SelectTrigger aria-label="Select platform option">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-sm font-medium mb-1" id="language-label">Language</label>
          <Select
            value={filters.language || ""}
            onValueChange={(value) => setLanguage(value || null)}
            aria-labelledby="language-label"
          >
            <SelectTrigger aria-label="Select language option">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {availableLanguages.map(lang => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}