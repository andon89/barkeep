// Cross-layer constants. Anything the client, the API routes, and the sandbox runner
// all have to agree on lives here so they cannot drift apart.

// Longest guest-typed string we accept (theme or "make me a" request).
export const GUEST_TEXT_MAX = 300

// How long a job may take end to end. The API routes' `maxDuration = 300` must match
// (Next needs a literal there), the client polls until this deadline, and the sandbox
// is given slightly less so it dies before the function does.
export const JOB_BUDGET_MS = 300_000
export const SANDBOX_TIMEOUT_MS = JOB_BUDGET_MS - 20_000

export const BAR_TIME_ZONE = 'America/Los_Angeles'

export const AUTH_COOKIE = 'barkeep_auth'

// Trims and caps guest text; anything that is not a string becomes ''.
export function clampGuestText(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, GUEST_TEXT_MAX) : ''
}
