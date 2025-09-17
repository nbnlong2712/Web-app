"use client";

import { Tool } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

interface ToolDetailProps {
  tool: Tool;
  isOpen: boolean;
  onClose: () => void;
}

export default function ToolDetail({ tool, isOpen, onClose }: ToolDetailProps) {
  // Format the last updated date
  const formattedDate = tool.last_updated 
    ? new Date(tool.last_updated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  // Handle copying link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/t/${tool.slug}`);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  // Handle visit button click
  const handleVisit = () => {
    // In a real implementation, this would track the click and then redirect
    // For now, we'll just open in a new tab
    window.open(`/go/${tool.slug}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="glass max-w-2xl max-h-[90vh] overflow-y-auto focus:outline-none"
        aria-labelledby="tool-detail-title"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle 
            id="tool-detail-title"
            className="text-2xl font-bold"
          >
            {tool.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Thumbnail area (16:9) - placeholder for now */}
          <div 
            className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-sm text-muted-foreground">Tool Thumbnail</span>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">
              {tool.description || "No description available for this tool."}
            </p>
          </div>
          
          {/* Tool details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pricing */}
            <Card className="glass p-4">
              <h4 className="font-semibold mb-2">Pricing</h4>
              <p className="text-muted-foreground">
                {tool.pricing ? 
                  tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1) : 
                  "Not specified"}
              </p>
            </Card>
            
            {/* Platform */}
            <Card className="glass p-4">
              <h4 className="font-semibold mb-2">Platform</h4>
              <p className="text-muted-foreground">
                {tool.platform ? 
                  tool.platform.charAt(0).toUpperCase() + tool.platform.slice(1) : 
                  "Not specified"}
              </p>
            </Card>
            
            {/* Languages */}
            <Card className="glass p-4">
              <h4 className="font-semibold mb-2">Languages</h4>
              <p className="text-muted-foreground">
                {tool.language && tool.language.length > 0 ? 
                  tool.language.join(', ') : 
                  "Not specified"}
              </p>
            </Card>
            
            {/* Last Updated */}
            <Card className="glass p-4">
              <h4 className="font-semibold mb-2">Last Updated</h4>
              <p className="text-muted-foreground">{formattedDate}</p>
            </Card>
          </div>
          
          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleVisit}
              className="flex-1"
              aria-label={`Visit ${tool.name} website`}
            >
              Visit Tool ↗
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCopyLink}
              className="flex-1"
              aria-label={`Copy link to ${tool.name}`}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}