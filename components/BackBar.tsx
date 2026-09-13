'use client'
import { useOptimistic, useState, useTransition } from 'react'
import { Bottle } from './Bottle'
import { toggleBottleAction } from '@/app/actions'
import type { Bottle as BottleRow, Category } from '@/lib/types'

const SHELVES: Category[][] = [
  ['Base Spirits', 'Whiskey'],
  ['Rum', 'Brandy & Pisco', 'Chartreuse Family'],
  ['Aperitifs & Vermouth', 'Amari & Digestifs'],
  ['Liqueurs', 'Bitters & Garnishes'],
]

export function BackBar({ bottles }: { bottles: BottleRow[] }) {
  const [optimistic, setOptimistic] = useOptimistic(bottles, (state, next: { id: string; in_stock: boolean }) =>
    state.map((b) => (b.id === next.id ? { ...b, in_stock: next.in_stock } : b)),
  )
  const [, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function toggle(b: BottleRow) {
    setError(null)
    startTransition(async () => {
      setOptimistic({ id: b.id, in_stock: !b.in_stock })
      try {
        await toggleBottleAction(b.id, !b.in_stock)
      } catch {
        setError("Couldn't update the shelf. Try again.")
      }
    })
  }

  return (
    <div className="backbar">
      {SHELVES.map((cats) => (
        <div className="shelf" key={cats.join('|')}>
          <div className="shelf-row">
            {cats.map((cat) => (
              <div className="shelf-group" key={cat} style={{ flexGrow: Math.max(1, optimistic.filter((b) => b.category === cat).length) }}>
                <div className="shelf-bottles">
                  {optimistic.filter((b) => b.category === cat).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className="bottle-btn"
                      data-out={!b.in_stock}
                      aria-pressed={b.in_stock}
                      aria-label={`${b.name}, ${b.in_stock ? 'in stock' : 'out of stock'}`}
                      onClick={() => toggle(b)}
                    >
                      <Bottle style={b.style} height={116} />
                      <span className="bottle-tag">{b.name}</span>
                    </button>
                  ))}
                </div>
                <span className="placard">{cat}</span>
              </div>
            ))}
          </div>
          <div className="shelf-board" />
        </div>
      ))}
      {error && <p role="alert" className="shelf-error">{error}</p>}
    </div>
  )
}
