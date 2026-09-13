'use client'
import { createContext, useContext, useState } from 'react'

export type RobotState = 'idle' | 'mixing' | 'presenting'
interface BarState {
  robot: RobotState
  setRobot: (s: RobotState) => void
  speech: string
  setSpeech: (s: string) => void
}
const Ctx = createContext<BarState | null>(null)

export function BarStateProvider({ children }: { children: React.ReactNode }) {
  const [robot, setRobot] = useState<RobotState>('idle')
  const [speech, setSpeech] = useState("Evening. What'll it be?")
  return <Ctx.Provider value={{ robot, setRobot, speech, setSpeech }}>{children}</Ctx.Provider>
}

export function useBarState(): BarState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useBarState must be used inside BarStateProvider')
  return v
}
