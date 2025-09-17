"use client"

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { GlassButton } from '@/components/GlassButton'
import { motion } from 'framer-motion'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { trackEvent } from '@/lib/analytics'

interface SearchBoxProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBox({ onSearch, placeholder = "Describe what you need..." }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (query.trim()) {
      // Track search submit event
      trackEvent('search_submit', {
        query_length: query.length,
        query_preview: query.substring(0, 50), // First 50 characters for context
      });
      
      onSearch(query)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Focus the input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <motion.div 
      className="glass w-full max-w-2xl mx-auto p-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-0 focus:ring-0 text-foreground placeholder:text-foreground/60 py-4 px-4"
          aria-label="Search for AI tools"
        />
        <GlassButton 
          onClick={handleSubmit}
          disabled={!query.trim()}
          className="m-1 p-3"
          aria-label="Submit search"
        >
          <PaperPlaneIcon className="w-5 h-5" />
        </GlassButton>
      </div>
    </motion.div>
  )
}