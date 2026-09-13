import { describe, it, expect } from 'vitest'
import { buildInventoryBlock, buildMenuPrompt, buildMakeMePrompt, BARTENDER_SYSTEM } from './prompts'

const bottles = [
  { name: 'Campari', category: 'Aperitifs & Vermouth', in_stock: true },
  { name: 'Skyy Vodka', category: 'Base Spirits', in_stock: false },
] as const

describe('buildInventoryBlock', () => {
  it('lists only in-stock bottles with their category', () => {
    const block = buildInventoryBlock([...bottles])
    expect(block).toContain('Campari (Aperitifs & Vermouth)')
    expect(block).not.toContain('Skyy')
  })
})

describe('buildMenuPrompt', () => {
  it('includes the system rules, inventory, and the theme', () => {
    const p = buildMenuPrompt([...bottles], 'something bitter')
    expect(p).toContain(BARTENDER_SYSTEM)
    expect(p).toContain('Campari')
    expect(p).toContain('something bitter')
    expect(p).toContain('Respond with a single JSON object')
  })
  it('asks for a varied spread when there is no theme', () => {
    expect(buildMenuPrompt([...bottles], null)).toContain('No theme tonight')
  })
})

describe('buildMakeMePrompt', () => {
  it('lists menu drinks by id and includes the request', () => {
    const p = buildMakeMePrompt([...bottles], 'something with campari', [{ id: 'd1', name: 'Negroni', ingredients: [{ item: 'Campari', amount: '1 oz' }] }])
    expect(p).toContain('[d1] Negroni')
    expect(p).toContain('something with campari')
    expect(p).toContain('menu_drink_id')
  })
})
