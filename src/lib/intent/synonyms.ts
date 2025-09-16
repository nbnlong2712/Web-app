// Tag synonyms dictionary for intent parsing
export const SYNONYMS: Record<string, string[]> = {
  'writing': ['writing', 'text', 'copy', 'content', 'blog', 'article', 'seo'],
  'image': ['image', 'photo', 'picture', 'visual', 'design'],
  'video': ['video', 'clip', 'movie', 'film', 'clip', 'video'],
  'audio': ['audio', 'sound', 'music', 'voice'],
  'coding': ['code', 'programming', 'developer', 'coding'],
  'design': ['design', 'ui', 'ux', 'graphic'],
  'marketing': ['marketing', 'seo', 'social media'],
  'research': ['research', 'academic', 'study'],
  'productivity': ['productivity', 'task', 'organize', 'productivity'],
  'education': ['education', 'learning', 'course'],
  'business': ['business', 'finance', 'startup'],
  'health': ['health', 'fitness', 'wellness'],
  'entertainment': ['entertainment', 'game', 'fun']
}

// Flatten all synonyms into a single lookup object
export const FLAT_SYNONYMS: Record<string, string[]> = {}

// Populate FLAT_SYNONYMS
Object.entries(SYNONYMS).forEach(([tag, synonyms]) => {
  synonyms.forEach(synonym => {
    if (!FLAT_SYNONYMS[synonym]) {
      FLAT_SYNONYMS[synonym] = []
    }
    FLAT_SYNONYMS[synonym].push(tag)
  })
})