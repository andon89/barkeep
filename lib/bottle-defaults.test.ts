import { describe, it, expect } from 'vitest'
import { defaultStyle, labelTextFor } from './bottle-defaults'

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
