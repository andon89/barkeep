export const CATEGORIES = [
  'Base Spirits',
  'Whiskey',
  'Rum',
  'Chartreuse Family',
  'Aperitifs & Vermouth',
  'Amari & Digestifs',
  'Brandy & Pisco',
  'Liqueurs',
  'Bitters & Garnishes',
] as const
export type Category = (typeof CATEGORIES)[number]

export const SHAPE_NAMES = ['tall', 'standard', 'squat', 'square', 'flask', 'apothecary', 'decanter', 'dasher', 'jar'] as const
export type Shape = (typeof SHAPE_NAMES)[number]

export interface BottleStyle {
  shape: Shape
  glass: string      // hex, glass tint
  liquid: string     // hex, fill colour
  label: string      // hex, label background
  labelText: string  // short text painted on the label
  accent: string     // hex, cap + label text
}

export interface Bottle {
  id: string
  name: string
  category: Category
  in_stock: boolean
  style: BottleStyle
  sort_order: number
  created_at: string
}

export interface Ingredient { item: string; amount: string }

export interface Drink {
  id: string
  menu_id: string | null
  name: string
  description: string
  ingredients: Ingredient[]
  instructions: string
  glassware: string
  garnish: string
  source_prompt: string | null
  sort_order: number
  created_at: string
}

export interface Menu {
  id: string
  title: string
  intro: string
  prompt: string | null
  is_active: boolean
  created_at: string
}

export type JobKind = 'menu' | 'make'
export type JobStatus = 'pending' | 'done' | 'failed'
export interface Job {
  id: string
  kind: JobKind
  input: Record<string, unknown>
  status: JobStatus
  result: Record<string, unknown> | null
  error: string | null
  created_at: string
}
