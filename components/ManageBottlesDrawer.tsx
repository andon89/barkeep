'use client'
import { useMemo, useState, useTransition, FormEvent } from 'react'
import { addBottleAction, removeBottleAction } from '@/app/actions'
import { defaultStyle, groupByCategory, labelTextFor } from '@/lib/bottle-defaults'
import { Bottle } from './Bottle'
import { useDialogRef } from './useDialogRef'
import { CATEGORIES, SHAPE_NAMES, type Bottle as BottleRow, type BottleStyle, type Category } from '@/lib/types'

export function ManageBottlesDrawer({ bottles, open, onClose }: { bottles: BottleRow[]; open: boolean; onClose: () => void }) {
  const ref = useDialogRef(open)
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('Liqueurs')
  const [style, setStyle] = useState<BottleStyle>(() => defaultStyle('Liqueurs', ''))
  const [labelText, setLabelText] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const groups = useMemo(() => groupByCategory(bottles), [bottles])

  function pickCategory(c: Category) {
    setCategory(c)
    setStyle(defaultStyle(c, name))
  }
  const setField = (key: keyof BottleStyle) => (e: { target: { value: string } }) => setStyle((s) => ({ ...s, [key]: e.target.value }))

  const preview = { ...style, labelText: labelText || labelTextFor(name) || 'LABEL' }

  function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const { error } = await addBottleAction({ name, category, style: preview })
      if (error) return setError(error)
      setName(''); setLabelText('')
    })
  }

  function remove(id: string) {
    if (confirmId !== id) { setConfirmId(id); return }
    startTransition(async () => {
      const { error } = await removeBottleAction(id)
      setError(error)
      setConfirmId(null)
    })
  }

  function handleClose() {
    setConfirmId(null)
    onClose()
  }

  return (
    <dialog ref={ref} className="drawer" onClose={handleClose} aria-label="Manage bottles">
      <div className="drawer-inner">
        <div className="drawer-head">
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
              <select className="napkin-input" value={style.shape} onChange={setField('shape')}>
                {SHAPE_NAMES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="drawer-field">Liquid<input type="color" value={style.liquid} onChange={setField('liquid')} /></label>
            <label className="drawer-field">Label<input type="color" value={style.label} onChange={setField('label')} /></label>
            <label className="drawer-field">Cap and text<input type="color" value={style.accent} onChange={setField('accent')} /></label>
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
              {groups[c].map((b) => (
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
