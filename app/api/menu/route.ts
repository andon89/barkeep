import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { createJob } from '@/lib/data'
import { runMenuJob } from '@/lib/jobs'

export const maxDuration = 300

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const theme = typeof body.theme === 'string' && body.theme.trim() ? body.theme.trim().slice(0, 300) : null
  const job = await createJob('menu', { theme })
  waitUntil(runMenuJob(job.id, theme))
  return NextResponse.json({ jobId: job.id }, { status: 202 })
}
