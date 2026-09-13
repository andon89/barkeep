import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Bottle, Drink, Menu } from './types'

vi.mock('./data')
vi.mock('./claude')

import { runMakeJob } from './jobs'
import { runClaude } from './claude'
import * as data from './data'

const mockRunClaude = vi.mocked(runClaude)
const mockData = vi.mocked(data)

function makeBottle(overrides: Partial<Bottle> = {}): Bottle {
  return {
    id: 'b1',
    name: 'Campari',
    category: 'Aperitifs & Vermouth',
    in_stock: true,
    style: { shape: 'standard', glass: '#3e8e3a', liquid: '#8c1d2a', label: '#f3e7cf', labelText: 'Campari', accent: '#c9a24b' },
    sort_order: 0,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function makeMenu(overrides: Partial<Menu> = {}): Menu {
  return { id: 'menu1', title: 'Tonight', intro: 'Enjoy.', prompt: null, is_active: true, created_at: '2026-01-01T00:00:00Z', ...overrides }
}

function makeDrink(overrides: Partial<Drink> = {}): Drink {
  return {
    id: 'drink1',
    menu_id: 'menu1',
    name: 'Negroni',
    description: 'Bitter and bright.',
    ingredients: [{ item: 'Campari', amount: '1 oz' }],
    instructions: 'Stir with ice, strain over a large cube.',
    glassware: 'Rocks',
    garnish: 'Orange peel',
    source_prompt: null,
    sort_order: 0,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

const draft = {
  name: 'Paper Plane',
  description: 'Equal parts, bittersweet.',
  ingredients: [{ item: 'Campari', amount: '0.75 oz' }],
  instructions: 'Shake with ice, double strain.',
  glassware: 'Coupe',
  garnish: 'None',
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('runMakeJob', () => {
  it('finishes with an on-menu drink and does not save an off-menu drink', async () => {
    const bottles = [makeBottle()]
    const menu = makeMenu()
    const drink = makeDrink()
    mockData.getBottles.mockResolvedValue(bottles)
    mockData.getActiveMenu.mockResolvedValue({ menu, drinks: [drink] })
    mockRunClaude.mockResolvedValue({ text: JSON.stringify({ reply: 'Here.', menu_drink_id: drink.id, drink: null }), timings: {} })

    await runMakeJob('job1', 'something bitter')

    expect(mockData.finishJob).toHaveBeenCalledWith('job1', { reply: 'Here.', drink, onMenu: true })
    expect(mockData.saveOffMenuDrink).not.toHaveBeenCalled()
    expect(mockData.failJob).not.toHaveBeenCalled()
  })

  it('saves and serves a new off-menu drink', async () => {
    const bottles = [makeBottle()]
    const menu = makeMenu()
    const onMenuDrink = makeDrink()
    const savedDrink = makeDrink({ id: 'drink2', menu_id: null, name: draft.name, source_prompt: 'something new' })
    mockData.getBottles.mockResolvedValue(bottles)
    mockData.getActiveMenu.mockResolvedValue({ menu, drinks: [onMenuDrink] })
    mockData.saveOffMenuDrink.mockResolvedValue(savedDrink)
    mockRunClaude.mockResolvedValue({ text: JSON.stringify({ reply: 'Fresh one.', menu_drink_id: null, drink: draft }), timings: {} })

    await runMakeJob('job2', 'something new')

    expect(mockData.saveOffMenuDrink).toHaveBeenCalledWith(draft, 'something new')
    expect(mockData.finishJob).toHaveBeenCalledWith('job2', { reply: 'Fresh one.', drink: savedDrink, onMenu: false })
    expect(mockData.failJob).not.toHaveBeenCalled()
  })

  it('fails the job when the shelf is empty', async () => {
    mockData.getBottles.mockResolvedValue([makeBottle({ in_stock: false })])
    mockData.getActiveMenu.mockResolvedValue(null)

    await runMakeJob('job3', 'anything')

    expect(mockData.failJob).toHaveBeenCalledWith('job3', expect.stringMatching(/^Nothing on the shelf/))
    expect(mockRunClaude).not.toHaveBeenCalled()
    expect(mockData.finishJob).not.toHaveBeenCalled()
  })
})
