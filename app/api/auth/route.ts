import { NextRequest, NextResponse } from 'next/server'
import { createAuthToken } from '@/lib/auth'
import { AUTH_COOKIE } from '@/lib/constants'

export async function POST(request: NextRequest) {
  const { passcode } = await request.json().catch(() => ({}))
  if (passcode === process.env.BARKEEP_PASSCODE) {
    const response = NextResponse.json({ success: true })
    response.cookies.set(AUTH_COOKIE, createAuthToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
    return response
  }
  return NextResponse.json({ success: false, error: 'Invalid passcode' }, { status: 401 })
}
