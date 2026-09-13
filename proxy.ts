import { NextRequest, NextResponse } from 'next/server'
import { createAuthTokenEdge } from '@/lib/auth-edge'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/_next') || pathname === '/api/auth') return NextResponse.next()

  const expectedToken = await createAuthTokenEdge()
  const isAuthed = request.cookies.get('barkeep_auth')?.value === expectedToken

  if (pathname.startsWith('/api/')) {
    return isAuthed ? NextResponse.next() : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (pathname === '/login') {
    return isAuthed ? NextResponse.redirect(new URL('/', request.url)) : NextResponse.next()
  }
  return isAuthed ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image).*)'],
}
