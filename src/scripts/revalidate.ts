import { getAllTools } from '@/lib/db/queries';

async function warmISRCache() {
  try {
    console.log('Starting ISR cache warming...');
    
    // Get all tools
    const tools = await getAllTools();
    
    // Warm cache for top 100 tools (or all tools if less than 100)
    const toolsToWarm = tools.slice(0, 100);
    
    console.log(`Warming cache for ${toolsToWarm.length} tools...`);
    
    // Warm cache for each tool
    for (const tool of toolsToWarm) {
      try {
        const response = await fetch(`https://your-domain.com/t/${tool.slug}`, {
          method: 'GET',
        });
        
        if (response.ok) {
          console.log(`Warmed cache for: ${tool.name} (${tool.slug})`);
        } else {
          console.error(`Failed to warm cache for: ${tool.name} (${tool.slug}) - Status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error warming cache for: ${tool.name} (${tool.slug})`, error);
      }
    }
    
    console.log('ISR cache warming completed.');
  } catch (error) {
    console.error('Error during ISR cache warming:', error);
  }
}

// Run the warming function if this script is executed directly
if (require.main === module) {
  warmISRCache();
}

export default warmISRCache;