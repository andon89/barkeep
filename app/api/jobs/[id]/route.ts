import { NextResponse } from 'next/server'
import { getJob } from '@/lib/data'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await getJob(id)
  if (!job) return NextResponse.json({ error: 'No such job' }, { status: 404 })
  return NextResponse.json({ status: job.status, result: job.result, error: job.error })
}
