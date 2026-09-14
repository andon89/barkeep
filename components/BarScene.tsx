'use client'
import { useState } from 'react'
import { BarStateProvider } from './BarState'
import { BackBar } from './BackBar'
import { ManageBottlesDrawer } from './ManageBottlesDrawer'
import { SceneHeader } from './SceneHeader'
import { Robot } from './Robot'
import { Chalkboard } from './Chalkboard'
import { Counter } from './Counter'
import type { Bottle, Drink, Menu } from '@/lib/types'

export function BarScene({ bottles, menu, drinks, authed }: { bottles: Bottle[]; menu: Menu | null; drinks: Drink[]; authed: boolean }) {
  const [manageOpen, setManageOpen] = useState(false)
  return (
    <BarStateProvider authed={authed}>
      <main className="scene">
        <SceneHeader authed={authed} onManage={authed ? () => setManageOpen(true) : undefined} />
        <BackBar bottles={bottles} />
        <div className="counter-area">
          <div className="counter-grid">
            <Robot />
            <Chalkboard menu={menu} drinks={drinks} />
          </div>
        </div>
        <div className="counter-dock" data-guest={!authed || undefined}>
          <Counter />
          <div className="bar-top" />
        </div>
      </main>
      {authed && <ManageBottlesDrawer bottles={bottles} open={manageOpen} onClose={() => setManageOpen(false)} />}
    </BarStateProvider>
  )
}
