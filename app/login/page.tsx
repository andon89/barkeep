'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    })
    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError("That's not the word.")
      setBusy(false)
    }
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-4 bg-wall-deep">
      <h1 className="sign text-6xl sm:text-7xl mb-3">Barkeep</h1>
      <p className="text-cream-dim mb-8">Give the doorman the word.</p>
      <form onSubmit={submit} className="flex gap-2 w-full max-w-sm">
        <input
          className="napkin-input flex-1 min-w-0"
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          aria-label="Passcode"
          autoFocus
        />
        <button className="brass-button" type="submit" disabled={busy}>Come in</button>
      </form>
      {error && <p role="alert" className="mt-4 text-amber">{error}</p>}
    </main>
  )
}
