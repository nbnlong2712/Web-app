import { getAllTools } from '@/lib/db/queries'
import LibraryGridClient from './LibraryGridClient'

// Set ISR revalidation to 10 minutes
export const revalidate = 600

// SEO metadata
export const metadata = {
  title: 'AI Tools Library - Browse All AI Tools',
  description: 'Discover and explore the best AI tools for your needs with our curated collection. Browse by category, pricing, platform, and more.',
}

export default async function LibraryPage() {
  // Fetch first page of tools (20 tools)
  const tools = await getAllTools({ limit: 20, offset: 0 })

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">AI Tools Library</h1>
        <p className="text-lg text-muted-foreground">
          Discover and explore the best AI tools for your needs
        </p>
      </div>

      {/* Client component that handles loading states and pagination */}
      <LibraryGridClient initialTools={tools} />
    </div>
  )
}