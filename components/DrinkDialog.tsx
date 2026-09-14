'use client'
import { DrinkCard } from './DrinkCard'
import { useDialogRef } from './useDialogRef'
import type { Drink } from '@/lib/types'

export function DrinkDialog({ drink, onClose }: { drink: Drink | null; onClose: () => void }) {
  const ref = useDialogRef(drink !== null)
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
