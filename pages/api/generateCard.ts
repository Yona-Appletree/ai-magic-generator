import { openai } from './util/openai'
import { type CardInfo } from '../../model/CardInfo'
import { apiHandler } from './util/apiHandler'

export interface GenerateCardApiRequest {
  '@response'?: GenerateCardApiResponse
  cardDesc: string
}

export interface GenerateCardApiResponse {
  card: CardInfo
}

export default apiHandler<GenerateCardApiRequest>(async (request) => {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: generatePrompt(request.cardDesc),
    temperature: 0.6,
    max_tokens: 2000,
    presence_penalty: 1,
    best_of: 1
  })

  const outputText = completion.data.choices[0].text ?? ''

  const outputFields: Array<readonly [string, string | null]> = outputText
    .split('\n')
    .map(it => it.match(/\s*(.*?)\s*:\s*(.*)/))
    .flatMap(it => it == null ? [] : [[it[1], it[2] ?? null]] as const)
    .filter(it => it.length)

  const field = (name: string) => (outputFields.find(it => it[0].toLowerCase().includes(name))?.[1] ?? '')

  return {
    card: {
      rarity: field('rarity'),
      color: field('color'),
      name: field('name'),
      cost: field('cost'),
      type: field('type'),
      abilities: field('abilities'),
      flavorText: field('flavor'),
      toughness: field('toughness'),
      imageDesc: field('image'),
      artist: field('artist'),
    }
  }
})

function generatePrompt (cardDesc: string): string {
  return `Describe a magic the gathering card, based on the theme, including rarity, color, name, cost, abilities, flavor text, toughness, image

  Prompt: Legendary black and green creature
  Name: Ghave, Guru of Spores
  Rarity: Legendary
  Color: black, green
  Cost: 1 colorless, 1 white
  Type: Legendary Creature — Fungus Shaman
  Abilities: Ghave, Guru of Spores enters the battlefield with five +1/+1 counters on it.<br>(1 colorless), Remove a +1/+1 counter from a creature you control: Create a 1/1 green Saproling creature token.<br>(1 colorless), Sacrifice a creature: Put a +1/+1 counter on target creature.
  Flavor Text: 
  Toughness: 0/0
  Image: A dark green monster with glowing eyes in a foggy forest
  Artist: James Paick

  Prompt: Dual color creature
  Name: Nimbus Swimmer
  Rarity: rare
  Color: green, blue
  Cost: X, 1 green, 1 blue
  Type: Creature — Leviathan
  Abilities: Flying<br>Nimbus Swimmer enters the battlefield with X +1/+1 counters on it.
  Flavor Text: The Simic soon discovered that the sky offered as few constraints on size as the sea.
  Toughness: 0/0
  Image: A green sea creature with a wide body, underwater
  Artist: Howard Lyon

  Prompt: Black creature
  Name: Stronghold Assassin
  Rarity: rare
  Color: black
  Cost: 1 colorless, 2 black
  Type: Creature — Zombie Assassin
  Abilities: (tap), Sacrifice a creature: Destroy target nonblack creature.
  Flavor Text: The assassin sees only throats and hears only heartbeats.
  Toughness: 2/1
  Image: A mutant humanoid with a deformed face and mask hold an eletric staff, another human being tortured with a tube in it's mouth
  Artist: Matthew D. Wilson

  Prompt: ${cardDesc}`
}
