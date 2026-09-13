import 'server-only'
import { runClaude } from './claude'
import { parseClaudeJson, MenuResponseSchema, MakeMeResponseSchema, resolveMakeMe } from './schemas'
import { buildMenuPrompt, buildMakeMePrompt } from './prompts'
import { getBottles, getActiveMenu, createMenu, getDrink, saveOffMenuDrink, finishJob, failJob } from './data'

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
      await failJob(jobId, err instanceof Error ? err.message : 'The bartender got stuck. Try again.')
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
      const drink = menuDrinks.find((d) => d.id === resolved.id) ?? (await getDrink(resolved.id))
      if (!drink) throw new Error('The bartender pointed at a drink that is not on the board.')
      await finishJob(jobId, { reply: parsed.reply, drink, onMenu: true })
    } else {
      const drink = await saveOffMenuDrink(resolved.drink, request)
      await finishJob(jobId, { reply: parsed.reply, drink, onMenu: false })
    }
  } catch (err) {
    console.error('make job failed', jobId, err)
    try {
      await failJob(jobId, err instanceof Error ? err.message : 'The bartender got stuck. Try again.')
    } catch (failErr) {
      console.error('failed to record make job failure', jobId, failErr)
    }
  }
}
