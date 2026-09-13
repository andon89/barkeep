import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { createJob } from '@/lib/data'
import { runMakeJob } from '@/lib/jobs'

export const maxDuration = 300

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const ask = typeof body.request === 'string' ? body.request.trim().slice(0, 300) : ''
  if (!ask) return NextResponse.json({ error: 'Tell the bartender what you want.' }, { status: 400 })
  const job = await createJob('make', { request: ask })
  waitUntil(runMakeJob(job.id, ask))
  return NextResponse.json({ jobId: job.id }, { status: 202 })
}
