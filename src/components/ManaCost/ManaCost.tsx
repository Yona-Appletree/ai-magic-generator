import styles from './ManaCost.module.scss'

export const manaColors = ['colorless', 'white', 'red', 'blue', 'black', 'green'] as const
export type ManaColorName = typeof manaColors[number]

const colorLettersMap = {
  R: 'red',
  W: 'white',
  U: 'blue',
  B: 'black',
  G: 'green',
} as const

export type CardBorderColor = 'gold' | 'silver' | ManaColorName

export const colorToBgClassRecord: Record<CardBorderColor, {
  bg: string
  border: string
}> = {
  colorless: {
    bg: 'bg-gray-300',
    border: 'border-gray-300'
  },
  white: {
    bg: 'bg-white',
    border: 'border-white'
  },
  red: {
    bg: 'bg-red-800',
    border: 'border-red-600'
  },
  blue: {
    bg: 'bg-blue-800',
    border: 'border-blue-600'
  },
  black: {
    bg: 'bg-gray-800',
    border: 'border-gray-600'
  },
  green: {
    bg: 'bg-green-800',
    border: 'border-green-600'
  },
  gold: {
    bg: 'bg-yellow-300',
    border: 'border-yellow-300'
  },
  silver: {
    bg: 'bg-gray-300',
    border: 'border-gray-300'
  }
}

export type ManaColorLetter = keyof typeof colorLettersMap

export function ManaColorIcon ({ value }: {
  value: string
}) {
  if (!isNaN(parseInt(value))) {
    return <div className={styles.mana + ' ' + styles['mana-colorless']}>{value}</div>
  } else if (value in colorLettersMap) {
    return <div className={styles.mana + ' ' + styles[`mana-${colorLettersMap[value as ManaColorLetter]}`]}>{value}</div>
  } else {
    return <div className={styles.mana + ' ' + styles['mana-colorless']}>?</div>
  }
}

export function ManaCost ({ cost }: {
  cost: string
}) {
  return <div className={styles.manaCost}>
    { Array.from(cost).map((color, i) => <ManaColorIcon key={i} value={color} />) }
  </div>
}
