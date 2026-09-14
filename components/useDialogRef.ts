'use client'
import { useEffect, useRef } from 'react'

// Keeps a native <dialog> in step with a boolean: showModal() when it opens, close() when it closes.
export function useDialogRef(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return ref
}
