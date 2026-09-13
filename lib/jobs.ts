import 'server-only'
import { runClaude } from './claude'
import { parseClaudeJson, MenuResponseSchema } from './schemas'
import { buildMenuPrompt } from './prompts'
import { getBottles, createMenu, finishJob, failJob } from './data'

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
    await failJob(jobId, err instanceof Error ? err.message : 'The bartender got stuck. Try again.')
  }
}
