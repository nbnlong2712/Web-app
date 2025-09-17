"use client"

import { useState } from 'react';
import { Card } from "@/components/ui/card"
import Link from "next/link"
import ToolDetail from "@/components/ToolDetail"

import type { Tool as DatabaseTool } from '@/lib/db/types';

// Export the Tool type from the database
export type Tool = DatabaseTool;

export default function ToolCard({ tool }: { tool: Tool }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card 
        className="glass p-4 flex flex-col h-full"
        role="article"
        aria-labelledby={`tool-name-${tool.id}`}
      >
        {/* Thumbnail area (16:9) - placeholder for now */}
        <div 
          className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-xs text-muted-foreground">Thumbnail</span>
        </div>
        
        {/* Tool name with proper typography and line clamping */}
        <h3 
          id={`tool-name-${tool.id}`} 
          className="text-lg font-semibold line-clamp-1 mb-1"
        >
          {tool.name}
        </h3>
        
        {/* Description with 2-line clamp */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
          {tool.description || "No description available"}
        </p>
        
        {/* Tags and pricing */}
        <div className="mt-3 flex items-center justify-between">
          {/* Tag chips with proper styling and truncation */}
          <div 
            className="flex gap-1 overflow-x-auto"
            aria-label="Tags"
          >
            {tool.tags?.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20 whitespace-nowrap"
                aria-label={`Tag: ${tag}`}
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Pricing badge */}
          {tool.pricing && (
            <span 
              className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent whitespace-nowrap"
              aria-label={`Pricing: ${tool.pricing}`}
            >
              {tool.pricing}
            </span>
          )}
        </div>
        
        {/* Open button/link */}
        <div className="mt-3">
          <Link 
            href={`/t/${tool.slug}`} 
            onClick={handleOpenModal}
            className="text-sm underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
            aria-label={`Open ${tool.name} tool details`}
          >
            Open ↗
          </Link>
        </div>
      </Card>
      
      {/* Tool Detail Modal */}
      <ToolDetail 
        tool={tool} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  )
}