'use client'
import { useState } from 'react'
import { BarStateProvider } from './BarState'
import { BackBar } from './BackBar'
import { ManageBottlesDrawer } from './ManageBottlesDrawer'
import { SceneHeader } from './SceneHeader'
import { Robot } from './Robot'
import { Chalkboard } from './Chalkboard'
import type { Bottle, Drink, Menu } from '@/lib/types'

export function BarScene({ bottles, menu, drinks }: { bottles: Bottle[]; menu: Menu | null; drinks: Drink[] }) {
  const [manageOpen, setManageOpen] = useState(false)
  return (
    <BarStateProvider>
      <main className="scene">
        <SceneHeader onManage={() => setManageOpen(true)} />
        <BackBar bottles={bottles} />
        <div className="counter-area">
          <div className="counter-grid">
            <Robot />
            <Chalkboard menu={menu} drinks={drinks} />
          </div>
        </div>
        <div className="bar-top" />
      </main>
      <ManageBottlesDrawer bottles={bottles} open={manageOpen} onClose={() => setManageOpen(false)} />
    </BarStateProvider>
  )
}
