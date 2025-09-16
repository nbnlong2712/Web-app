"use client"

import { SearchBox } from "@/components/SearchBox"
import { GlassCard } from "@/components/GlassCard"
import { SearchResultsSkeleton } from "@/components/Skeletons"
import { parseIntent } from "@/lib/intent/parse"
import { useState } from "react"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [intent, setIntent] = useState<ReturnType<typeof parseIntent> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsLoading(true)
    
    // Parse the intent
    const parsedIntent = parseIntent(query)
    setIntent(parsedIntent)
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }

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
          ) : intent ? (
            <div className="space-y-4">
              <GlassCard 
                title="Search Results" 
                description={`Showing results for: "${searchQuery}"`}
              >
                <div className="space-y-2">
                  <p className="text-foreground/90">
                    <span className="font-medium">Parsed Intent:</span> {JSON.stringify(intent, null, 2)}
                  </p>
                  <p className="text-foreground/90">
                    In the next step, we&apos;ll connect this to the database to show actual tools.
                  </p>
                </div>
              </GlassCard>
            </div>
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
