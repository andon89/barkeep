import { describe, it, expect } from 'vitest'
import { MenuResponseSchema, MakeMeResponseSchema, parseClaudeJson, resolveMakeMe } from './schemas'

const drink = { name: 'Last Word', description: 'Equal parts, sharp and green.', ingredients: [{ item: 'Tanqueray London Dry Gin', amount: '0.75 oz' }], instructions: 'Shake with ice, double strain.', glassware: 'Coupe', garnish: 'Brandied cherry' }
const drinkJson = JSON.stringify(drink)

describe('parseClaudeJson', () => {
  it('parses a bare JSON object', () => {
    expect(parseClaudeJson(`{"title":"T","intro":"I","drinks":[${drinkJson}]}`, MenuResponseSchema)).toEqual({ title: 'T', intro: 'I', drinks: [drink] })
  })
  it('strips code fences and surrounding prose', () => {
    const text = `Here you go:\n\`\`\`json\n{"title":"T","intro":"I","drinks":[${drinkJson}]}\n\`\`\`\nEnjoy.`
    expect(parseClaudeJson(text, MenuResponseSchema).title).toBe('T')
  })
  it('throws a clear error when the shape is wrong', () => {
    expect(() => parseClaudeJson('{"title":"T"}', MenuResponseSchema)).toThrow(/intro|drinks/)
  })
  it('picks the last fenced block when an earlier one is an example', () => {
    const text = `Example:\n\`\`\`json\n{"title":"EXAMPLE","intro":"x","drinks":[${drinkJson}]}\n\`\`\`\nReal one:\n\`\`\`json\n{"title":"Real","intro":"I","drinks":[${drinkJson}]}\n\`\`\`\n`
    expect(parseClaudeJson(text, MenuResponseSchema).title).toBe('Real')
  })
  it('ignores a stray brace in surrounding prose', () => {
    const text = `Sure { here you go: {"title":"T","intro":"I","drinks":[${drinkJson}]} cheers`
    expect(parseClaudeJson(text, MenuResponseSchema).title).toBe('T')
  })
  it('handles a closing brace inside a string value', () => {
    const text = `{"title":"Odd } name","intro":"I","drinks":[${drinkJson}]}`
    expect(parseClaudeJson(text, MenuResponseSchema).title).toBe('Odd } name')
  })
  it('throws No JSON object on truncated JSON', () => {
    expect(() => parseClaudeJson('{"title":"T","intro":', MenuResponseSchema)).toThrow(/No JSON object/)
  })
  it('parses when a stray trailing brace follows the real object', () => {
    const text = `{"title":"T","intro":"I","drinks":[${drinkJson}]} (that is the lot })`
    expect(parseClaudeJson(text, MenuResponseSchema).title).toBe('T')
  })
  it('tries the next candidate when the later one matches JSON but fails the schema', () => {
    const text = [
      '```json',
      `{"title":"Real","intro":"I","drinks":[${drinkJson}]}`,
      '```',
      'Shape:',
      '```json',
      '{"title": "string", "intro": "string", "drinks": []}',
      '```',
    ].join('\n')
    expect(parseClaudeJson(text, MenuResponseSchema).title).toBe('Real')
  })
})

describe('resolveMakeMe', () => {
  it('resolves to an existing menu drink', () => {
    expect(resolveMakeMe({ reply: 'Here.', menu_drink_id: '11111111-1111-4111-8111-111111111111', drink: null })).toEqual({ kind: 'menu', id: '11111111-1111-4111-8111-111111111111' })
  })
  it('resolves to a new drink', () => {
    expect(resolveMakeMe({ reply: 'Here.', menu_drink_id: null, drink })).toEqual({ kind: 'new', drink })
  })
  it('rejects both or neither', () => {
    expect(() => resolveMakeMe({ reply: 'x', menu_drink_id: '11111111-1111-4111-8111-111111111111', drink })).toThrow()
    expect(() => resolveMakeMe({ reply: 'x', menu_drink_id: null, drink: null })).toThrow()
  })
  it('MakeMeResponseSchema accepts a menu pick', () => {
    expect(MakeMeResponseSchema.safeParse({ reply: 'x', menu_drink_id: '11111111-1111-4111-8111-111111111111', drink: null }).success).toBe(true)
  })
})
