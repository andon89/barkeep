import { SEED_BOTTLES } from '../lib/seed-bottles'

const esc = (v: string) => v.replace(/'/g, "''")
const perCategory = new Map<string, number>()
const rows = SEED_BOTTLES.map((b) => {
  const order = perCategory.get(b.category) ?? 0
  perCategory.set(b.category, order + 1)
  return `  ('${esc(b.name)}', '${esc(b.category)}', ${order}, '${esc(JSON.stringify(b.style))}'::jsonb)`
})
process.stdout.write(`insert into barkeep_bottles (name, category, sort_order, style) values\n${rows.join(',\n')};\n`)
