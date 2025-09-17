import { supabase } from './client'
import type { Tool } from './types'

export type SearchParams = {
  q?: string
  primary_tag?: string | null
  pricing?: 'free' | 'freemium' | 'paid' | null
  platform?: 'web' | 'api' | 'desktop' | null
  language?: string | null
  no_signup?: boolean | null
  tags?: string[] | null
  limit?: number
  offset?: number
}

export async function searchTools(params: SearchParams) {
  // Prefer backend RPC:
  try {
    // Create a typed version of params for RPC
    const rpcParams = {
      q: params.q,
      primary_tag: params.primary_tag,
      pricing: params.pricing,
      platform: params.platform,
      language: params.language,
      no_signup: params.no_signup,
      tags: params.tags,
      limit: params.limit,
    }
    
    // Cast to any to avoid type issues with RPC
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await supabase.rpc('search_tools', rpcParams as any)
    if (error) throw error
    return data
  } catch (error) {
    // Fallback (only if RPC not available):
    console.warn('RPC not available, using fallback query', error)
    const q = params.q?.trim()
    let query = supabase.from('tools').select('*').limit(params.limit ?? 24)
    
    if (q) {
      // Use full-text search as specified in the requirements
      query = query.textSearch('fts', q, { type: 'plain' })
    }
    
    if (params.primary_tag) query = query.eq('primary_tag', params.primary_tag)
    if (params.pricing) query = query.eq('pricing', params.pricing)
    if (params.platform) query = query.eq('platform', params.platform)
    if (params.language) query = query.contains('language', [params.language])
    if (params.no_signup != null) query = query.eq('no_signup', params.no_signup)
    
    // NOTE: relevance/similarity ordering must come from backend
    const { data, error: queryError } = await query
    if (queryError) throw queryError
    return data
  }
}

export async function getAllTools(options: { limit?: number; offset?: number } = {}): Promise<Tool[]> {
  try {
    const { limit = 100, offset = 0 } = options;
    
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('Error fetching tools:', error)
      throw new Error(`Failed to fetch tools: ${error.message}`)
    }
    
    return data || []
  } catch (error) {
    console.error('Unexpected error in getAllTools:', error)
    // Return empty array as fallback
    return []
  }
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      throw error
    }
    
    return data || null
  } catch (error) {
    console.error('Error fetching tool by slug:', error)
    throw error
  }
}