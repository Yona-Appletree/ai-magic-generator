import { type CardBorderColor, type ManaColorName } from '../components/ManaCost/ManaCost'

export const cardRarities = [
  'Common', 'Uncommon', 'Rare', 'Mythic'
]
export type CardRarity = typeof cardRarities[number]

export const defaultPreamble = `Create a Magic: The Gathering card.

The card may not be mechanically identical to any existing Magic: The Gathering Card. The card name may not be the same as any existing Magic: The Gathering Card.

The card should be designed as if it had been made in the year [releaseYear]. Therefore, none of its abilities should have been first released on a Magic: The Gathering card printed after [releaseYear]. As an example, a card printed in 1999 cannot have the keyword ability "infect".

The art description is a brief passage that describes the card’s illustration.

The card’s supertypes, types, and subtypes should all be appropriate to the card’s color, mechanics, release year, and name.

If it’s a planeswalker, the card needs a loyalty value. If it’s a creature, it needs power and toughness.

The card’s rarity is [rarity].

The collector number should be appropriate for the card color and rarity.

The illustrator name may not be the same as any existing Magic: The Gathering artist. You may choose famous illustrators or painters from history, or invent the name of an illustrator from a random combination of first names and surnames from around the world. 

The flavor text should be consistent with Magic: The Gathering design and the card’s release year and plane. For instance, older cards from before the year 2000 may have classic poetry or literature. Cards from after the year 1998 might have quotations from in-game characters that existed at the appropriate year. A card from the plane of Rath might have a quotation from Volrath or Greven-il-vec, while a card from the plane of Mirage might have an excerpt from the Love Song of Night and Day.

The card’s color should be consistent with the card’s name and mechanics. The card must adhere to the "color pie". This means that it must not have mechanical abilities, or power/toughness, that are not appropriate for its color. As an example, a common green creature may tap to generate mana, but a blue or red creature usually will not have this ability without a restriction. A common blue creature may have flying, but a common green creature generally may not. A common red spell may not destroy enchantments. The card design must adhere to the color pie.

The card’s theme should be: [card theme].

The card’s complexity should be [complexity], on a scale where 0 is a very simple vanilla card with no abilities like Gray Ogre, and a 100 is a very complex card with many lines of text and several abilities like Ice Cauldron.

The card’s power level should be [power level], on a scale where 0 is an extremely weak, unplayable card like Zephyr Spirit or Wood Elemental, and 100 is an extremely powerful card like Ancestral Recall or Black Lotus.

The card should belong to [plane]. If no plane is chosen, then it should belong to a completely new plane consistent with general Magic: The Gathering plane design.

The card’s abilities in its text box should be written in the standard Magic: The Gathering syntax and style for the release year. The card’s abilities should strictly adhere to Magic: The Gathering rules, and should not include any references to abilities or mechanics that are not clearly defined by the card itself or by the comprehensive rules of Magic: The Gathering. The card’s abilities should be consistent with its release year, and with its color, power level, and complexity level.`

export interface CardPrompt {
  preamble: string
  cardTheme: string
  releaseYear: string
  plane: string
  rarity: CardRarity
  powerLevel: number
  complexity: number
}

export function withoutPreamble (prompt: CardPrompt): Omit<CardPrompt, 'preamble'> {
  const { preamble, ...rest } = prompt
  return rest
}

export interface CardInfo {
  cardName: string
  releaseYear: string
  manaCost: string
  artDescription: string
  cardSupertypes: string
  type: string
  subtypes: string
  rarity: CardRarity
  rulesText: string[]
  reminderText: string
  flavorText: string
  power: string
  toughness: string
  loyalty: string
  artistName: string
  collectorsNumber: number
  cardColors: ManaColorName[]
  cardBorder: CardBorderColor
}

export interface CardExample {
  prompt: CardPrompt
  result: CardInfo
}

export interface CardGenerationResult {
  userPrompt: CardPrompt
  promptText: string
  resultText: string
  resultCard: CardInfo
}

export const cardExamples: CardExample[] = [
  {
    prompt: {
      preamble: defaultPreamble,
      cardTheme: 'Zombie Card',
      releaseYear: '1995',
      rarity: 'common',
      powerLevel: 50,
      complexity: 50,
      plane: '',
    },
    result: {
      cardName: 'Rotting Ghouls',
      releaseYear: '1995',
      manaCost: '1BB',
      artDescription: 'A horde of rotting zombies, shambling towards the viewer in a moonlit, barren moor.',
      cardSupertypes: '',
      type: 'Creature',
      subtypes: 'Zombie',
      rarity: 'Common',
      rulesText: ['Menace. Rotting Ghouls can’t block.'],
      reminderText: 'A creature with menace can’t be blocked except by two or more creatures.',
      flavorText: 'And the will therein lieth, which dieth not. Who knoweth the mysteries of the will, with its vigor? - Joseph Glanvill',
      power: '',
      toughness: '',
      loyalty: '',
      artistName: 'Vincent Van Gogh',
      collectorsNumber: 121,
      cardColors: ['black'],
      cardBorder: 'black',
    }
  },

  {
    prompt: {
      preamble: defaultPreamble,
      cardTheme: 'powerful legend',
      releaseYear: '2022',
      rarity: 'mythic',
      powerLevel: 90,
      complexity: 80,
      plane: 'any',
    },
    result: {
      cardName: 'Balgaroth, Ravener of Worlds',
      releaseYear: '2022',
      manaCost: 'RRBB',
      artDescription: 'A powerful demon resembling a Balrog from The Lord of the Rings wields a flaming whip made of human vertebrae, flailing them across a massive, darkened stone hall littered with skulls of various species',
      cardSupertypes: 'Legendary',
      type: 'Planeswalker',
      subtypes: 'Balgaroth',
      rarity: 'Mythic',
      rulesText: [
        '[+0]: Each opponent sacrifices a creature.',
        '[-1]: Each opponent discards two cards.',
        '[−4]: Deal 6 damage to each creature and player.'
      ],
      reminderText: '',
      flavorText: '',
      power: '',
      toughness: '',
      loyalty: '5',
      artistName: 'Zdzisław Beksiński',
      collectorsNumber: 121,
      cardColors: ['red', 'black'],
      cardBorder: 'gold',
    }
  },
  {
    prompt: {
      preamble: defaultPreamble,
      cardTheme: 'A Garruk-themed fight spell',
      releaseYear: '2020',
      rarity: 'uncommon',
      powerLevel: 50,
      complexity: 60,
      plane: '',
    },

    result: {
      cardName: 'Garruk’s Brawn',
      releaseYear: '2020',
      manaCost: '2G',
      artDescription: 'Garruk is wrestling with a bear, bringing it to the ground in a dramatic fight scene set in a forested grove',
      cardSupertypes: '',
      type: 'Sorcery',
      subtypes: '',
      rarity: 'Uncommon',
      rulesText: [
        'Target creature you control gets +3/+3 and gains trample until end of turn. It fights target creature you don’t control.'
      ],
      reminderText: '',
      flavorText: 'Down, boy! -Garruk Wildspeaker',
      power: '',
      toughness: '',
      loyalty: '',
      artistName: 'Dambisa López',
      collectorsNumber: 203,
      cardColors: ['green'],
      cardBorder: 'green',
    }
  }
]

export const emptyCardPrompt: CardPrompt = {
  preamble: defaultPreamble,
  cardTheme: '',
  releaseYear: '2025',
  rarity: 'common',
  powerLevel: 50,
  complexity: 50,
  plane: ''
}

export const emptyCard = cardExamples[0].result
