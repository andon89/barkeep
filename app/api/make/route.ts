import { NextRequest, NextResponse } from 'next/server'
import { runMakeJob, startJob } from '@/lib/jobs'
import { clampGuestText } from '@/lib/constants'

export const maxDuration = 300 // keep in step with JOB_BUDGET_MS

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const ask = clampGuestText(body.request)
  if (!ask) return NextResponse.json({ error: 'Tell the bartender what you want.' }, { status: 400 })
  const jobId = await startJob('make', { request: ask }, (id) => runMakeJob(id, ask))
  return NextResponse.json({ jobId }, { status: 202 })
}
