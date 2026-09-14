'use server'
import { revalidatePath } from 'next/cache'
import { addBottle, removeBottle, setBottleStock } from '@/lib/data'
import { requireAuth } from '@/lib/session'
import { labelTextFor } from '@/lib/bottle-defaults'
import { NewBottleSchema } from '@/lib/schemas'
import type { BottleStyle, Category } from '@/lib/types'

export async function toggleBottleAction(id: string, inStock: boolean) {
  await requireAuth()
  await setBottleStock(id, inStock)
  revalidatePath('/')
}

export async function addBottleAction(input: { name: string; category: Category; style: BottleStyle }) {
  await requireAuth()
  const parsed = NewBottleSchema.safeParse(input)
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'That bottle does not look right.')
  const { name, category, style } = parsed.data
  await addBottle({ name, category, style: { ...style, labelText: style.labelText || labelTextFor(name) } })
  revalidatePath('/')
}

export async function removeBottleAction(id: string) {
  await requireAuth()
  await removeBottle(id)
  revalidatePath('/')
}
