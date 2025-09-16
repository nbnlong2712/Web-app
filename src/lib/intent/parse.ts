import { SYNONYMS, FLAT_SYNONYMS } from './synonyms'

export type Intent = { 
  q: string; 
  pricing?: 'free'|'freemium'|'paid'; 
  platform?: 'web'|'api'|'desktop'; 
  language?: string[]; 
  no_signup?: boolean; 
  primary_tag?: string; 
  tags: string[] 
}

export function parseIntent(raw: string): Intent {
  const text = raw.normalize('NFKD').toLowerCase()
  const out: Intent = { q: raw.trim(), tags: [] }
  
  if (/\bfree|0đ|mien phi\b/.test(text)) out.pricing = 'free'
  if (/\bfreemium\b/.test(text)) out.pricing = 'freemium'
  if (/(\$|paid|trả phí|usd|vnd|đ|cost money)/.test(text)) out.pricing = 'paid'
  if (/no\s?signup|không\s?cần\s?đăng\s?ký|no account required/.test(text)) out.no_signup = true
  if (/\bweb\b/.test(text)) out.platform = 'web'
  if (/\bapi\b/.test(text)) out.platform = 'api'
  if (/desktop|windows|mac(os)?/.test(text)) out.platform = 'desktop'
  if (/vi(et)?(namese)?|\bvi\b/.test(text)) (out.language ||= []).push('vi')
  if (/english|\ben\b/.test(text)) (out.language ||= []).push('en')
  
  // Resolve primary_tag and tags from synonyms
  for (const [tag, synonyms] of Object.entries(SYNONYMS)) {
    if (synonyms.some(s => text.includes(s))) { 
      out.primary_tag = tag
      break
    }
  }
  
  for (const [synonym, tags] of Object.entries(FLAT_SYNONYMS)) {
    if (text.includes(synonym)) {
      tags.forEach(tag => {
        if (!out.tags.includes(tag)) {
          out.tags.push(tag)
        }
      })
    }
  }
  
  return out
}