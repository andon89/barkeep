import Link from 'next/link'

export function SceneHeader({ authed, onManage, backLink }: { authed: boolean; onManage?: () => void; backLink?: boolean }) {
  return (
    <header className="scene-header">
      <Link href="/" className="sign text-3xl sm:text-4xl">Barkeep</Link>
      <nav className="flex gap-5 items-center">
        {backLink ? (
          <Link href="/" className="quiet-link">Back to the bar</Link>
        ) : (
          <Link href="/history" className="quiet-link">Past menus</Link>
        )}
        {onManage && <button type="button" className="quiet-link" onClick={onManage}>Bottles</button>}
        {!authed && <Link href="/login" className="quiet-link">Doorman</Link>}
      </nav>
    </header>
  )
}
