'use server'
import { revalidatePath } from 'next/cache'
import { addBottle, removeBottle, setBottleStock } from '@/lib/data'
import { requireAuth } from '@/lib/session'
import { CATEGORIES, SHAPE_NAMES, type BottleStyle, type Category } from '@/lib/types'

const HEX = /^#[0-9a-f]{6}$/i

export async function toggleBottleAction(id: string, inStock: boolean) {
  await requireAuth()
  await setBottleStock(id, inStock)
  revalidatePath('/')
}

export async function addBottleAction(input: { name: string; category: Category; style: BottleStyle }) {
  await requireAuth()
  const name = input.name.trim().slice(0, 80)
  if (!name) throw new Error('Name is required')
  if (!CATEGORIES.includes(input.category)) throw new Error('Unknown category')
  if (!SHAPE_NAMES.includes(input.style.shape)) throw new Error('Unknown shape')
  for (const key of ['glass', 'liquid', 'label', 'accent'] as const) {
    if (!HEX.test(input.style[key])) throw new Error(`Bad colour for ${key}`)
  }
  const style = { ...input.style, labelText: input.style.labelText.trim().slice(0, 16) || name.toUpperCase().slice(0, 12) }
  await addBottle({ name, category: input.category, style })
  revalidatePath('/')
}

export async function removeBottleAction(id: string) {
  await requireAuth()
  await removeBottle(id)
  revalidatePath('/')
}
