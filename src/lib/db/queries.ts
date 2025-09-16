import { supabase } from './client'

export type SearchParams = {
  q?: string
  primary_tag?: string | null
  pricing?: 'free' | 'freemium' | 'paid' | null
  platform?: 'web' | 'api' | 'desktop' | null
  language?: string | null
  no_signup?: boolean | null
  tags?: string[] | null
  limit?: number
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