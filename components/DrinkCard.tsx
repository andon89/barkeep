import type { Drink } from '@/lib/types'

type CardDrink = Pick<Drink, 'name' | 'description' | 'ingredients' | 'instructions' | 'glassware' | 'garnish'>

const NO_GARNISH = /^(none|no garnish|n\/a|-)?$/i

export function DrinkCard({ drink, note }: { drink: CardDrink; note?: string }) {
  const garnish = NO_GARNISH.test(drink.garnish.trim()) ? '' : drink.garnish.trim()
  return (
    <article className="drink-card">
      <h3 className="font-display text-2xl text-wood-deep">{drink.name}</h3>
      <p className="font-display italic font-light text-lg mt-1">{drink.description}</p>
      <ul className="mt-3">
        {drink.ingredients.map((i, idx) => (
          <li key={idx} className="flex gap-3 py-0.5 border-b border-wood-deep/10">
            <span className="w-16 shrink-0 text-right font-medium">{i.amount}</span>
            <span>{i.item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3">{drink.instructions}</p>
      <p className="mt-2 text-sm text-wood-deep/70">{drink.glassware}{garnish ? `, ${garnish}` : ''}</p>
      {note && <p className="mt-3 text-sm font-display italic text-ember">{note}</p>}
    </article>
  )
}
