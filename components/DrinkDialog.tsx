'use client'
import { DrinkCard } from './DrinkCard'
import { useDialogRef } from './useDialogRef'
import type { Drink } from '@/lib/types'

export function DrinkDialog({ drink, note, onClose }: { drink: Drink | null; note?: string; onClose: () => void }) {
  const ref = useDialogRef(drink !== null)
  return (
    <dialog ref={ref} className="drink-dialog" onClose={onClose}>
      {drink && (
        <div className="drink-dialog-inner">
          <DrinkCard drink={drink} note={note} />
          <button type="button" className="quiet-link" onClick={onClose}>Close</button>
        </div>
      )}
    </dialog>
  )
}
