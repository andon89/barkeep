'use client'
import { useState, FormEvent } from 'react'
import { useBarState } from './BarState'
import { useJob } from './useJob'
import { DrinkCard } from './DrinkCard'
import type { Drink } from '@/lib/types'

export function Counter() {
  const { setRobot, setSpeech, busy, setBusy } = useBarState()
  const { start, busy: submitting } = useJob()
  const [ask, setAsk] = useState('')
  const [served, setServed] = useState<{ drink: Drink; onMenu: boolean } | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!ask.trim()) return
    setBusy(true)
    setRobot('mixing')
    setSpeech('Coming up.')
    setServed(null)
    try {
      const { result, error } = await start('/api/make', { request: ask })
      if (error || !result) {
        setRobot('idle')
        setSpeech(error ?? 'Something went wrong.')
        return
      }
      const r = result as { reply: string; drink: Drink; onMenu: boolean }
      setRobot('presenting')
      setSpeech(r.reply)
      setServed({ drink: r.drink, onMenu: r.onMenu })
      setAsk('')
    } finally {
      setBusy(false)
    }
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
          maxLength={300}
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
