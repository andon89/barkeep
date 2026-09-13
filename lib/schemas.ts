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
export const MenuResponseSchema = z.object({ title: z.string().min(1), intro: z.string(), drinks: z.array(DrinkSchema).min(1) })
export const MakeMeResponseSchema = z.object({
  reply: z.string(),
  menu_drink_id: z.string().nullable(),
  drink: DrinkSchema.nullable(),
})

export type DrinkDraft = z.infer<typeof DrinkSchema>
export type MenuResponse = z.infer<typeof MenuResponseSchema>
export type MakeMeResponse = z.infer<typeof MakeMeResponseSchema>

// Marks, for every index in `s`, whether that character sits inside a JSON double-quoted
// string (so a brace there is string content, not structure). Scanned forward so backslash
// escapes resolve naturally.
function computeInStringMask(s: string): boolean[] {
  const mask = new Array<boolean>(s.length).fill(false)
  let inString = false
  let escaped = false
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (inString) {
      mask[i] = true
      if (escaped) {
        escaped = false
      } else if (c === '\\') {
        escaped = true
      } else if (c === '"') {
        inString = false
      }
    } else if (c === '"') {
      inString = true
    }
  }
  return mask
}

// Finds a balanced top-level `{...}` object in `s`. A naive approach anchors on the LAST
// unquoted `}` in the string, but a stray `}` appearing after the real object (e.g. trailing
// commentary like "(that is the lot })") would then fail to find any matching `{` at all.
// Instead this collects every unquoted closing brace, walks them from the end of the string
// backwards, and for each one attempts to find its matching `{` (tracking depth, ignoring
// braces inside strings) and JSON.parse the resulting span. The first span that both balances
// and parses as JSON wins.
function findLastBalancedObject(s: string): string | null {
  const mask = computeInStringMask(s)
  const closers: number[] = []
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '}' && !mask[i]) closers.push(i)
  }

  for (let k = closers.length - 1; k >= 0; k--) {
    const end = closers[k]
    let depth = 1
    let start = -1
    for (let j = end - 1; j >= 0; j--) {
      if (mask[j]) continue
      if (s[j] === '}') depth++
      else if (s[j] === '{') {
        depth--
        if (depth === 0) {
          start = j
          break
        }
      }
    }
    if (start === -1) continue
    const span = s.slice(start, end + 1)
    try {
      JSON.parse(span)
      return span
    } catch {
      continue
    }
  }
  return null
}

export function parseClaudeJson<T>(text: string, schema: z.ZodType<T>): T {
  const fencedBlocks = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/g)].map((m) => m[1])
  const candidates = [...fencedBlocks].reverse()
  candidates.push(text)

  let lastSchemaError: z.ZodError | null = null
  for (const candidate of candidates) {
    const objectText = findLastBalancedObject(candidate)
    if (objectText === null) continue

    let parsed: unknown
    try {
      parsed = JSON.parse(objectText)
    } catch {
      continue
    }

    const result = schema.safeParse(parsed)
    if (!result.success) {
      lastSchemaError = result.error
      continue
    }
    return result.data
  }
  if (lastSchemaError) {
    throw new Error(`Claude output did not match schema: ${lastSchemaError.issues.map((i) => i.path.join('.')).join(', ')}`)
  }
  throw new Error('No JSON object in Claude output')
}

export function resolveMakeMe(res: MakeMeResponse): { kind: 'menu'; id: string } | { kind: 'new'; drink: DrinkDraft } {
  if (res.menu_drink_id && !res.drink) return { kind: 'menu', id: res.menu_drink_id }
  if (!res.menu_drink_id && res.drink) return { kind: 'new', drink: res.drink }
  throw new Error('Make-me response must set exactly one of menu_drink_id or drink')
}
