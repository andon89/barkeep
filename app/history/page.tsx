import { getHistory } from '@/lib/data'
import { isAuthed } from '@/lib/session'
import { DrinkCard } from '@/components/DrinkCard'
import { SceneHeader } from '@/components/SceneHeader'
import { BAR_TIME_ZONE } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const fmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: BAR_TIME_ZONE })

export default async function HistoryPage() {
  const [{ menus, offMenu }, authed] = await Promise.all([getHistory(), isAuthed()])
  return (
    <main className="history">
      <SceneHeader authed={authed} backLink />

      <div className="history-body">
        <h1 className="font-display text-3xl text-brass">Past menus</h1>
        {menus.length === 0 && <p className="text-cream-dim mt-2">No menus yet. Ask the bartender to write one.</p>}
        {menus.map(({ menu, drinks }) => (
          <section key={menu.id} className="history-menu">
            <h2 className="font-display text-2xl">{menu.title}</h2>
            <p className="text-cream-dim text-sm">{fmt.format(new Date(menu.created_at))}{menu.prompt ? `, theme: ${menu.prompt}` : ''}{menu.is_active ? ', on the board now' : ''}</p>
            <p className="font-display italic font-light mt-1">{menu.intro}</p>
            <div className="mt-2 grid gap-2">
              {drinks.map((d) => (
                <details key={d.id} className="history-drink">
                  <summary>{d.name}</summary>
                  <div className="mt-2"><DrinkCard drink={d} /></div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <h1 className="font-display text-3xl text-brass mt-10">Off the menu</h1>
        {offMenu.length === 0 && <p className="text-cream-dim mt-2">Nothing improvised yet.</p>}
        <div className="mt-2 grid gap-2">
          {offMenu.map((d) => (
            <details key={d.id} className="history-drink">
              <summary>{d.name}<span className="text-cream-dim text-sm"> for &ldquo;{d.source_prompt}&rdquo;</span></summary>
              <div className="mt-2"><DrinkCard drink={d} /></div>
            </details>
          ))}
        </div>
      </div>
    </main>
  )
}
