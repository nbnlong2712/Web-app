"use client"

import ToolCard from "@/components/ToolCard"
import { Tool } from "@/components/ToolCard"

export default function ToolCardTestPage() {
  // Sample tool data for testing
  const sampleTools: Tool[] = [
    {
      id: "1",
      name: "AI Writing Assistant",
      slug: "ai-writing-assistant",
      description: "An advanced AI-powered tool that helps you write better content faster. Perfect for bloggers, copywriters, and content creators.",
      tags: ["writing", "content", "blogging", "seo"],
      pricing: "freemium",
      platform: "web",
      language: ["en"],
    },
    {
      id: "2",
      name: "Image Generation Tool",
      slug: "image-generation-tool",
      description: "Create stunning images from text descriptions with our state-of-the-art AI image generator.",
      tags: ["image", "design", "art"],
      pricing: "paid",
      platform: "web",
      language: ["en", "vi"],
    },
    {
      id: "3",
      name: "Video Editing AI",
      slug: "video-editing-ai",
      description: "Automatically edit your videos with AI-powered suggestions and enhancements. Save hours of manual work with intelligent editing features.",
      tags: ["video", "editing", "automation"],
      pricing: "free",
      platform: "desktop",
      language: ["en"],
      no_signup: true,
    },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">ToolCard Component Test</h1>
      
      {/* Test responsive grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      
      {/* Test with a tool that has minimal data */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Minimal Data Test</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ToolCard 
          tool={{
            id: "4",
            name: "Simple Tool",
            slug: "simple-tool",
          }} 
        />
      </div>
    </div>
  )
}