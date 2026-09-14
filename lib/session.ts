import 'server-only'
import { cookies } from 'next/headers'
import { createAuthToken } from './auth'
import { AUTH_COOKIE } from './constants'

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies()
  return jar.get(AUTH_COOKIE)?.value === createAuthToken()
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) throw new Error('Give the doorman the word first.')
}
