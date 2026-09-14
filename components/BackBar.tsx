'use client'
import { useEffect, useMemo, useOptimistic, useRef, useState, useTransition } from 'react'
import { Bottle } from './Bottle'
import { toggleBottleAction } from '@/app/actions'
import { useBarState } from './BarState'
import { groupByCategory, splitShelf } from '@/lib/bottle-defaults'
import type { Bottle as BottleRow, Category } from '@/lib/types'

const SHELVES: Category[][] = [
  ['Base Spirits', 'Whiskey'],
  ['Rum', 'Brandy & Pisco', 'Chartreuse Family'],
  ['Aperitifs & Vermouth', 'Amari & Digestifs'],
  ['Liqueurs', 'Bitters & Garnishes'],
]

// Most bottles a phone can fit across one shelf at a tappable size; bigger categories split.
const MAX_PER_ROW = 7
const TOAST_MS = 1800

export function BackBar({ bottles }: { bottles: BottleRow[] }) {
  const { authed } = useBarState()
  const [optimistic, setOptimistic] = useOptimistic(bottles, (state, next: { id: string; in_stock: boolean }) =>
    state.map((b) => (b.id === next.id ? { ...b, in_stock: next.in_stock } : b)),
  )
  const [, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  // Hover tags do not exist on a phone, so every tap names the bottle in a short toast.
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const groups = useMemo(() => groupByCategory(optimistic), [optimistic])

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  function announce(text: string) {
    setToast(text)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS)
  }

  function tap(b: BottleRow) {
    if (!authed) {
      announce(`${b.name}, ${b.in_stock ? 'in stock' : 'out of stock'}`)
      return
    }
    setError(null)
    const next = !b.in_stock
    announce(`${b.name}, ${next ? 'back on the shelf' : 'marked out'}`)
    startTransition(async () => {
      setOptimistic({ id: b.id, in_stock: next })
      const { error } = await toggleBottleAction(b.id, next)
      if (error) setError(error)
    })
  }

  return (
    <div className="backbar">
      {SHELVES.map((cats) => (
        <div className="shelf" key={cats.join('|')}>
          {cats.map((cat) => {
            const rows = splitShelf(groups[cat], MAX_PER_ROW)
            return (
              <div className="shelf-cat" key={cat} style={{ '--n': Math.max(1, groups[cat].length) } as React.CSSProperties}>
                <div className="shelf-cat-rows">
                  {rows.map((row, i) => (
                    <div className="shelf-unit" key={i} style={{ '--n': Math.max(1, row.length) } as React.CSSProperties}>
                      <div className="shelf-bottles">
                        {row.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            className="bottle-btn"
                            data-out={!b.in_stock}
                            aria-pressed={b.in_stock}
                            aria-label={`${b.name}, ${b.in_stock ? 'in stock' : 'out of stock'}`}
                            onClick={() => tap(b)}
                            aria-disabled={!authed}
                          >
                            <Bottle style={b.style} height={116} />
                            <span className="bottle-tag">{b.name}</span>
                          </button>
                        ))}
                      </div>
                      <div className="shelf-board" />
                    </div>
                  ))}
                </div>
                <span className="placard">{cat}</span>
              </div>
            )
          })}
        </div>
      ))}
      {error && <p role="alert" className="shelf-error">{error}</p>}
      <p className="bottle-toast" role="status" aria-live="polite" data-show={toast !== null}>{toast}</p>
    </div>
  )
}
