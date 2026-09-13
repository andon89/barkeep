import Link from 'next/link'

export function SceneHeader({ onManage }: { onManage?: () => void }) {
  return (
    <header className="scene-header">
      <Link href="/" className="sign text-3xl sm:text-4xl">Barkeep</Link>
      <nav className="flex gap-5 items-center">
        <Link href="/history" className="quiet-link">Past menus</Link>
        {onManage && <button type="button" className="quiet-link" onClick={onManage}>Bottles</button>}
      </nav>
    </header>
  )
}
