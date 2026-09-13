import { getBottles } from '@/lib/data'
import { BarScene } from '@/components/BarScene'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const bottles = await getBottles()
  return <BarScene bottles={bottles} />
}
