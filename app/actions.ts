'use server'
import { revalidatePath } from 'next/cache'
import { addBottle, removeBottle, setBottleStock } from '@/lib/data'
import { isAuthed } from '@/lib/session'
import { labelTextFor } from '@/lib/bottle-defaults'
import { NewBottleSchema } from '@/lib/schemas'
import type { BottleStyle, Category } from '@/lib/types'

// Actions return { error } rather than throwing: in production Next.js replaces the message
// of any error thrown from a server action with a generic one, so a thrown message never
// reaches the guest.
type ActionResult = { error: string | null }

const DOORMAN = 'Give the doorman the word first.'

async function guarded(work: () => Promise<unknown>, failure: string): Promise<ActionResult> {
  if (!(await isAuthed())) return { error: DOORMAN }
  try {
    await work()
    revalidatePath('/')
    return { error: null }
  } catch (err) {
    console.error(failure, err)
    return { error: failure }
  }
}

export async function toggleBottleAction(id: string, inStock: boolean): Promise<ActionResult> {
  return guarded(() => setBottleStock(id, inStock), "Couldn't update the shelf. Try again.")
}

export async function addBottleAction(input: { name: string; category: Category; style: BottleStyle }): Promise<ActionResult> {
  const parsed = NewBottleSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'That bottle does not look right.' }
  const { name, category, style } = parsed.data
  return guarded(
    () => addBottle({ name, category, style: { ...style, labelText: style.labelText || labelTextFor(name) } }),
    "Couldn't add that bottle. Try again.",
  )
}

export async function removeBottleAction(id: string): Promise<ActionResult> {
  return guarded(() => removeBottle(id), "Couldn't remove that bottle. Try again.")
}
