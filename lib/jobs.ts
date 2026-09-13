import 'server-only'
import { runClaude } from './claude'
import { parseClaudeJson, MenuResponseSchema, MakeMeResponseSchema, resolveMakeMe } from './schemas'
import { buildMenuPrompt, buildMakeMePrompt } from './prompts'
import { getBottles, getActiveMenu, createMenu, getDrink, saveOffMenuDrink, finishJob, failJob } from './data'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function userMessage(err: unknown): string {
  if (err instanceof Error) {
    const m = err.message
    if (m.startsWith('Nothing on the shelf') || m.includes('not on the board') || m.includes('did not match schema') || m === 'No JSON object in Claude output') {
      return m
    }
  }
  return 'The bartender got stuck. Try again.'
}

export async function runMenuJob(jobId: string, theme: string | null): Promise<void> {
  try {
    const bottles = (await getBottles()).filter((b) => b.in_stock)
    if (bottles.length === 0) throw new Error('Nothing on the shelf. Put some bottles back in stock first.')
    const { text } = await runClaude(buildMenuPrompt(bottles, theme))
    const parsed = parseClaudeJson(text, MenuResponseSchema)
    const saved = await createMenu({ ...parsed, prompt: theme })
    await finishJob(jobId, saved)
  } catch (err) {
    console.error('menu job failed', jobId, err)
    try {
      await failJob(jobId, userMessage(err))
    } catch (failErr) {
      console.error('failed to record menu job failure', jobId, failErr)
    }
  }
}

export async function runMakeJob(jobId: string, request: string): Promise<void> {
  try {
    const [bottles, active] = await Promise.all([getBottles(), getActiveMenu()])
    const inStock = bottles.filter((b) => b.in_stock)
    if (inStock.length === 0) throw new Error('Nothing on the shelf. Put some bottles back in stock first.')
    const menuDrinks = active?.drinks ?? []
    const { text } = await runClaude(buildMakeMePrompt(inStock, request, menuDrinks))
    const parsed = parseClaudeJson(text, MakeMeResponseSchema)
    const resolved = resolveMakeMe(parsed)
    if (resolved.kind === 'menu') {
      const onMenu = menuDrinks.find((d) => d.id === resolved.id)
      const drink = onMenu ?? (UUID_RE.test(resolved.id) ? await getDrink(resolved.id) : null)
      if (!drink) throw new Error('The bartender pointed at a drink that is not on the board.')
      await finishJob(jobId, { reply: parsed.reply, drink, onMenu: Boolean(onMenu) })
    } else {
      const drink = await saveOffMenuDrink(resolved.drink, request)
      await finishJob(jobId, { reply: parsed.reply, drink, onMenu: false })
    }
  } catch (err) {
    console.error('make job failed', jobId, err)
    try {
      await failJob(jobId, userMessage(err))
    } catch (failErr) {
      console.error('failed to record make job failure', jobId, failErr)
    }
  }
}
