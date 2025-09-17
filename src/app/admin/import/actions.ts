'use server';

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/db/types';

// Initialize Supabase client for server-side operations
const getSupabaseClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient<Database>(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

// Validate admin access key
export async function validateAdminAccessKey(key: string): Promise<boolean> {
  // In a real implementation, you would check this against a database or secure store
  // For now, we'll check against a private environment variable
  const adminKey = process.env.ADMIN_ACCESS_KEY;
  
  if (!adminKey) {
    console.error('ADMIN_ACCESS_KEY environment variable not set');
    return false;
  }
  
  return key === adminKey;
}

// Generate slug from name if missing
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Normalize tags from semicolon-separated values
const normalizeTags = (tags: string): string[] => {
  return tags
    .split(';')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
};

// Validate a single tool row
const validateToolRow = (row: any, rowIndex: number): string[] => {
  const errors: string[] = [];
  
  // Check required fields
  if (!row.name) {
    errors.push('Missing required field: name');
  }
  
  // Validate pricing values
  if (row.pricing && !['free', 'freemium', 'paid'].includes(row.pricing)) {
    errors.push(`Invalid pricing value: ${row.pricing}. Must be free, freemium, or paid.`);
  }
  
  // Validate platform values
  if (row.platform && !['web', 'api', 'desktop'].includes(row.platform)) {
    errors.push(`Invalid platform value: ${row.platform}. Must be web, api, or desktop.`);
  }
  
  return errors;
};

// Process and import tools from CSV data
export async function importToolsFromCSV(csvData: any[]) {
  const supabase = getSupabaseClient();
  
  let createdCount = 0;
  let updatedCount = 0;
  const errors: { row: number; errors: string[] }[] = [];
  
  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i];
    const rowIndex = i + 2; // +1 for header row, +1 for 0-based index
    
    // Validate the row
    const rowErrors = validateToolRow(row, rowIndex);
    if (rowErrors.length > 0) {
      errors.push({ row: rowIndex, errors: rowErrors });
      continue;
    }
    
    try {
      // Generate slug if missing
      if (!row.slug) {
        row.slug = generateSlug(row.name);
      }
      
      // Normalize tags if present
      if (row.tags) {
        row.tags = normalizeTags(row.tags);
      }
      
      // Check if tool with this slug already exists
      const { data: existingTool, error: fetchError } = await supabase
        .from('tools')
        .select('id')
        .eq('slug', row.slug)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Database error: ${fetchError.message}`);
      }
      
      if (existingTool) {
        // Update existing tool
        const { error: updateError } = await supabase
          .from('tools')
          .update({
            ...row,
            last_updated: new Date().toISOString()
          })
          .eq('id', existingTool.id);
        
        if (updateError) {
          throw new Error(`Failed to update tool: ${updateError.message}`);
        }
        
        updatedCount++;
      } else {
        // Insert new tool
        const { error: insertError } = await supabase
          .from('tools')
          .insert({
            ...row,
            last_updated: new Date().toISOString(),
            created_at: new Date().toISOString()
          });
        
        if (insertError) {
          throw new Error(`Failed to insert tool: ${insertError.message}`);
        }
        
        createdCount++;
      }
    } catch (error: any) {
      errors.push({ row: rowIndex, errors: [error.message] });
    }
  }
  
  return {
    created: createdCount,
    updated: updatedCount,
    errors
  };
}