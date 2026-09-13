import { Sandbox } from '@vercel/sandbox'
import { supabase } from './supabase'

const SNAPSHOT_KEY = 'sandbox_snapshot_id'
const SANDBOX_TIMEOUT_MS = 280_000

export type SandboxLike = {
  runCommand(o: { cmd: string; args: string[]; env?: Record<string, string>; sudo?: boolean }): Promise<{ exitCode: number; stdout(): Promise<string>; stderr(): Promise<string> }>
  snapshot(): Promise<{ snapshotId: string }>
  stop(): Promise<void>
}

export type Deps = {
  createSandbox(opts: object): Promise<SandboxLike>
  getSnapshotId(): Promise<string | null>
  saveSnapshotId(id: string): Promise<void>
  oauthToken: string
}

function realCreateSandbox(opts: object): Promise<SandboxLike> {
  return Sandbox.create(opts as Parameters<typeof Sandbox.create>[0]) as unknown as Promise<SandboxLike>
}

let cachedSnapshotId: string | null = null
async function realGetSnapshotId(): Promise<string | null> {
  if (cachedSnapshotId) return cachedSnapshotId
  const { data } = await supabase.from('barkeep_meta').select('value').eq('key', SNAPSHOT_KEY).maybeSingle()
  cachedSnapshotId = data?.value ?? null
  return cachedSnapshotId
}
async function realSaveSnapshotId(id: string): Promise<void> {
  await supabase.from('barkeep_meta').upsert({ key: SNAPSHOT_KEY, value: id, updated_at: new Date().toISOString() })
  cachedSnapshotId = id
}
function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`${name} is not set`)
  return v
}

export async function runClaude(prompt: string, overrides: Partial<Deps> = {}): Promise<{ text: string; timings: Record<string, number> }> {
  const deps: Deps = {
    createSandbox: overrides.createSandbox ?? realCreateSandbox,
    getSnapshotId: overrides.getSnapshotId ?? realGetSnapshotId,
    saveSnapshotId: overrides.saveSnapshotId ?? realSaveSnapshotId,
    oauthToken: overrides.oauthToken ?? requireEnv('CLAUDE_CODE_OAUTH_TOKEN'),
  }
  const timings: Record<string, number> = {}

  let sandbox: SandboxLike | undefined
  let fresh = false
  const snapshotId = await deps.getSnapshotId()
  let t = Date.now()
  if (snapshotId) {
    try {
      sandbox = await deps.createSandbox({ source: { type: 'snapshot', snapshotId }, timeout: SANDBOX_TIMEOUT_MS })
    } catch {
      sandbox = undefined
    }
  }
  if (!sandbox) {
    fresh = true
    sandbox = await deps.createSandbox({ runtime: 'node24', timeout: SANDBOX_TIMEOUT_MS })
  }
  timings.createMs = Date.now() - t

  try {
    if (fresh) {
      t = Date.now()
      const install = await sandbox.runCommand({ cmd: 'npm', args: ['install', '-g', '@anthropic-ai/claude-code'], sudo: true })
      timings.installMs = Date.now() - t
      if (install.exitCode !== 0) throw new Error(`CLI install failed: ${(await install.stderr()).slice(-500)}`)
    }

    t = Date.now()
    const run = await sandbox.runCommand({
      cmd: 'claude',
      args: ['-p', prompt, '--dangerously-skip-permissions'],
      env: { CLAUDE_CODE_OAUTH_TOKEN: deps.oauthToken, TZ: 'America/Los_Angeles' },
    })
    timings.runMs = Date.now() - t
    if (run.exitCode !== 0) throw new Error(`claude exited ${run.exitCode}: ${(await run.stderr()).slice(-500)}`)
    const text = (await run.stdout()).trim()

    if (fresh) {
      try {
        const snap = await sandbox.snapshot()
        await deps.saveSnapshotId(snap.snapshotId)
      } catch { /* next run self-heals */ }
    }
    return { text, timings }
  } finally {
    try { await sandbox.stop() } catch { /* already stopped */ }
  }
}
