import { GlassCard } from "@/components/GlassCard"
import { GlassButton } from "@/components/GlassButton"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-foreground">AI Tools Library</h1>
        <p className="text-lg mb-8 text-foreground/80">
          Discover and explore the best AI tools for your needs with our curated collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-8">
        <GlassCard 
          title="Explore Tools" 
          description="Browse our collection of AI tools"
        >
          <p className="mb-4 text-foreground/90">
            Find the perfect AI tools for your projects with our categorized library.
          </p>
          <GlassButton variant="default">
            Browse Library
          </GlassButton>
        </GlassCard>

        <GlassCard 
          title="Search & Filter" 
          description="Find tools that match your needs"
        >
          <p className="mb-4 text-foreground/90">
            Use our intelligent search to find tools based on your requirements.
          </p>
          <GlassButton variant="secondary">
            Start Searching
          </GlassButton>
        </GlassCard>
      </div>

      <div className="mt-12 text-center">
        <GlassCard 
          title="Get Started" 
          description="Begin your AI journey today"
          className="max-w-md mx-auto"
        >
          <p className="mb-4 text-foreground/90">
            Join thousands of users who have already discovered their perfect AI tools.
          </p>
          <div className="flex flex-col gap-2">
            <GlassButton variant="default" className="w-full">
              Sign Up Free
            </GlassButton>
            <GlassButton variant="outline" className="w-full">
              Learn More
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
