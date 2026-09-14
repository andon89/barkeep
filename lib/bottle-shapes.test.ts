import { describe, it, expect } from 'vitest'
import { SHAPES } from './bottle-shapes'
import { SHAPE_NAMES } from './types'

describe('SHAPES', () => {
  it('defines every shape with geometry inside the 60x160 viewBox', () => {
    for (const name of SHAPE_NAMES) {
      const spec = SHAPES[name]
      expect(spec.path, name).toMatch(/^M/)
      expect(spec.path, name).toMatch(/Z$/)
      for (const box of [spec.cap, spec.label]) {
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.w).toBeLessThanOrEqual(60)
        expect(box.y).toBeGreaterThanOrEqual(0)
        expect(box.y + box.h).toBeLessThanOrEqual(160)
      }
      expect(spec.fillTop).toBeGreaterThan(0)
      expect(spec.fillTop).toBeLessThan(160)
    }
  })
})
