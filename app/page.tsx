import { getBottles, getActiveMenu } from '@/lib/data'
import { isAuthed } from '@/lib/session'
import { BarScene } from '@/components/BarScene'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [bottles, active, authed] = await Promise.all([getBottles(), getActiveMenu(), isAuthed()])
  return <BarScene bottles={bottles} menu={active?.menu ?? null} drinks={active?.drinks ?? []} authed={authed} />
}
