export interface CardInfo {
  rarity: string
  color: string
  name: string
  cost: string
  type: string
  abilities: string
  flavorText: string
  toughness: string
  imageDesc: string
  artist: string
}

export const emptyCard = {
  rarity: '',
  color: 'white',
  name: 'No card',
  cost: '',
  type: 'Blank',
  artist: 'Some coder',
  abilities: 'Go ahead and generate a card! You\'ll have fun.',
  flavorText: '"Proudly made by a human."',
  toughness: 'X/X',
  imageDesc: '',
} as const satisfies CardInfo

export const loadingCard = {
  rarity: '',
  color: 'white',
  name: 'Generating...',
  cost: '',
  type: 'AI Magic',
  artist: 'GPT-3',
  abilities: 'Dark AI magic is at work generating this card, Ursa would be proud.',
  flavorText: '"Creativity is the essence of magic."',
  toughness: 'X/X',
  imageDesc: '',
} as const satisfies CardInfo
