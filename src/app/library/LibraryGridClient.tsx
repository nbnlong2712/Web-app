"use client"

import { useState } from 'react'
import type { Tool } from '@/lib/db/types'
import ToolCard from '@/components/ToolCard'
import { ToolCardSkeleton } from '@/components/Skeletons'

export default function LibraryGridClient({ initialTools }: { initialTools: Tool[] }) {
  const [tools, setTools] = useState<Tool[]>(initialTools)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  // const [offset, setOffset] = useState(20)

  // Function to load more tools
  const loadMore = async () => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    try {
      // In a real implementation, we would fetch more tools from the API
      // For now, we'll simulate this with a timeout
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simulate API response with no more tools
      const newTools: Tool[] = []
      setTools(prev => [...prev, ...newTools])
      
      // If no new tools were returned, we've reached the end
      if (newTools.length === 0) {
        setHasMore(false)
      } // else {
        // setOffset(prev => prev + 20)
      // }
    } catch (error) {
      console.error('Error loading more tools:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Show initial loading state if no tools and still loading
  if (initialTools.length === 0 && isLoading) {
    return (
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        role="region"
        aria-label="Loading tools"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <ToolCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  // Render tools or empty state
  return (
    <>
      {tools.length > 0 ? (
        <>
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            role="region"
            aria-label="AI tools grid"
          >
            {tools.map((tool) => (
              <div key={tool.id} data-testid="tool-card">
                <ToolCard 
                  tool={tool}
                />
              </div>
            ))}
          </div>
          
          {/* Load more button */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={isLoading ? "Loading more tools" : "Load more tools"}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
          
          {/* Show loading indicator when fetching more */}
          {isLoading && hasMore && (
            <div className="mt-8 text-center" role="status" aria-label="Loading more tools">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </>
      ) : (
        // Empty state
        <div className="text-center py-12">
          <div className="glass p-8 rounded-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">No Tools Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn{`'`}t find any tools in our library at the moment.
            </p>
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                Try checking back later or{' '}
                <a href="/suggest" className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                  suggest a tool
                </a>{' '}
                you{`'`}d like to see.
              </p>
              <div className="flex justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}