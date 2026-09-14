import { NextRequest, NextResponse } from 'next/server'
import { createAuthTokenEdge } from '@/lib/auth-edge'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/_next') || pathname === '/api/auth') return NextResponse.next()

  const expectedToken = await createAuthTokenEdge()
  const isAuthed = request.cookies.get('barkeep_auth')?.value === expectedToken

  if (pathname.startsWith('/api/')) {
    return isAuthed ? NextResponse.next() : NextResponse.json({ error: 'Give the doorman the word first.' }, { status: 401 })
  }
  if (pathname === '/login' && isAuthed) return NextResponse.redirect(new URL('/', request.url))
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image).*)'],
}
