export async function createAuthTokenEdge(): Promise<string> {
  const secret = process.env.BARKEEP_PASSCODE
  if (!secret) throw new Error('BARKEEP_PASSCODE environment variable is not set')
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode('barkeep_auth'))
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, '0')).join('')
}
