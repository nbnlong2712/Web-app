export type Intent = { q: string; pricing?: 'free'|'freemium'|'paid'; platform?: 'web'|'api'|'desktop'; language?: string[]; no_signup?: boolean; primary_tag?: string; tags: string[] }

export function parseIntent(raw: string): Intent {
  const text = raw.normalize('NFKD').toLowerCase()
  const out: Intent = { q: raw.trim(), tags: [] }
  
  if (/\bfree|0đ|mien phi\b/.test(text)) out.pricing = 'free'
  if (/\bfreemium\b/.test(text)) out.pricing = 'freemium'
  if (/(\$|paid|trả phí|usd|vnd|đ)/.test(text)) out.pricing = 'paid'
  if (/no\s?signup|không\s?cần\s?đăng\s?ký/.test(text)) out.no_signup = true
  if (/\bapi\b/.test(text)) out.platform = 'api'
  if (/desktop|windows|mac(os)?/.test(text)) out.platform = 'desktop'
  if (/vi(et)?(namese)?|\bvi\b/.test(text)) (out.language ||= []).push('vi')
  if (/english|\ben\b/.test(text)) (out.language ||= []).push('en')
  
  return out
}