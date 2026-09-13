import crypto from 'crypto'

export function createAuthToken(): string {
  const secret = process.env.BARKEEP_PASSCODE
  if (!secret) throw new Error('BARKEEP_PASSCODE environment variable is not set')
  return crypto.createHmac('sha256', secret).update('barkeep_auth').digest('hex')
}
