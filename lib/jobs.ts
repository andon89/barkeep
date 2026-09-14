import 'server-only'
import { waitUntil } from '@vercel/functions'
import { runClaude } from './claude'
import { parseClaudeJson, MenuResponseSchema, MakeMeResponseSchema, resolveMakeMe } from './schemas'
import { buildMenuPrompt, buildMakeMePrompt } from './prompts'
import { getBottles, getActiveMenu, createMenu, createJob, getDrink, saveOffMenuDrink, finishJob, failJob } from './data'
import { BarkeepError } from './errors'
import type { Bottle, JobKind } from './types'

type JobResult = Record<string, unknown>

// Inserts the job row, kicks the work off under waitUntil, and hands back the id for the
// 202 response. The route only has to validate its input.
export async function startJob(kind: JobKind, input: JobResult, run: (jobId: string) => Promise<void>): Promise<string> {
  const job = await createJob(kind, input)
  waitUntil(run(job.id))
  return job.id
}

// Owns the job lifecycle: whatever `work` returns is the result, whatever it throws is
// recorded on the row (verbatim for BarkeepError, a generic line for anything else).
async function runJob(jobId: string, kind: JobKind, work: () => Promise<JobResult>): Promise<void> {
  try {
    await finishJob(jobId, await work())
  } catch (err) {
    console.error(`${kind} job failed`, jobId, err)
    const message = err instanceof BarkeepError ? err.message : 'The bartender got stuck. Try again.'
    try {
      await failJob(jobId, message)
    } catch (failErr) {
      console.error(`failed to record ${kind} job failure`, jobId, failErr)
    }
  }
}

function inStockOrThrow(bottles: Bottle[]): Bottle[] {
  const inStock = bottles.filter((b) => b.in_stock)
  if (inStock.length === 0) throw new BarkeepError('Nothing on the shelf. Put some bottles back in stock first.')
  return inStock
}

export function runMenuJob(jobId: string, theme: string | null): Promise<void> {
  return runJob(jobId, 'menu', async () => {
    const bottles = inStockOrThrow(await getBottles())
    const parsed = parseClaudeJson(await runClaude(buildMenuPrompt(bottles, theme)), MenuResponseSchema)
    return createMenu({ ...parsed, prompt: theme })
  })
}

export function runMakeJob(jobId: string, request: string): Promise<void> {
  return runJob(jobId, 'make', async () => {
    const [bottles, active] = await Promise.all([getBottles(), getActiveMenu()])
    const inStock = inStockOrThrow(bottles)
    const menuDrinks = active?.drinks ?? []
    const parsed = parseClaudeJson(await runClaude(buildMakeMePrompt(inStock, request, menuDrinks)), MakeMeResponseSchema)
    const resolved = resolveMakeMe(parsed)
    if (resolved.kind === 'new') {
      return { reply: parsed.reply, drink: await saveOffMenuDrink(resolved.drink, request), onMenu: false }
    }
    const onMenu = menuDrinks.find((d) => d.id === resolved.id)
    const drink = onMenu ?? (await getDrink(resolved.id))
    if (!drink) throw new BarkeepError('The bartender pointed at a drink that is not on the board.')
    return { reply: parsed.reply, drink, onMenu: Boolean(onMenu) }
  })
}
