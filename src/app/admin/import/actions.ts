// app/admin/import/actions.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from '@supabase/supabase-js';
// import { Database } from '@/lib/db/types'; // Commented out as the file doesn't exist

const getSupabaseClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(
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

type ToolUpdate = {
  name?: string;
  slug?: string;
  description?: string | null;
  homepage_url?: string | null;
  affiliate_url?: string | null;
  primary_tag?: string | null;
  tags?: string[] | null;
  pricing?: 'free' | 'freemium' | 'paid' | null;
  platform?: 'web' | 'api' | 'desktop' | null;
  language?: string[] | null;
  no_signup?: boolean | null;
  status?: string | null;
  last_updated?: string;
};

type ToolInsert = ToolUpdate & {
  created_at?: string;
};

// Validate a single tool row
const validateToolRow = (row: Record<string, string | boolean | null>): string[] => {
  const errors: string[] = [] as string[];
  
  // Check required fields
  if (!row.name) {
    errors.push('Missing required field: name');
  }
  
  // Validate pricing values
  if (row.pricing && typeof row.pricing === 'string' && !['free', 'freemium', 'paid'].includes(row.pricing)) {
    errors.push(`Invalid pricing value: ${row.pricing}. Must be free, freemium, or paid.`);
  }
  
  // Validate platform values
  if (row.platform && typeof row.platform === 'string' && !['web', 'api', 'desktop'].includes(row.platform)) {
    errors.push(`Invalid platform value: ${row.platform}. Must be web, api, or desktop.`);
  }
  
  return errors;
};

// Process and import tools from CSV data
export async function importToolsFromCSV(csvData: Record<string, any>[]) {
  const supabase = getSupabaseClient();
  
  let createdCount = 0;
  let updatedCount = 0;
  const errors: { row: number; errors: string[] }[] = [];
  
  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i] as Record<string, string | boolean | null>;
    const rowIndex = i + 2; // +1 for header row, +1 for 0-based index
    
    // Validate the row
    const rowErrors = validateToolRow(row);
    if (rowErrors.length > 0) {
      errors.push({ row: rowIndex, errors: rowErrors });
      continue;
    }
    
    try {
      // Generate slug if missing
      if (!row.slug && row.name) {
        (row.slug as string) = generateSlug(row.name as string);
      }
      
      // Normalize tags if present
      if (row.tags && typeof row.tags === 'string') {
        (row.tags as string | string[] | null) = normalizeTags(row.tags);
      }
      
      // Check if tool with this slug already exists
      const { data: existingTool, error: fetchError } = await supabase
        .from('tools')
        .select('id')
        .eq('slug', row.slug || '')
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Database error: ${fetchError.message}`);
      }
      
      if (existingTool) {
        // Update existing tool
        const updateData: ToolUpdate = {
          name: row.name ? (row.name as string) : '',
          slug: row.slug ? (row.slug as string) : '',
          description: row.description ? (row.description as string) : null,
          homepage_url: row.homepage_url ? (row.homepage_url as string) : null,
          affiliate_url: row.affiliate_url ? (row.affiliate_url as string) : null,
          primary_tag: row.primary_tag ? (row.primary_tag as string) : null,
          tags: row.tags && Array.isArray(row.tags) ? (row.tags as string[]) : null,
          pricing: row.pricing ? (row.pricing as 'free' | 'freemium' | 'paid') : null,
          platform: row.platform ? (row.platform as 'web' | 'api' | 'desktop') : null,
          language: row.language && Array.isArray(row.language) ? (row.language as string[]) : null,
          no_signup: row.no_signup ? (row.no_signup as boolean) : null,
          status: row.status ? (row.status as string) : null,
          last_updated: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('tools')
          .update(updateData)
          .eq('id', existingTool.id);
        
        if (updateError) {
          throw new Error(`Failed to update tool: ${updateError.message}`);
        }
        
        updatedCount++;
      } else {
        // Insert new tool
        const insertData: ToolInsert = {
          name: row.name ? (row.name as string) : '',
          slug: row.slug ? (row.slug as string) : '',
          description: row.description ? (row.description as string) : null,
          homepage_url: row.homepage_url ? (row.homepage_url as string) : null,
          affiliate_url: row.affiliate_url ? (row.affiliate_url as string) : null,
          primary_tag: row.primary_tag ? (row.primary_tag as string) : null,
          tags: row.tags && Array.isArray(row.tags) ? (row.tags as string[]) : null,
          pricing: row.pricing ? (row.pricing as 'free' | 'freemium' | 'paid') : null,
          platform: row.platform ? (row.platform as 'web' | 'api' | 'desktop') : null,
          language: row.language && Array.isArray(row.language) ? (row.language as string[]) : null,
          no_signup: row.no_signup ? (row.no_signup as boolean) : null,
          status: row.status ? (row.status as string) : null,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
        
        const { error: insertError } = await supabase
          .from('tools')
          .insert([insertData]);
        
        if (insertError) {
          throw new Error(`Failed to insert tool: ${insertError.message}`);
        }
        
        createdCount++;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        errors.push({ row: rowIndex, errors: [error.message] });
      } else {
        errors.push({ row: rowIndex, errors: ['Unknown error occurred'] });
      }
    }
  }
  
  // Trigger revalidation after successful import
  if (createdCount > 0 || updatedCount > 0) {
    try {
      // Revalidate the library page
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/library`, { method: 'GET' });
      
      // Revalidate the home page
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}`, { method: 'GET' });
      
      console.log('Successfully revalidated pages after import');
    } catch (revalidateError) {
      console.error('Error revalidating pages:', revalidateError);
      // Don't throw error as this shouldn't block the import process
    }
  }
  
  return {
    created: createdCount,
    updated: updatedCount,
    errors
  };
}