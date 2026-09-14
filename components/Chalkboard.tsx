'use client'
import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useBarState } from './BarState'
import { useJob } from './useJob'
import { DrinkDialog } from './DrinkDialog'
import type { Drink, Menu } from '@/lib/types'
import { GUEST_TEXT_MAX } from '@/lib/constants'

export function Chalkboard({ menu, drinks }: { menu: Menu | null; drinks: Drink[] }) {
  const router = useRouter()
  const { authed, setRobot, setSpeech, busy } = useBarState()
  const { start, submitting } = useJob()
  const [writing, setWriting] = useState(false)
  const [theme, setTheme] = useState('')
  const [open, setOpen] = useState<Drink | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const result = await start('/api/menu', { theme }, 'Give me a minute. Reading the shelf.')
    router.refresh()
    if (!result) return
    const saved = result as { menu: Menu; drinks: Drink[] }
    setRobot('presenting')
    setSpeech(saved.menu.intro)
    setWriting(false)
    setTheme('')
  }

  return (
    <section className="chalkboard" aria-label="Tonight's menu">
      {menu ? (
        <>
          <h2 className="chalk-title">{menu.title}</h2>
          <ul className="chalk-list">
            {drinks.map((d) => (
              <li key={d.id}>
                <button type="button" className="chalk-item" onClick={() => setOpen(d)}>{d.name}</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="chalk-empty">Nothing on the board yet.</p>
      )}

      {!authed ? (
        <Link href="/login" className="chalk-new">Give the doorman the word to write a menu</Link>
      ) : writing ? (
        <form onSubmit={submit} className="chalk-form">
          <input className="napkin-input w-full" placeholder="A theme, if you have one" value={theme} onChange={(e) => setTheme(e.target.value)} aria-label="Menu theme" maxLength={GUEST_TEXT_MAX} disabled={busy} />
          <div className="flex gap-3 items-center mt-2">
            <button className="brass-button" type="submit" disabled={busy}>{submitting ? 'Writing' : 'Write tonight\'s menu'}</button>
            {!busy && <button type="button" className="quiet-link" onClick={() => setWriting(false)}>Never mind</button>}
          </div>
        </form>
      ) : (
        <button type="button" className="chalk-new" onClick={() => setWriting(true)}>{menu ? 'New menu' : 'Write tonight\'s menu'}</button>
      )}

      <DrinkDialog drink={open} onClose={() => setOpen(null)} />
    </section>
  )
}
