'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type RobotState = 'idle' | 'mixing' | 'presenting'
interface BarState {
  robot: RobotState
  setRobot: (s: RobotState) => void
  speech: string
  setSpeech: (s: string) => void
  busy: boolean
  setBusy: (b: boolean) => void
}
const Ctx = createContext<BarState | null>(null)

const PRESENTING_TIMEOUT_MS = 20_000

export function BarStateProvider({ children }: { children: React.ReactNode }) {
  const [robot, setRobot] = useState<RobotState>('idle')
  const [speech, setSpeech] = useState("Evening. What'll it be?")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (robot !== 'presenting') return
    const timeout = setTimeout(() => setRobot('idle'), PRESENTING_TIMEOUT_MS)
    return () => clearTimeout(timeout)
  }, [robot])

  return <Ctx.Provider value={{ robot, setRobot, speech, setSpeech, busy, setBusy }}>{children}</Ctx.Provider>
}

export function useBarState(): BarState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useBarState must be used inside BarStateProvider')
  return v
}
