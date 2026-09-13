import 'server-only'
import { supabase } from './supabase'
import type { Bottle, BottleStyle, Category, Drink, Job, JobKind, Menu } from './types'
import type { DrinkDraft } from './schemas'

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

export async function getActiveMenu(): Promise<{ menu: Menu; drinks: Drink[] } | null> {
  const { data: menu, error } = await supabase.from('barkeep_menus').select('*').eq('is_active', true).maybeSingle()
  if (error) throw error
  if (!menu) return null
  const { data: drinks, error: e2 } = await supabase.from('barkeep_drinks').select('*').eq('menu_id', menu.id).order('sort_order')
  if (e2) throw e2
  return { menu: menu as Menu, drinks: (drinks ?? []) as Drink[] }
}

export async function createMenu(input: { title: string; intro: string; prompt: string | null; drinks: DrinkDraft[] }): Promise<{ menu: Menu; drinks: Drink[] }> {
  const { error: e0 } = await supabase.from('barkeep_menus').update({ is_active: false }).eq('is_active', true)
  if (e0) throw e0
  const { data: menu, error: e1 } = await supabase.from('barkeep_menus').insert({ title: input.title, intro: input.intro, prompt: input.prompt, is_active: true }).select().single()
  if (e1) throw e1
  const rows = input.drinks.map((d, i) => ({ ...d, menu_id: menu.id, sort_order: i }))
  const { data: drinks, error: e2 } = await supabase.from('barkeep_drinks').insert(rows).select().order('sort_order')
  if (e2) throw e2
  return { menu: menu as Menu, drinks: drinks as Drink[] }
}

export async function createJob(kind: JobKind, input: Record<string, unknown>): Promise<Job> {
  const { data, error } = await supabase.from('barkeep_jobs').insert({ kind, input }).select().single()
  if (error) throw error
  return data as Job
}
export async function getJob(id: string): Promise<Job | null> {
  const { data, error } = await supabase.from('barkeep_jobs').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return (data as Job) ?? null
}
export async function finishJob(id: string, result: Record<string, unknown>): Promise<void> {
  const { error } = await supabase.from('barkeep_jobs').update({ status: 'done', result }).eq('id', id)
  if (error) throw error
}
export async function failJob(id: string, message: string): Promise<void> {
  const { error } = await supabase.from('barkeep_jobs').update({ status: 'failed', error: message }).eq('id', id)
  if (error) throw error
}
