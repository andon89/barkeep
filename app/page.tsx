import { getBottles, getActiveMenu } from '@/lib/data'
import { BarScene } from '@/components/BarScene'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [bottles, active] = await Promise.all([getBottles(), getActiveMenu()])
  return <BarScene bottles={bottles} menu={active?.menu ?? null} drinks={active?.drinks ?? []} />
}
