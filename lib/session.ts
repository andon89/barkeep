import 'server-only'
import { cookies } from 'next/headers'
import { createAuthToken } from './auth'

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies()
  return jar.get('barkeep_auth')?.value === createAuthToken()
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) throw new Error('Give the doorman the word first.')
}
