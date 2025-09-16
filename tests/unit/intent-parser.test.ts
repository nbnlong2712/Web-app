import { describe, it, expect } from 'vitest'
import { parseIntent } from '../../src/lib/intent/parse'

describe('parseIntent', () => {
  it('should parse pricing filters correctly', () => {
    expect(parseIntent('free tools')).toEqual(
      expect.objectContaining({ pricing: 'free' })
    )
    
    expect(parseIntent('freemium tools')).toEqual(
      expect.objectContaining({ pricing: 'freemium' })
    )
    
    expect(parseIntent('paid tools')).toEqual(
      expect.objectContaining({ pricing: 'paid' })
    )
    
    expect(parseIntent('tools that cost money')).toEqual(
      expect.objectContaining({ pricing: 'paid' })
    )
  })

  it('should parse platform filters correctly', () => {
    expect(parseIntent('web tools')).toEqual(
      expect.objectContaining({ platform: 'web' })
    )
    
    expect(parseIntent('api tools')).toEqual(
      expect.objectContaining({ platform: 'api' })
    )
    
    expect(parseIntent('desktop tools')).toEqual(
      expect.objectContaining({ platform: 'desktop' })
    )
  })

  it('should parse language filters correctly', () => {
    expect(parseIntent('tools in english')).toEqual(
      expect.objectContaining({ language: expect.arrayContaining(['en']) })
    )
    
    expect(parseIntent('công cụ tiếng việt')).toEqual(
      expect.objectContaining({ language: expect.arrayContaining(['vi']) })
    )
  })

  it('should parse no signup requirement', () => {
    expect(parseIntent('tools with no signup')).toEqual(
      expect.objectContaining({ no_signup: true })
    )
    
    expect(parseIntent('no account required')).toEqual(
      expect.objectContaining({ no_signup: true })
    )
  })

  it('should parse tags from synonyms', () => {
    expect(parseIntent('writing tools')).toEqual(
      expect.objectContaining({ 
        tags: expect.arrayContaining(['writing']),
        primary_tag: 'writing'
      })
    )
    
    expect(parseIntent('image editing')).toEqual(
      expect.objectContaining({ 
        tags: expect.arrayContaining(['image']),
        primary_tag: 'image'
      })
    )
  })

  it('should preserve original query', () => {
    const query = 'free writing tools for english'
    expect(parseIntent(query)).toEqual(
      expect.objectContaining({ q: query })
    )
  })
})