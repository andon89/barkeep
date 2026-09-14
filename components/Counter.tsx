'use client'
import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useBarState } from './BarState'
import { useJob } from './useJob'
import { DrinkCard } from './DrinkCard'
import type { Drink } from '@/lib/types'
import { GUEST_TEXT_MAX } from '@/lib/constants'

export function Counter() {
  const { authed, setRobot, setSpeech, busy } = useBarState()
  const { start, submitting } = useJob()
  const [ask, setAsk] = useState('')
  const [served, setServed] = useState<{ drink: Drink; onMenu: boolean } | null>(null)

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
          className="napkin-input flex-1 min-w-0"
          placeholder="something smoky, a Negroni, whatever you'd make"
          value={ask}
          onChange={(e) => setAsk(e.target.value)}
          maxLength={GUEST_TEXT_MAX}
          disabled={busy}
        />
        <button className="brass-button" type="submit" disabled={busy || !ask.trim()}>{submitting ? 'Mixing' : 'Pour'}</button>
      </form>
      {served && (
        <div className="counter-result">
          <DrinkCard drink={served.drink} note={served.onMenu ? "From tonight's menu." : 'Off the menu tonight.'} />
        </div>
      )}
    </section>
  )
}
