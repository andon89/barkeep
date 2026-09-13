import { z } from 'zod'

export const IngredientSchema = z.object({ item: z.string(), amount: z.string() })
export const DrinkSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  ingredients: z.array(IngredientSchema).min(1),
  instructions: z.string(),
  glassware: z.string(),
  garnish: z.string(),
})
export const MenuResponseSchema = z.object({ title: z.string().min(1), intro: z.string(), drinks: z.array(DrinkSchema) })
export const MakeMeResponseSchema = z.object({
  reply: z.string(),
  menu_drink_id: z.string().nullable(),
  drink: DrinkSchema.nullable(),
})

export type DrinkDraft = z.infer<typeof DrinkSchema>
export type MenuResponse = z.infer<typeof MenuResponseSchema>
export type MakeMeResponse = z.infer<typeof MakeMeResponseSchema>

export function parseClaudeJson<T>(text: string, schema: z.ZodType<T>): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  let candidate = fenced ? fenced[1] : text
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object in Claude output')
  candidate = candidate.slice(start, end + 1)
  const result = schema.safeParse(JSON.parse(candidate))
  if (!result.success) throw new Error(`Claude output did not match schema: ${result.error.issues.map((i) => i.path.join('.')).join(', ')}`)
  return result.data
}

export function resolveMakeMe(res: MakeMeResponse): { kind: 'menu'; id: string } | { kind: 'new'; drink: DrinkDraft } {
  if (res.menu_drink_id && !res.drink) return { kind: 'menu', id: res.menu_drink_id }
  if (!res.menu_drink_id && res.drink) return { kind: 'new', drink: res.drink }
  throw new Error('Make-me response must set exactly one of menu_drink_id or drink')
}
