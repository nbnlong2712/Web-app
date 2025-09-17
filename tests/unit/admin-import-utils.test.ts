import { describe, it, expect } from 'vitest';
import { parseCSVLine, normalizeHeader, generateSlug, normalizeTags } from '@/app/admin/import/utils';

describe('Admin Import Utilities', () => {
  describe('parseCSVLine', () => {
    it('should parse simple CSV line', () => {
      const line = 'name,description,pricing';
      const result = parseCSVLine(line);
      expect(result).toEqual(['name', 'description', 'pricing']);
    });

    it('should handle quoted values', () => {
      const line = '"name with, comma","description","pricing"';
      const result = parseCSVLine(line);
      expect(result).toEqual(['name with, comma', 'description', 'pricing']);
    });

    it('should handle escaped quotes', () => {
      const line = '"name with ""quotes""","description","pricing"';
      const result = parseCSVLine(line);
      expect(result).toEqual(['name with "quotes"', 'description', 'pricing']);
    });

    it('should handle empty values', () => {
      const line = 'name,,pricing';
      const result = parseCSVLine(line);
      expect(result).toEqual(['name', '', 'pricing']);
    });
  });

  describe('normalizeHeader', () => {
    it('should normalize common header variations', () => {
      expect(normalizeHeader('Tool Name')).toBe('name');
      expect(normalizeHeader('tool-name')).toBe('name');
      expect(normalizeHeader('tool_name')).toBe('name');
      expect(normalizeHeader('Homepage URL')).toBe('homepage_url');
      expect(normalizeHeader('affiliate url')).toBe('affiliate_url');
    });

    it('should normalize unknown headers to lowercase with underscores', () => {
      expect(normalizeHeader('Unknown Header!')).toBe('unknown_header_');
    });
  });

  describe('generateSlug', () => {
    it('should generate slug from name', () => {
      expect(generateSlug('Test Tool')).toBe('test-tool');
      expect(generateSlug('  Test  Tool  ')).toBe('test-tool');
      expect(generateSlug('Test/Tool')).toBe('test-tool');
      expect(generateSlug('Test---Tool')).toBe('test-tool');
    });
  });

  describe('normalizeTags', () => {
    it('should normalize tags from semicolon-separated values', () => {
      expect(normalizeTags('AI; Productivity; Automation')).toEqual(['AI', 'Productivity', 'Automation']);
      expect(normalizeTags('AI; ; Productivity')).toEqual(['AI', 'Productivity']);
      expect(normalizeTags('AI')).toEqual(['AI']);
    });
  });
});