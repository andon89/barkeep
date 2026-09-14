import { CATEGORIES, type Bottle, type BottleStyle, type Category } from './types'

const CATEGORY_DEFAULTS: Record<Category, Omit<BottleStyle, 'labelText'>> = {
  'Base Spirits':         { shape: 'tall',     glass: '#d9e4e2', liquid: '#eef2f0', label: '#f4f1e8', accent: '#2a1810' },
  'Whiskey':              { shape: 'standard', glass: '#d9e4e2', liquid: '#b8651b', label: '#2a1e14', accent: '#c9a24b' },
  'Rum':                  { shape: 'standard', glass: '#d9e4e2', liquid: '#c27a2a', label: '#f5e6c4', accent: '#8c1d2a' },
  'Chartreuse Family':    { shape: 'squat',    glass: '#d9e4e2', liquid: '#3e8e3a', label: '#f4efdd', accent: '#1f5a2a' },
  'Aperitifs & Vermouth': { shape: 'standard', glass: '#d9e4e2', liquid: '#b3402a', label: '#f4f1e8', accent: '#8c1d2a' },
  'Amari & Digestifs':    { shape: 'standard', glass: '#d9e4e2', liquid: '#3a2214', label: '#f2ead9', accent: '#1f4e8c' },
  'Brandy & Pisco':       { shape: 'standard', glass: '#d9e4e2', liquid: '#b8651b', label: '#1e1e1e', accent: '#c9a24b' },
  'Liqueurs':             { shape: 'tall',     glass: '#d9e4e2', liquid: '#e8b83a', label: '#f4efdd', accent: '#8c1d2a' },
  'Bitters & Garnishes':  { shape: 'dasher',   glass: '#d9e4e2', liquid: '#5a2a14', label: '#f4efdd', accent: '#e8b83a' },
}

export function labelTextFor(name: string): string {
  return (name.trim().split(/\s+/)[0] ?? '').toUpperCase().slice(0, 12)
}

export function defaultStyle(category: Category, name: string): BottleStyle {
  return { ...CATEGORY_DEFAULTS[category], labelText: labelTextFor(name) }
}

export function groupByCategory(bottles: Bottle[]): Record<Category, Bottle[]> {
  const groups = Object.fromEntries(CATEGORIES.map((c) => [c, [] as Bottle[]])) as Record<Category, Bottle[]>
  for (const b of bottles) groups[b.category]?.push(b)
  return groups
}

// Splits a category into rows of at most `max` bottles, as evenly as possible with the
// larger rows first. On a phone each row is its own full-width shelf; on a desktop the
// rows sit side by side, so a split is invisible there.
export function splitShelf<T>(items: T[], max: number): T[][] {
  const rows = Math.max(1, Math.ceil(items.length / max))
  const base = Math.floor(items.length / rows)
  const extra = items.length % rows
  const out: T[][] = []
  let i = 0
  for (let r = 0; r < rows; r++) {
    const size = base + (r < extra ? 1 : 0)
    out.push(items.slice(i, i + size))
    i += size
  }
  return out
}
