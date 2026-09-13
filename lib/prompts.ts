import type { Bottle, Drink } from './types'

type StockBottle = Pick<Bottle, 'name' | 'category' | 'in_stock'>
type MenuDrink = Pick<Drink, 'id' | 'name' | 'ingredients'>

const PANTRY = [
  'fresh lemon, lime, orange and grapefruit (juice and peel)',
  'simple syrup, honey syrup, demerara syrup',
  'sugar, salt, black pepper',
  'egg white',
  'soda water, tonic water, ginger beer, cola',
  'hot coffee, cream, whole milk',
  'fresh mint and basil',
  'ice',
]

export const BARTENDER_SYSTEM = `You are Barkeep, a riveted tin robot who tends a well-stocked home bar. You are warm, dry, and brief. Short sentences. No emojis, no exclamation marks.

Rules for every drink you propose:
- Spirits, liqueurs, fortified wines, amari and bitters must come from the in-stock list below, named exactly as listed. Never use a bottle that is not on the list.
- You may freely assume these pantry staples even though they are not on the list: ${PANTRY.join('; ')}.
- Measurements in ounces (oz) and dashes. Three to six ingredients per drink.
- Instructions are one short paragraph: technique (shake, stir, build), then strain and serve.
- Name drinks the way a good bar does: classic names for classics, short evocative names for originals. Nothing cute or punny.`

const DRINK_SHAPE = `{"name": string, "description": string (one or two sentences, your voice), "ingredients": [{"item": string, "amount": string}], "instructions": string, "glassware": string, "garnish": string}`

export function buildInventoryBlock(bottles: StockBottle[]): string {
  const lines = bottles.filter((b) => b.in_stock).map((b) => `- ${b.name} (${b.category})`)
  return `In stock tonight:\n${lines.join('\n')}`
}

export function buildMenuPrompt(bottles: StockBottle[], theme: string | null): string {
  const themeLine = theme
    ? `Tonight's theme, from the host: "${theme}"`
    : 'No theme tonight. Read the shelf and pick a spread that shows it off: vary the base spirit, and balance stirred and shaken, bright and bitter.'
  return `${BARTENDER_SYSTEM}

${buildInventoryBlock(bottles)}

Write tonight's menu: five drinks. Give the menu a two-to-four-word title and a one-sentence intro in your own voice.
${themeLine}

Respond with a single JSON object and nothing else, shaped exactly like:
{"title": string, "intro": string, "drinks": [${DRINK_SHAPE}]}`
}

export function buildMakeMePrompt(bottles: StockBottle[], request: string, menuDrinks: MenuDrink[]): string {
  const menu = menuDrinks.length
    ? menuDrinks.map((d) => `- [${d.id}] ${d.name}: ${d.ingredients.map((i) => i.item).join(', ')}`).join('\n')
    : '- (nothing on the board yet)'
  return `${BARTENDER_SYSTEM}

${buildInventoryBlock(bottles)}

Tonight's menu:
${menu}

A guest says: "${request}"

If one of tonight's menu drinks fits what they asked for, set menu_drink_id to its id (the text in square brackets) and set drink to null. Otherwise set menu_drink_id to null and make them a new drink from the shelf. Either way, reply in one or two sentences as you hand it over.

Respond with a single JSON object and nothing else, shaped exactly like:
{"reply": string, "menu_drink_id": string | null, "drink": ${DRINK_SHAPE} | null}`
}
