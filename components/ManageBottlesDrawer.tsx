'use client'
import { useEffect, useRef, useState, useTransition, FormEvent } from 'react'
import { addBottleAction, removeBottleAction } from '@/app/actions'
import { defaultStyle, labelTextFor } from '@/lib/bottle-defaults'
import { Bottle } from './Bottle'
import { CATEGORIES, SHAPE_NAMES, type Bottle as BottleRow, type Category, type Shape } from '@/lib/types'

export function ManageBottlesDrawer({ bottles, open, onClose }: { bottles: BottleRow[]; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('Liqueurs')
  const [shape, setShape] = useState<Shape>(defaultStyle('Liqueurs', '').shape)
  const [liquid, setLiquid] = useState(defaultStyle('Liqueurs', '').liquid)
  const [label, setLabel] = useState(defaultStyle('Liqueurs', '').label)
  const [accent, setAccent] = useState(defaultStyle('Liqueurs', '').accent)
  const [labelText, setLabelText] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  function pickCategory(c: Category) {
    setCategory(c)
    const d = defaultStyle(c, name)
    setShape(d.shape); setLiquid(d.liquid); setLabel(d.label); setAccent(d.accent)
  }

  const preview = { shape, glass: defaultStyle(category, name).glass, liquid, label, accent, labelText: labelText || labelTextFor(name) || 'LABEL' }

  function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await addBottleAction({ name, category, style: preview })
        setName(''); setLabelText('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not add that bottle.')
      }
    })
  }

  function remove(id: string) {
    if (confirmId !== id) { setConfirmId(id); return }
    startTransition(async () => {
      try {
        await removeBottleAction(id)
        setConfirmId(null)
      } catch {
        setError("Couldn't remove that bottle. Try again.")
        setConfirmId(null)
      }
    })
  }

  function handleClose() {
    setConfirmId(null)
    onClose()
  }

  return (
    <dialog ref={ref} className="drawer" onClose={handleClose} aria-label="Manage bottles">
      <div className="drawer-inner">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-brass">Bottles</h2>
          <button type="button" className="quiet-link" onClick={handleClose}>Close</button>
        </div>

        <form onSubmit={submit} className="drawer-form">
          <div className="flex gap-3 items-end">
            <Bottle style={preview} height={90} />
            <div className="flex-1 grid gap-2">
              <input className="napkin-input" placeholder="Bottle name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Bottle name" required />
              <select className="napkin-input" value={category} onChange={(e) => pickCategory(e.target.value as Category)} aria-label="Category">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            <label className="drawer-field">Shape
              <select className="napkin-input" value={shape} onChange={(e) => setShape(e.target.value as Shape)}>
                {SHAPE_NAMES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="drawer-field">Liquid<input type="color" value={liquid} onChange={(e) => setLiquid(e.target.value)} /></label>
            <label className="drawer-field">Label<input type="color" value={label} onChange={(e) => setLabel(e.target.value)} /></label>
            <label className="drawer-field">Cap and text<input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} /></label>
          </div>
          <div className="flex gap-2 mt-2">
            <input className="napkin-input flex-1 min-w-0" placeholder={labelTextFor(name) || 'Label text'} value={labelText} onChange={(e) => setLabelText(e.target.value)} aria-label="Label text" maxLength={16} />
            <button className="brass-button" type="submit" disabled={pending || !name.trim()}>Add to the shelf</button>
          </div>
          {error && <p role="alert" className="text-amber mt-2">{error}</p>}
        </form>

        {CATEGORIES.map((c) => (
          <section key={c} className="mt-5">
            <h3 className="font-display italic text-cream-dim">{c}</h3>
            <ul className="mt-1">
              {bottles.filter((b) => b.category === c).map((b) => (
                <li key={b.id} className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className={b.in_stock ? '' : 'text-cream-dim line-through'}>{b.name}</span>
                  <button type="button" className="quiet-link" onClick={() => remove(b.id)} disabled={pending}>
                    {confirmId === b.id ? 'Remove for good?' : 'Remove'}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </dialog>
  )
}
