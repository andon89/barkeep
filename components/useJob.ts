'use client'
import { useState } from 'react'

export type JobResult = Record<string, unknown>

export function useJob() {
  const [busy, setBusy] = useState(false)

  async function start(url: string, body: Record<string, unknown>): Promise<{ result: JobResult | null; error: string | null }> {
    setBusy(true)
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.status !== 202) return { result: null, error: (await res.json().catch(() => ({}))).error ?? 'The bartender is not answering.' }
      const { jobId } = await res.json()
      const deadline = Date.now() + 240_000
      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 2000))
        const poll = await fetch(`/api/jobs/${jobId}`, { cache: 'no-store' })
        if (!poll.ok) continue
        const job = await poll.json()
        if (job.status === 'done') return { result: job.result, error: null }
        if (job.status === 'failed') return { result: null, error: job.error ?? 'The bartender got stuck. Try again.' }
      }
      return { result: null, error: 'That took too long. Try again.' }
    } finally {
      setBusy(false)
    }
  }

  return { start, busy }
}
