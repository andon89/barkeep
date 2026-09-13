import 'server-only'
import { supabase } from './supabase'
import type { Bottle, BottleStyle, Category } from './types'

export async function getBottles(): Promise<Bottle[]> {
  const { data, error } = await supabase.from('barkeep_bottles').select('*').order('sort_order')
  if (error) throw error
  return data as Bottle[]
}

export async function setBottleStock(id: string, inStock: boolean): Promise<void> {
  const { error } = await supabase.from('barkeep_bottles').update({ in_stock: inStock }).eq('id', id)
  if (error) throw error
}

export async function addBottle(input: { name: string; category: Category; style: BottleStyle }): Promise<Bottle> {
  const { data: last } = await supabase.from('barkeep_bottles').select('sort_order').eq('category', input.category).order('sort_order', { ascending: false }).limit(1)
  const sort_order = (last?.[0]?.sort_order ?? -1) + 1
  const { data, error } = await supabase.from('barkeep_bottles').insert({ ...input, sort_order }).select().single()
  if (error) throw error
  return data as Bottle
}

export async function removeBottle(id: string): Promise<void> {
  const { error } = await supabase.from('barkeep_bottles').delete().eq('id', id)
  if (error) throw error
}
