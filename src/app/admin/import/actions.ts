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

import type { Tool } from '@/lib/db/types';

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
const validateToolRow = (row: Partial<Tool>, rowIndex: number): string[] => {
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
export async function importToolsFromCSV(csvData: Partial<Tool>[]) {
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
      if (!row.slug && row.name) {
        row.slug = generateSlug(row.name);
      }
      
      // Normalize tags if present
      if (row.tags && typeof row.tags === 'string') {
        row.tags = normalizeTags(row.tags);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {
          name: row.name || '',
          slug: row.slug || '',
          description: row.description || null,
          homepage_url: row.homepage_url || null,
          affiliate_url: row.affiliate_url || null,
          primary_tag: row.primary_tag || null,
          tags: row.tags || null,
          pricing: row.pricing || null,
          platform: row.platform || null,
          language: row.language || null,
          no_signup: row.no_signup || null,
          status: row.status || null,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const insertData: any = {
          name: row.name || '',
          slug: row.slug || '',
          description: row.description || null,
          homepage_url: row.homepage_url || null,
          affiliate_url: row.affiliate_url || null,
          primary_tag: row.primary_tag || null,
          tags: row.tags || null,
          pricing: row.pricing || null,
          platform: row.platform || null,
          language: row.language || null,
          no_signup: row.no_signup || null,
          status: row.status || null,
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
  
  return {
    created: createdCount,
    updated: updatedCount,
    errors
  };
}