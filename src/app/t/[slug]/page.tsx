import { Tool } from '@/components/ToolCard';
import { getToolBySlug } from '@/lib/db/queries';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Helper function to capitalize first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate metadata for the page
type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug);
  
  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.',
    };
  }
  
  const title = `${tool.name} - AI Tools Library`;
  const description = tool.description || `Discover ${tool.name}, a powerful AI tool.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://your-domain.com/t/${params.slug}`, // Replace with your actual domain
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// Add ISR revalidation
export const revalidate = 600; // 10 minutes

export default async function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = await getToolBySlug(params.slug);
  
  // If tool not found, return 404
  if (!tool) {
    notFound();
  }
  
  // Format the last updated date
  const formattedDate = tool.last_updated 
    ? new Date(tool.last_updated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link 
          href="/library" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          aria-label="Back to library"
        >
          ← Back to Library
        </Link>
        
        {/* Main content card with glass styling */}
        <div className="glass rounded-lg p-6 md:p-8">
          {/* Header section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{tool.name}</h1>
            
            {/* Tags and pricing */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {tool.tags && tool.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tool.tags.slice(0, 5).map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {tool.pricing && (
                <span className="text-sm px-3 py-1 rounded-full bg-accent/20 text-accent">
                  {capitalize(tool.pricing)}
                </span>
              )}
            </div>
          </div>
          
          {/* Thumbnail area (16:9) - placeholder for now */}
          <div 
            className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-8 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-sm text-muted-foreground">Tool Thumbnail</span>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {tool.description || "No description available for this tool."}
            </p>
          </div>
          
          {/* Tool details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Pricing */}
            <div className="glass p-5 rounded-lg">
              <h3 className="font-semibold mb-2 text-lg">Pricing</h3>
              <p className="text-muted-foreground">
                {tool.pricing ? 
                  capitalize(tool.pricing) : 
                  "Not specified"}
              </p>
            </div>
            
            {/* Platform */}
            <div className="glass p-5 rounded-lg">
              <h3 className="font-semibold mb-2 text-lg">Platform</h3>
              <p className="text-muted-foreground">
                {tool.platform ? 
                  capitalize(tool.platform) : 
                  "Not specified"}
              </p>
            </div>
            
            {/* Languages */}
            <div className="glass p-5 rounded-lg">
              <h3 className="font-semibold mb-2 text-lg">Languages</h3>
              <p className="text-muted-foreground">
                {tool.language && tool.language.length > 0 ? 
                  tool.language.join(', ') : 
                  "Not specified"}
              </p>
            </div>
            
            {/* Last Updated */}
            <div className="glass p-5 rounded-lg">
              <h3 className="font-semibold mb-2 text-lg">Last Updated</h3>
              <p className="text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link
              href={`/go/${tool.slug}`}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-6 rounded-lg text-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={`Visit ${tool.name} website`}
            >
              Visit Tool ↗
            </Link>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/t/${tool.slug}`);
              }}
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 py-3 px-6 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={`Copy link to ${tool.name}`}
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}