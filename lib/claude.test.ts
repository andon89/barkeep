import { describe, it, expect, vi } from 'vitest'
import { runClaude, type SandboxLike } from './claude'

function fakeSandbox(stdout: string, exitCode = 0): SandboxLike & { calls: string[][] } {
  const calls: string[][] = []
  return {
    calls,
    async runCommand(o) { calls.push([o.cmd, ...o.args]); return { exitCode, stdout: async () => stdout, stderr: async () => 'err' } },
    async snapshot() { return { snapshotId: 'snap-1' } },
    async stop() {},
  }
}

describe('runClaude', () => {
  it('boots from a saved snapshot and runs claude -p with the token', async () => {
    const sb = fakeSandbox('{"ok":true}')
    const createSandbox = vi.fn(async () => sb)
    const res = await runClaude('hello', {
      createSandbox, getSnapshotId: async () => 'snap-0', saveSnapshotId: vi.fn(), oauthToken: 'oauth-x',
    })
    expect(res.text).toBe('{"ok":true}')
    expect(createSandbox).toHaveBeenCalledWith(expect.objectContaining({ source: { type: 'snapshot', snapshotId: 'snap-0' } }))
    expect(sb.calls).toEqual([['claude', '-p', 'hello', '--dangerously-skip-permissions']])
  })

  it('installs the CLI on a fresh sandbox and saves a snapshot', async () => {
    const sb = fakeSandbox('text')
    const saveSnapshotId = vi.fn()
    await runClaude('p', { createSandbox: async () => sb, getSnapshotId: async () => null, saveSnapshotId, oauthToken: 't' })
    expect(sb.calls[0]).toEqual(['npm', 'install', '-g', '@anthropic-ai/claude-code'])
    expect(saveSnapshotId).toHaveBeenCalledWith('snap-1')
  })

  it('heals a stale snapshot by falling back to a fresh sandbox', async () => {
    const sb = fakeSandbox('text')
    const createSandbox = vi.fn().mockRejectedValueOnce(new Error('gone')).mockResolvedValueOnce(sb)
    const res = await runClaude('p', { createSandbox, getSnapshotId: async () => 'stale', saveSnapshotId: vi.fn(), oauthToken: 't' })
    expect(res.text).toBe('text')
    expect(createSandbox).toHaveBeenCalledTimes(2)
  })

  it('throws when claude exits non-zero', async () => {
    const sb = fakeSandbox('', 1)
    await expect(runClaude('p', { createSandbox: async () => sb, getSnapshotId: async () => 's', saveSnapshotId: vi.fn(), oauthToken: 't' })).rejects.toThrow(/claude exited 1/)
  })
})
