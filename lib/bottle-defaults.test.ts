import { describe, it, expect } from 'vitest'
import { defaultStyle, groupByCategory, labelTextFor, splitShelf } from './bottle-defaults'
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

describe('splitShelf', () => {
  it('leaves a category that fits alone', () => {
    expect(splitShelf([1, 2, 3, 4, 5, 6, 7], 7)).toEqual([[1, 2, 3, 4, 5, 6, 7]])
    expect(splitShelf([], 7)).toEqual([[]])
  })
  it('splits an overfull category into balanced rows, larger rows first', () => {
    expect(splitShelf([1, 2, 3, 4, 5, 6, 7, 8, 9], 7)).toEqual([[1, 2, 3, 4, 5], [6, 7, 8, 9]])
    expect(splitShelf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 7)).toEqual([[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12]])
    expect(splitShelf(Array.from({ length: 16 }, (_, i) => i), 7)).toEqual([[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15]])
  })
})
