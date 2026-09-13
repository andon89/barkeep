import type { Shape } from './types'

export interface Box { x: number; y: number; w: number; h: number }
export interface ShapeSpec { path: string; cap: Box; label: Box; fillTop: number }

export const SHAPES: Record<Shape, ShapeSpec> = {
  tall:       { path: 'M24 6 H36 V40 Q36 48 48 54 V156 Q48 160 44 160 H16 Q12 160 12 156 V54 Q24 48 24 40 Z', cap: { x: 22, y: 4, w: 16, h: 10 }, label: { x: 15, y: 78, w: 30, h: 44 }, fillTop: 30 },
  standard:   { path: 'M23 8 H37 V34 Q37 42 51 48 V156 Q51 160 47 160 H13 Q9 160 9 156 V48 Q23 42 23 34 Z', cap: { x: 21, y: 6, w: 18, h: 10 }, label: { x: 13, y: 74, w: 34, h: 48 }, fillTop: 28 },
  squat:      { path: 'M24 22 H36 V48 Q36 56 56 66 V156 Q56 160 52 160 H8 Q4 160 4 156 V66 Q24 56 24 48 Z', cap: { x: 22, y: 20, w: 16, h: 10 }, label: { x: 10, y: 88, w: 40, h: 42 }, fillTop: 40 },
  square:     { path: 'M24 10 H36 V32 L52 38 V160 H8 V38 L24 32 Z', cap: { x: 22, y: 8, w: 16, h: 10 }, label: { x: 13, y: 70, w: 34, h: 50 }, fillTop: 26 },
  flask:      { path: 'M24 8 H36 V36 Q54 44 54 100 V156 Q54 160 50 160 H10 Q6 160 6 156 V100 Q6 44 24 36 Z', cap: { x: 22, y: 6, w: 16, h: 10 }, label: { x: 12, y: 80, w: 36, h: 46 }, fillTop: 30 },
  apothecary: { path: 'M20 12 H40 V30 Q54 34 54 60 V156 Q54 160 50 160 H10 Q6 160 6 156 V60 Q6 34 20 30 Z', cap: { x: 18, y: 8, w: 24, h: 12 }, label: { x: 12, y: 76, w: 36, h: 48 }, fillTop: 26 },
  decanter:   { path: 'M26 4 H34 V50 Q56 60 56 110 V156 Q56 160 52 160 H8 Q4 160 4 156 V110 Q4 60 26 50 Z', cap: { x: 24, y: 2, w: 12, h: 10 }, label: { x: 14, y: 96, w: 32, h: 40 }, fillTop: 40 },
  dasher:     { path: 'M26 70 H34 V86 Q44 90 44 104 V156 Q44 160 40 160 H20 Q16 160 16 156 V104 Q16 90 26 86 Z', cap: { x: 24, y: 66, w: 12, h: 10 }, label: { x: 12, y: 100, w: 36, h: 46 }, fillTop: 84 },
  jar:        { path: 'M8 94 H52 V156 Q52 160 48 160 H12 Q8 160 8 156 Z', cap: { x: 6, y: 86, w: 48, h: 10 }, label: { x: 12, y: 112, w: 36, h: 32 }, fillTop: 94 },
}
