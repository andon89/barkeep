import { describe, it, expect, beforeEach } from 'vitest'
import { createAuthToken } from './auth'

describe('createAuthToken', () => {
  beforeEach(() => { process.env.BARKEEP_PASSCODE = 'test-word' })

  it('returns a stable 64-char hex token for the same passcode', () => {
    const a = createAuthToken()
    expect(a).toMatch(/^[0-9a-f]{64}$/)
    expect(createAuthToken()).toBe(a)
  })

  it('changes when the passcode changes', () => {
    const a = createAuthToken()
    process.env.BARKEEP_PASSCODE = 'other'
    expect(createAuthToken()).not.toBe(a)
  })

  it('throws when the passcode is unset', () => {
    delete process.env.BARKEEP_PASSCODE
    expect(() => createAuthToken()).toThrow('BARKEEP_PASSCODE')
  })
})
