'use client'
import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useBarState } from './BarState'
import { useJob } from './useJob'
import { DrinkCard } from './DrinkCard'
import { DrinkDialog } from './DrinkDialog'
import { useDocked } from './useDocked'
import type { Drink } from '@/lib/types'
import { GUEST_TEXT_MAX } from '@/lib/constants'

type Served = { drink: Drink; onMenu: boolean }
const noteFor = (s: Served) => (s.onMenu ? "From tonight's menu." : 'Off the menu tonight.')

export function Counter() {
  const { authed, setRobot, setSpeech, busy } = useBarState()
  const { start, submitting } = useJob()
  const [ask, setAsk] = useState('')
  const [served, setServed] = useState<Served | null>(null)
  // Docked, the counter sits over the page, so a drink served inline would land behind it;
  // it comes up as a sheet instead.
  const docked = useDocked()

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!ask.trim()) return
    setServed(null)
    const result = await start('/api/make', { request: ask }, 'Coming up.')
    if (!result) return
    const r = result as { reply: string; drink: Drink; onMenu: boolean }
    setRobot('presenting')
    setSpeech(r.reply)
    setServed({ drink: r.drink, onMenu: r.onMenu })
    setAsk('')
  }

  if (!authed) {
    return (
      <section className="counter" aria-label="Order a drink">
        <p className="counter-label">
          The counter is for regulars. <Link href="/login" className="quiet-link not-italic text-base">Give the doorman the word.</Link>
        </p>
      </section>
    )
  }

  return (
    <section className="counter" aria-label="Order a drink">
      <form onSubmit={submit} className="counter-form">
        <label className="counter-label" htmlFor="ask">Make me a</label>
        <input
          id="ask"
          className="napkin-input counter-input"
          placeholder="something smoky, a Negroni, whatever you'd make"
          value={ask}
          onChange={(e) => setAsk(e.target.value)}
          maxLength={GUEST_TEXT_MAX}
          disabled={busy}
          autoComplete="off"
          autoCapitalize="none"
          enterKeyHint="send"
        />
        <button className="brass-button" type="submit" disabled={busy || !ask.trim()}>{submitting ? 'Mixing' : 'Pour'}</button>
      </form>
      {served && !docked && (
        <div className="counter-result">
          <DrinkCard drink={served.drink} note={noteFor(served)} />
        </div>
      )}
      {/* Undocking closes the sheet too; only a close while docked is the guest dismissing the drink. */}
      <DrinkDialog drink={served && docked ? served.drink : null} note={served ? noteFor(served) : undefined} onClose={() => { if (docked) setServed(null) }} />
    </section>
  )
}
