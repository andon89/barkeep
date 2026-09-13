import { describe, it, expect } from 'vitest'
import { SEED_BOTTLES } from './seed-bottles'
import { CATEGORIES, SHAPE_NAMES } from './types'

const HEX = /^#[0-9a-f]{6}$/

describe('SEED_BOTTLES', () => {
  it('has all 57 bottles from the PDF, in category counts', () => {
    expect(SEED_BOTTLES).toHaveLength(57)
    const counts = Object.fromEntries(CATEGORIES.map((c) => [c, SEED_BOTTLES.filter((b) => b.category === c).length]))
    expect(counts).toEqual({
      'Base Spirits': 9, Whiskey: 5, Rum: 7, 'Chartreuse Family': 5, 'Aperitifs & Vermouth': 5,
      'Amari & Digestifs': 7, 'Brandy & Pisco': 3, Liqueurs: 12, 'Bitters & Garnishes': 4,
    })
  })

  it('has unique names', () => {
    expect(new Set(SEED_BOTTLES.map((b) => b.name)).size).toBe(57)
  })

  it('has a valid style on every bottle', () => {
    for (const b of SEED_BOTTLES) {
      expect(SHAPE_NAMES, b.name).toContain(b.style.shape)
      for (const key of ['glass', 'liquid', 'label', 'accent'] as const) expect(b.style[key], `${b.name} ${key}`).toMatch(HEX)
      expect(b.style.labelText.length, b.name).toBeGreaterThan(0)
      expect(b.style.labelText.length, b.name).toBeLessThanOrEqual(16)
    }
  })

  it('keeps the PDF order within each category', () => {
    const base = SEED_BOTTLES.filter((b) => b.category === 'Base Spirits').map((b) => b.name)
    expect(base[0]).toBe("Hendrick's Flora & Fauna Gin")
    expect(base[8]).toBe('Recuerdo Mezcal')
  })
})
