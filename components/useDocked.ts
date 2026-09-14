'use client'
import { useSyncExternalStore } from 'react'

// Whether the counter is docked to the bottom of the screen. The breakpoint lives only in
// globals.css, whose phone block sets --docked; this reads it back so JS never repeats the width.
const subscribe = (onChange: () => void) => {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}
const read = () => getComputedStyle(document.documentElement).getPropertyValue('--docked').trim() === '1'

export const useDocked = () => useSyncExternalStore(subscribe, read, () => false)
