'use client'
import { useState } from 'react'
import { BarStateProvider } from './BarState'
import { BackBar } from './BackBar'
import { ManageBottlesDrawer } from './ManageBottlesDrawer'
import { SceneHeader } from './SceneHeader'
import type { Bottle } from '@/lib/types'

export function BarScene({ bottles }: { bottles: Bottle[] }) {
  const [manageOpen, setManageOpen] = useState(false)
  return (
    <BarStateProvider>
      <main className="scene">
        <SceneHeader onManage={() => setManageOpen(true)} />
        <BackBar bottles={bottles} />
        <div className="counter-area" />
        <div className="bar-top" />
      </main>
      <ManageBottlesDrawer bottles={bottles} open={manageOpen} onClose={() => setManageOpen(false)} />
    </BarStateProvider>
  )
}
