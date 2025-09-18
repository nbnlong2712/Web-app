import React from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ 
           background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
           backgroundAttachment: 'fixed'
         }}>
      <div className="glass w-full max-w-md">
        <GlassCard 
          title="404 - Page Not Found" 
          description="Sorry, the page you are looking for does not exist."
          className="w-full"
        >
          <div className="flex flex-col items-center space-y-6">
            <p className="text-foreground/90 text-center">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Button 
              asChild
              className="w-full"
            >
              <a href="/library">
                Go to Library
              </a>
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}