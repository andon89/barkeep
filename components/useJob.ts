'use client'
import { useState } from 'react'
import { useBarState } from './BarState'
import { JOB_BUDGET_MS } from '@/lib/constants'

type JobResult = Record<string, unknown>

// Consecutive failed polls (network errors or 5xx) before giving up on the job.
const MAX_POLL_MISSES = 5

// Submits a job and polls it to completion, running the robot the whole way: mixing while it
// works, and back to idle with the error as its line if it fails. On success the caller gets
// the result and decides what the robot says next; on failure it gets null and is done.
export function useJob() {
  const { setRobot, setSpeech, setBusy } = useBarState()
  const [submitting, setSubmitting] = useState(false)

  async function start(url: string, body: JobResult, mixingLine: string): Promise<JobResult | null> {
    setBusy(true)
    setSubmitting(true)
    setRobot('mixing')
    setSpeech(mixingLine)
    try {
      const { result, error } = await run(url, body)
      if (result) return result
      setRobot('idle')
      setSpeech(error ?? 'Something went wrong.')
      return null
    } finally {
      setSubmitting(false)
      setBusy(false)
    }
  }

  return { start, submitting }
}

async function run(url: string, body: JobResult): Promise<{ result: JobResult | null; error: string | null }> {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.status !== 202) return { result: null, error: (await res.json().catch(() => ({}))).error ?? 'The bartender is not answering.' }
    const { jobId } = await res.json()
    const deadline = Date.now() + JOB_BUDGET_MS
    let misses = 0
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 2000))
      let poll: Response
      try {
        poll = await fetch(`/api/jobs/${jobId}`, { cache: 'no-store' })
      } catch {
        if (++misses >= MAX_POLL_MISSES) return { result: null, error: 'Lost the bartender. Try again.' }
        continue
      }
      // A 4xx will not fix itself (cookie gone, job missing); a run of 5xx will not either.
      if (poll.status >= 400 && poll.status < 500) return { result: null, error: (await poll.json().catch(() => ({}))).error ?? 'Lost the bartender. Try again.' }
      if (!poll.ok) {
        if (++misses >= MAX_POLL_MISSES) return { result: null, error: 'Lost the bartender. Try again.' }
        continue
      }
      misses = 0
      const job = await poll.json()
      if (job.status === 'done') return { result: job.result, error: null }
      if (job.status === 'failed') return { result: null, error: job.error ?? 'The bartender got stuck. Try again.' }
    }
    return { result: null, error: 'That took too long. Try again.' }
  } catch {
    return { result: null, error: 'Lost the bartender. Try again.' }
  }
}
