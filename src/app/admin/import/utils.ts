// Utility functions for admin import functionality

// Improved CSV parsing that handles quoted values
export const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // escaped quote
        current += '"';
        i++; // skip next quote
      } else {
        // toggle inQuotes
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // end of field
      result.push(current.trim().replace(/^"(.*)"$/, '$1'));
      current = '';
    } else {
      current += char;
    }
  }
  
  // push last field
  result.push(current.trim().replace(/^"(.*)"$/, '$1'));
  return result;
};

// Normalize header names
export const normalizeHeader = (header: string): string => {
  const normalized = header.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  // Map common variations to standard names
  switch (normalized) {
    case 'tool_name':
    case 'tool-name':
      return 'name';
    case 'tool_slug':
    case 'tool-slug':
      return 'slug';
    case 'tool_description':
    case 'tool-description':
      return 'description';
    case 'homepage':
    case 'homepage_url':
    case 'website':
      return 'homepage_url';
    case 'affiliate':
    case 'affiliate_url':
      return 'affiliate_url';
    case 'primary_tag':
    case 'primary-tag':
      return 'primary_tag';
    case 'no_signup':
    case 'no-signup':
      return 'no_signup';
    default:
      return normalized;
  }
};

// Generate slug from name if missing
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Normalize tags from semicolon-separated values
export const normalizeTags = (tags: string): string[] => {
  return tags
    .split(';')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
};