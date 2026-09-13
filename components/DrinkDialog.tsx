'use client'
import { useEffect, useRef } from 'react'
import { DrinkCard } from './DrinkCard'
import type { Drink } from '@/lib/types'

export function DrinkDialog({ drink, onClose }: { drink: Drink | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (drink && !d.open) d.showModal()
    if (!drink && d.open) d.close()
  }, [drink])
  return (
    <dialog ref={ref} className="drink-dialog" onClose={onClose}>
      {drink && (
        <div className="drink-dialog-inner">
          <DrinkCard drink={drink} />
          <button type="button" className="quiet-link" onClick={onClose}>Close</button>
        </div>
      )}
    </dialog>
  )
}
