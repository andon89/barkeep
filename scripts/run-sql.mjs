import fs from 'node:fs'

const [arg] = process.argv.slice(2)
const token = process.env.SUPABASE_ACCESS_TOKEN
if (!arg || !token) {
  console.error('usage: SUPABASE_ACCESS_TOKEN=... node scripts/run-sql.mjs <file.sql | "select ...">')
  process.exit(1)
}
const query = arg.endsWith('.sql') ? fs.readFileSync(arg, 'utf8') : arg
const res = await fetch('https://api.supabase.com/v1/projects/pxevaaqtducqbivbsqfp/database/query', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
})
console.log(res.status, await res.text())
if (!res.ok) process.exit(1)
