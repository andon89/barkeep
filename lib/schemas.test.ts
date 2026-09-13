import { describe, it, expect } from 'vitest'
import { MenuResponseSchema, MakeMeResponseSchema, parseClaudeJson, resolveMakeMe } from './schemas'

const drink = { name: 'Last Word', description: 'Equal parts, sharp and green.', ingredients: [{ item: 'Tanqueray London Dry Gin', amount: '0.75 oz' }], instructions: 'Shake with ice, double strain.', glassware: 'Coupe', garnish: 'Brandied cherry' }

describe('parseClaudeJson', () => {
  it('parses a bare JSON object', () => {
    expect(parseClaudeJson('{"title":"T","intro":"I","drinks":[]}', MenuResponseSchema)).toEqual({ title: 'T', intro: 'I', drinks: [] })
  })
  it('strips code fences and surrounding prose', () => {
    const text = 'Here you go:\n```json\n{"title":"T","intro":"I","drinks":[]}\n```\nEnjoy.'
    expect(parseClaudeJson(text, MenuResponseSchema).title).toBe('T')
  })
  it('throws a clear error when the shape is wrong', () => {
    expect(() => parseClaudeJson('{"title":"T"}', MenuResponseSchema)).toThrow(/intro|drinks/)
  })
  it('picks the last fenced block when an earlier one is an example', () => {
    const text = 'Example:\n```json\n{"title":"EXAMPLE","intro":"x","drinks":[]}\n```\nReal one:\n```json\n{"title":"Real","intro":"I","drinks":[]}\n```\n'
    expect(parseClaudeJson(text, MenuResponseSchema).title).toBe('Real')
  })
  it('ignores a stray brace in surrounding prose', () => {
    const text = 'Sure { here you go: {"title":"T","intro":"I","drinks":[]} cheers'
    expect(parseClaudeJson(text, MenuResponseSchema).title).toBe('T')
  })
  it('handles a closing brace inside a string value', () => {
    const text = '{"title":"Odd } name","intro":"I","drinks":[]}'
    expect(parseClaudeJson(text, MenuResponseSchema).title).toBe('Odd } name')
  })
  it('throws No JSON object on truncated JSON', () => {
    expect(() => parseClaudeJson('{"title":"T","intro":', MenuResponseSchema)).toThrow(/No JSON object/)
  })
})

describe('resolveMakeMe', () => {
  it('resolves to an existing menu drink', () => {
    expect(resolveMakeMe({ reply: 'Here.', menu_drink_id: 'abc', drink: null })).toEqual({ kind: 'menu', id: 'abc' })
  })
  it('resolves to a new drink', () => {
    expect(resolveMakeMe({ reply: 'Here.', menu_drink_id: null, drink })).toEqual({ kind: 'new', drink })
  })
  it('rejects both or neither', () => {
    expect(() => resolveMakeMe({ reply: 'x', menu_drink_id: 'abc', drink })).toThrow()
    expect(() => resolveMakeMe({ reply: 'x', menu_drink_id: null, drink: null })).toThrow()
  })
  it('MakeMeResponseSchema accepts a menu pick', () => {
    expect(MakeMeResponseSchema.safeParse({ reply: 'x', menu_drink_id: 'abc', drink: null }).success).toBe(true)
  })
})
