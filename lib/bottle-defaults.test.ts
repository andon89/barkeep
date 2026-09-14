import { describe, it, expect } from 'vitest'
import { defaultStyle, groupByCategory, labelTextFor } from './bottle-defaults'
import type { Category } from './types'

describe('labelTextFor', () => {
  it('uses the first word, uppercased', () => {
    expect(labelTextFor("Angel's Envy Bourbon")).toBe("ANGEL'S")
    expect(labelTextFor('Campari')).toBe('CAMPARI')
  })
  it('caps at 12 characters', () => {
    expect(labelTextFor('Extraordinarily Long Gin')).toBe('EXTRAORDINAR')
  })
})

describe('defaultStyle', () => {
  it('picks a category-appropriate shape and fills labelText from the name', () => {
    expect(defaultStyle('Whiskey', 'Some Bourbon').shape).toBe('standard')
    expect(defaultStyle('Bitters & Garnishes', 'Mole Bitters').shape).toBe('dasher')
    expect(defaultStyle('Chartreuse Family', 'X').shape).toBe('squat')
    expect(defaultStyle('Liqueurs', 'Chambord').labelText).toBe('CHAMBORD')
  })
})

describe('groupByCategory', () => {
  it('returns every category, in shelf order, with its bottles', () => {
    const b = (name: string, category: Category) => ({ id: name, name, category, in_stock: true, style: defaultStyle(category, name), sort_order: 0, created_at: '' })
    const groups = groupByCategory([b('Campari', 'Aperitifs & Vermouth'), b('Rye', 'Whiskey'), b('Cocchi', 'Aperitifs & Vermouth')])
    expect(groups['Aperitifs & Vermouth'].map((x) => x.name)).toEqual(['Campari', 'Cocchi'])
    expect(groups['Whiskey'].map((x) => x.name)).toEqual(['Rye'])
    expect(groups['Rum']).toEqual([])
  })
})
