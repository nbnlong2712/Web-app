"use client"

import { SearchBox } from "@/components/SearchBox"
import { GlassCard } from "@/components/GlassCard"
import { SearchResultsSkeleton } from "@/components/Skeletons"
import { parseIntent } from "@/lib/intent/parse"
import { searchTools } from "@/lib/db/queries"
import { useState, useEffect } from "react"
import type { Tool } from "@/lib/db/types"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [intent, setIntent] = useState<ReturnType<typeof parseIntent> | null>(null)
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setIsLoading(true)
    setError(null)
    
    try {
      // Parse the intent
      const parsedIntent = parseIntent(query)
      setIntent(parsedIntent)
      
      // Convert intent to search params
      const searchParams = {
        q: parsedIntent.q,
        primary_tag: parsedIntent.primary_tag || null,
        pricing: parsedIntent.pricing || null,
        platform: parsedIntent.platform || null,
        language: parsedIntent.language?.[0] || null, // Take first language if available
        no_signup: parsedIntent.no_signup || null,
        tags: parsedIntent.tags.length > 0 ? parsedIntent.tags : null,
        limit: 24
      }
      
      // Search tools in database
      const results = await searchTools(searchParams)
      setTools(results || [])
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search tools. Please try again.')
      setTools([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load some tools on initial render for demonstration
  useEffect(() => {
    const loadInitialTools = async () => {
      try {
        setIsLoading(true)
        const results = await searchTools({ limit: 6 })
        setTools(results || [])
      } catch (err) {
        console.error('Failed to load initial tools:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadInitialTools()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-foreground">AI Tools Library</h1>
        <p className="text-lg mb-8 text-foreground/80">
          Discover and explore the best AI tools for your needs with our curated collection.
        </p>
        
        <SearchBox onSearch={handleSearch} />
        
        {/* Results area with aria-live for accessibility */}
        <div 
          className="mt-8 w-full"
          aria-live="polite"
          aria-atomic="true"
        >
          {isLoading ? (
            <SearchResultsSkeleton />
          ) : error ? (
            <GlassCard title="Error" description="Failed to load tools">
              <p className="text-foreground/90">{error}</p>
            </GlassCard>
          ) : tools.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-foreground">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Tools"}
                </h2>
                <span className="text-foreground/70">{tools.length} tools</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <GlassCard 
                    key={tool.id} 
                    title={tool.name} 
                    description={tool.description || "No description available"}
                  >
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tool.primary_tag && (
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                          {tool.primary_tag}
                        </span>
                      )}
                      {tool.pricing && (
                        <span className="px-2 py-1 text-xs rounded-full bg-secondary/20 text-secondary">
                          {tool.pricing}
                        </span>
                      )}
                      {tool.platform && (
                        <span className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent">
                          {tool.platform}
                        </span>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ) : intent ? (
            <GlassCard 
              title="No Results Found" 
              description="Try adjusting your search terms"
            >
              <div className="space-y-2">
                <p className="text-foreground/90">
                  <span className="font-medium">Parsed Intent:</span> {JSON.stringify(intent, null, 2)}
                </p>
              </div>
            </GlassCard>
          ) : (
            <div className="text-center py-8">
              <p className="text-foreground/70">
                Enter a query above to search for AI tools
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}