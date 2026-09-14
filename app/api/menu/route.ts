import { NextRequest, NextResponse } from 'next/server'
import { runMenuJob, startJob } from '@/lib/jobs'
import { clampGuestText } from '@/lib/constants'

export const maxDuration = 300 // keep in step with JOB_BUDGET_MS

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const theme = clampGuestText(body.theme) || null
  const jobId = await startJob('menu', { theme }, (id) => runMenuJob(id, theme))
  return NextResponse.json({ jobId }, { status: 202 })
}
